import { useState, useEffect, useRef } from 'react';
import { fetchJson } from '../utils';

export function useFetch<T>(url: string, options?: RequestInit) {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchJson(ref.current.url, ref.current.options);
      setResponse(res);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const ref = useRef({ url, options, fetchData });

  useEffect(() => {
    ref.current.fetchData();
  }, [ref]);

  useEffect(() => {
    ref.current = { url, options, fetchData };
  });

  return { isLoading, response, error, refresh: fetchData };
}
