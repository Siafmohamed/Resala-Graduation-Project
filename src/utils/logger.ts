/**
 * Production-safe logger that only logs in development mode.
 * Errors are always logged to the console.
 */
const logger = {
  log: (message: string, ...data: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(message, ...data);
    }
  },
  warn: (message: string, ...data: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(message, ...data);
    }
  },
  error: (message: string, ...data: unknown[]) => {
    // Errors are always logged, but you could also send them to a service like Sentry here
    console.error(message, ...data);
  },
  debug: (message: string, ...data: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug(message, ...data);
    }
  }
};

export default logger;
