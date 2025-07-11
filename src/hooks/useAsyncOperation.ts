import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsyncOperation<T = unknown>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error; // Re-throw for caller to handle if needed
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
