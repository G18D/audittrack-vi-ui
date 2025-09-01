import { useState, useEffect } from 'react';
import { apiClient, type Document, type Stats } from '@/lib/api';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDocuments();
      const data = response.documents;
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
      const response = await apiClient.uploadDocuments(files);
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
      // Note: deleteDocument method needs to be added to apiClient
      throw new Error('Delete functionality not yet implemented in new API');
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getStats();
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
  const [results, setResults] = useState<Document[]>([]);
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
        // Note: search functionality not yet implemented in new API
        // throw new Error('Search functionality not yet implemented');
        setResults([]);
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
        const response = await apiClient.getComplianceAnalysis();
        const data = {
          overall: response.overall_score,
          irs: response.breakdown.irs_compliance,
          usviDol: response.breakdown.usvi_dol_compliance
        };
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
  const [queue, setQueue] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: review queue functionality not yet implemented in new API
      // throw new Error('Review queue functionality not yet implemented');
      setQueue([]);
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
      // Note: approve functionality not yet implemented in new API
      throw new Error('Approve functionality not yet implemented');
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
      // Note: flag functionality not yet implemented in new API
      throw new Error('Flag functionality not yet implemented');
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