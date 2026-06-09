import { useState, useEffect, useCallback } from 'react';

export interface Ucapan {
  id: number;
  nama: string;
  komentar: string;
  kehadiran: boolean;
  createdAt: string;
}

export function useBukuTamu() {
  const [ucapanList, setUcapanList] = useState<Ucapan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUcapan = useCallback(async () => {
    try {
      const response = await fetch('/api/ucapan');
      if (!response.ok) {
        throw new Error('Failed to fetch ucapan');
      }
      const data: Ucapan[] = await response.json();
      setUcapanList(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat daftar ucapan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUcapan();
    const interval = setInterval(fetchUcapan, 4000);
    return () => clearInterval(interval);
  }, [fetchUcapan]);

  const submitUcapan = async (nama: string, komentar: string, kehadiran: boolean) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/ucapan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, komentar, kehadiran }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      // Optimitically fetch new data immediately
      await fetchUcapan();
      return true;
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim ucapan, coba lagi.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ucapanList,
    isLoading,
    isSubmitting,
    error,
    submitUcapan,
  };
}
