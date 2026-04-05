import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useLocalStorage is a React hook that makes persisting state to localStorage effortless.
 * Includes cross-tab synchronization and type safety.
 * SSR safe: Does not cause hydration errors.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error on server
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // Dispatch a custom event so other instances of the same hook in the same tab can update
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const onStorageChange = useCallback(
    (event: StorageEvent | Event) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  // Listen for changes in other tabs
  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    window.addEventListener('local-storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('local-storage', onStorageChange);
    };
  }, [onStorageChange]);

  // Handle SSR: If the stored value is different from initial value, sync it after mount
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const current = readValue();
      if (current !== storedValue) {
        setStoredValue(current);
      }
    }
  }, [readValue, storedValue]);

  return [storedValue, setValue, removeValue];
}
