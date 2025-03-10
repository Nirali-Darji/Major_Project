import { useState, useEffect } from "react";

interface ApiFetcherProps {
  endpoint: string;
  method?: string;
  body?: Record<string, any> | null;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const ApiFetcher = <T,>({
  endpoint,
  method = "GET",
  body = null,
  headers = {},
}: ApiFetcherProps): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body && method !== "GET" ? JSON.stringify(body) : null,
        };

        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, headers]);

  return { data, loading, error };
};

export default ApiFetcher;
