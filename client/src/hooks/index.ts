import { useState, useEffect, useRef } from 'react';
import { fetchJson } from '../utils';

export function useFetch<T>(url: string, options?: RequestInit, cacheTime?: number) {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchJson(ref.current.url, ref.current.options, cacheTime);
      if (mounted.current) {
        setResponse(res);
      }
    } catch (error) {
      if (mounted.current) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const ref = useRef({ url, options, fetchData });

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    ref.current.fetchData();
  }, [ref, url]);

  useEffect(() => {
    ref.current = { url, options, fetchData };
  });

  return { isLoading, response, error, refresh: fetchData };
}
