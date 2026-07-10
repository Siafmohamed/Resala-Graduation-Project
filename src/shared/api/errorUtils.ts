export interface ErrorWithMessage {
  message?: string;
  status?: number;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const typedError = error as ErrorWithMessage;
  return typedError?.response?.data?.message || typedError?.message || fallback;
};

export const getApiErrorStatus = (error: unknown): number | undefined => {
  const typedError = error as ErrorWithMessage;
  return typedError?.status || typedError?.response?.status;
};
