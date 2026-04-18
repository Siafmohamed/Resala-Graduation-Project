import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CACHE_DURATIONS, QUERY_GC_TIME } from '@/shared/constants/cacheDurations'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_DURATIONS.LONG,
      gcTime: QUERY_GC_TIME,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2; // Retry up to 2 times
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
createRoot(document.getElementById('root')!).render(
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
)
