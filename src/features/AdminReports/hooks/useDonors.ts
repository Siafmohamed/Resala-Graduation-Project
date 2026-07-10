import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/axiosInstance';

const handleApiResponse = <T>(response: any): T => {
  if (response && 'isSuccess' in response && 'value' in response) {
    return response.value;
  } else if (response && 'succeeded' in response && 'data' in response) {
    return response.data;
  } else if (response && 'data' in response) {
    return response.data;
  }
  return response;
};

export const useReport = (
  apiEndpoint: string,
  period?: number
) => {
  return useQuery({
    queryKey: ['report', apiEndpoint, period],
    queryFn: async () => {
      const response = await api.get(apiEndpoint, {
        params: period !== undefined ? { period } : {},
      });
      return handleApiResponse(response);
    },
  });
};
