/**
 * Security utilities for sanitizing user input and preventing XSS.
 */

/**
 * Basic search query sanitization.
 * Removes HTML tags and limits length.
 */
export const sanitizeSearchQuery = (query: string, maxLength: number = 100): string => {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Basic tag removal
    .substring(0, maxLength);
};

/**
 * Basic XSS validation check.
 * Returns true if the string contains potential HTML tags.
 */
export const containsPotentialXss = (val: string): boolean => {
  if (!val) return false;
  return /<[^>]*>?/gm.test(val);
};

/**
 * Sanitizes a string by removing potential HTML tags.
 */
export const sanitizeString = (val: string): string => {
  if (!val) return '';
  return val.replace(/<[^>]*>?/gm, '');
};
