import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/axiosInstance';
import { PeriodEnum } from '../config/reportsConfig';

// Reuse the same response handling as our admin analytics service
const handleApiResponse = <T>(response: any): T => {
  if (response && 'isSuccess' in response && 'value' in response) {
    return response.value;
  } else if (response && 'data' in response) {
    return response.data;
  }
  return response;
};

export const useReport = (
  apiEndpoint: string,
  period?: PeriodEnum
) => {
  return useQuery({
    queryKey: ['report', apiEndpoint, period],
    queryFn: async () => {
      const response = await api.get(apiEndpoint, {
        params: period ? { period } : {},
      });
      return handleApiResponse(response.data);
    },
  });
};
