import { useCallback } from 'react';

export const useLocalStorage = () => {
  const getValue = useCallback((key: string) => {
    return localStorage.getItem(key);
  }, []);

  const setValue = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  const removeValue = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);

  return {
    getValue,
    setValue,
    removeValue,
  };
};
