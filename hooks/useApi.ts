import { useState, useEffect } from 'react';
import { apiService, type DocumentFile, type DashboardStats } from '@/lib/api';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadDocuments = async (files: File[]) => {
    try {
      setError(null);
      const response = await apiService.uploadDocuments(files);
      if (response.success) {
        await fetchDocuments(); // Refresh documents list
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteDocument(id);
      await fetchDocuments(); // Refresh documents list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    documents,
    loading,
    error,
    uploadDocuments,
    deleteDocument,
    refetch: fetchDocuments,
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useSearch(query: string) {
  const [results, setResults] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.searchDocuments(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchDocuments, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return { results, loading, error };
}

export function useComplianceScore() {
  const [score, setScore] = useState<{ overall: number; irs: number; usviDol: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getComplianceScore();
        setScore(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance score');
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  return { score, loading, error };
}

export function useReviewQueue() {
  const [queue, setQueue] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getReviewQueue();
      setQueue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const approveDocument = async (id: number) => {
    try {
      setError(null);
      await apiService.approveDocument(id);
      await fetchQueue(); // Refresh queue
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Approval failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const flagDocument = async (id: number, reason: string) => {
    try {
      setError(null);
      await apiService.flagDocument(id, reason);
      await fetchQueue(); // Refresh queue
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Flag failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    queue,
    loading,
    error,
    approveDocument,
    flagDocument,
    refetch: fetchQueue,
  };
}