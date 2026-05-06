import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * A hook to sync an object state with URL search parameters.
 * Supports string, number, and boolean values.
 * 
 * @param defaultValues The initial state values
 * @returns [state, setState, clearState]
 */
export function useUrlState<T extends Record<string, any>>(defaultValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Compute current state from URL or fallback to defaults
  const state = useMemo(() => {
    const currentState = { ...defaultValues };
    
    Object.keys(defaultValues).forEach((key) => {
      const value = searchParams.get(key);
      if (value === null) return;

      const defaultValue = defaultValues[key];
      
      // Parse based on default value type
      if (typeof defaultValue === 'number') {
        currentState[key as keyof T] = Number(value) as any;
      } else if (typeof defaultValue === 'boolean') {
        currentState[key as keyof T] = (value === 'true') as any;
      } else if (Array.isArray(defaultValue)) {
        currentState[key as keyof T] = searchParams.getAll(key) as any;
      } else {
        currentState[key as keyof T] = value as any;
      }
    });

    return currentState;
  }, [searchParams, defaultValues]);

  /**
   * Updates the URL search parameters with the new state.
   * Null or undefined values are removed from the URL.
   */
  const setState = useCallback((updater: Partial<T> | ((prev: T) => Partial<T>)) => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      const newValues = typeof updater === 'function' ? updater(state) : updater;

      Object.entries(newValues).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          nextParams.delete(key);
        } else if (Array.isArray(value)) {
          nextParams.delete(key);
          value.forEach((v) => nextParams.append(key, String(v)));
        } else {
          nextParams.set(key, String(value));
        }
      });

      return nextParams;
    }, { replace: true });
  }, [setSearchParams, state]);

  /**
   * Resets all tracked parameters to their default values (clears them from URL)
   */
  const clearState = useCallback(() => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      Object.keys(defaultValues).forEach((key) => nextParams.delete(key));
      return nextParams;
    }, { replace: true });
  }, [setSearchParams, defaultValues]);

  return [state, setState, clearState] as const;
}
