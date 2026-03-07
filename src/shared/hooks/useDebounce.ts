import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Debounce a value. Updates delayedValue after `delay` ms of no changes.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [delayedValue, setDelayedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDelayedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return delayedValue;
}

/**
 * Return a debounced callback that delays execution.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );
}
