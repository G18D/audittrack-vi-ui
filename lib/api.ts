// lib/api.ts - Fixed API client for connecting to FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface Document {
  id: number;
  name: string;
  size: string;
  status: 'Passed' | 'Flagged' | 'Manual Review';
  issues: number;
  vendor: string;
  uploadedAt: string;
  amount: string;
}

export interface Stats {
  documents_processed: number;
  issues_resolved_percent: number;
  avg_processing_time: number;
  total_savings: number;
  compliance_scores: {
    irs: number;
    usvi_dol: number;
    gasb: number;
    overall: number;
  };
}

export interface AuditResponse {
  success: boolean;
  message: string;
  audit_id: string;
  data: any;
}

export interface ComplianceAnalysis {
  overall_score: number;
  breakdown: {
    irs_compliance: number;
    usvi_dol_compliance: number;
    gasb_compliance: number;
  };
  recent_issues: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  recommendations: Array<{
    action: string;
    impact: string;
  }>;
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Get dashboard stats
  async getStats(): Promise<Stats> {
    return this.request<Stats>('/api/stats');
  }

  // Upload single document
  async uploadDocument(file: File): Promise<AuditResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.json();
    });
  }

  // Upload multiple documents
  async uploadDocuments(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return fetch(`${this.baseUrl}/api/bulk-process`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Bulk upload failed: ${response.statusText}`);
      }
      return response.json();
    });
  }

  // Get audit result by ID
  async getAuditResult(auditId: string) {
    return this.request(`/api/audit/${auditId}`);
  }

  // Get documents list
  async getDocuments(limit = 50, offset = 0): Promise<{
    documents: Document[];
    total: number;
    page: number;
    pages: number;
  }> {
    return this.request(`/api/documents?limit=${limit}&offset=${offset}`);
  }

  // Get compliance analysis
  async getComplianceAnalysis(): Promise<ComplianceAnalysis> {
    return this.request<ComplianceAnalysis>('/api/compliance');
  }

  // Get audit history
  async getAuditHistory(limit = 50) {
    return this.request(`/api/history?limit=${limit}`);
  }

  // Get knowledge base status
  async getKnowledgeBaseStatus() {
    return this.request('/api/knowledge-base/status');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// React hooks for API calls
import { useState, useEffect, useCallback } from 'react';

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useDocuments(limit = 50, offset = 0) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getDocuments(limit, offset);
      setDocuments(data.documents);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      console.error('Documents fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { 
    documents, 
    total, 
    loading, 
    error, 
    refetch: fetchDocuments 
  };
}

export function useCompliance() {
  const [compliance, setCompliance] = useState<ComplianceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompliance() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getComplianceAnalysis();
        setCompliance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance data');
        console.error('Compliance fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompliance();
  }, []);

  return { compliance, loading, error };
}

// Upload hook with progress
export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<AuditResponse | null> => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Simulate progress (replace with real progress tracking if available)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await apiClient.uploadDocument(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after delay
    }
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Simulate progress for bulk upload
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 300);

      const result = await apiClient.uploadDocuments(files);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk upload failed');
      console.error('Bulk upload error:', err);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return { 
    uploadFile, 
    uploadFiles, 
    uploading, 
    progress, 
    error 
  };
}