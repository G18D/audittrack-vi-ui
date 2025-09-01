const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DocumentFile {
  id: number;
  name: string;
  size: string;
  status: 'Passed' | 'Flagged' | 'Manual Review';
  issues: number;
  vendor: string;
  uploadedAt: string;
  amount: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  files?: DocumentFile[];
}

export interface DashboardStats {
  documentsProcessed: {
    value: string;
    hint: string;
    trend: 'up' | 'down' | 'neutral';
  };
  issuesResolved: {
    value: string;
    hint: string;
    trend: 'up' | 'down' | 'neutral';
  };
  avgProcessingTime: {
    value: string;
    hint: string;
    trend: 'up' | 'down' | 'neutral';
  };
  totalSavings: {
    value: string;
    hint: string;
    trend: 'up' | 'down' | 'neutral';
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }

  // Documents
  async getDocuments(): Promise<DocumentFile[]> {
    return this.request<DocumentFile[]>('/api/documents');
  }

  async uploadDocuments(files: File[]): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Search
  async searchDocuments(query: string): Promise<DocumentFile[]> {
    return this.request<DocumentFile[]>(`/api/documents/search?q=${encodeURIComponent(query)}`);
  }

  // Compliance
  async getComplianceScore(): Promise<{
    overall: number;
    irs: number;
    usviDol: number;
  }> {
    return this.request('/api/compliance/score');
  }

  // Knowledge Base
  async getKnowledgeBaseSources(): Promise<Array<{
    name: string;
    count: number;
    status: 'Updated' | 'Current' | 'Pending';
  }>> {
    return this.request('/api/knowledge-base/sources');
  }

  // Review Queue
  async getReviewQueue(): Promise<DocumentFile[]> {
    return this.request<DocumentFile[]>('/api/review/queue');
  }

  async approveDocument(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/review/approve/${id}`, {
      method: 'POST',
    });
  }

  async flagDocument(id: number, reason: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/review/flag/${id}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }
}

export const apiService = new ApiService();