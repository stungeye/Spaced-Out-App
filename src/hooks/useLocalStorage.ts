import { useState, useCallback } from "react";
import { storage } from "@/lib/utils";

/**
 * Custom hook for managing localStorage with type safety and error handling
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      parse: (value: string) => T;
      stringify: (value: T) => string;
    };
    validator?: (value: unknown) => value is T;
  } = {}
) {
  const {
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
    validator,
  } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.get(key);
      if (item === null) {
        return defaultValue;
      }

      const parsed = serializer.parse(item);

      // Validate if validator is provided
      if (validator && !validator(parsed)) {
        console.warn(
          `Invalid data found in localStorage for key "${key}", using default value`
        );
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.set(key, serializer.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue] as const;
}
