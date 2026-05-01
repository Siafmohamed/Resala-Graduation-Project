export const CACHE_DURATIONS = {
  REAL_TIME: 0,
  SHORT: 30_000,
  MEDIUM: 60_000,
  LONG: 300_000,
  VERY_LONG: 600_000,
} as const;

export const QUERY_GC_TIME = 1000 * 60 * 30; // 30 minutes
