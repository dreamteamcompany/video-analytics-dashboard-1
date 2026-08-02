import { useCallback, useEffect, useState } from 'react';
import { yunaApi, authStore, Doctor } from './api';

export const useAuth = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setDoctor(await yunaApi.me());
    } catch {
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await yunaApi.logout();
    setDoctor(null);
  }, []);

  return { doctor, loading, isAuthed: !!authStore.get(), refresh, logout };
};
