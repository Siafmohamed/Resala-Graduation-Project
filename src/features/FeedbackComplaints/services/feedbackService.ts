import api from '@/shared/api/axiosInstance';

export enum FeedbackStatus {
  PENDING = 1,
  RESOLVED = 2,
  REJECTED = 3,
}

export enum FeedbackType {
  FEEDBACK = 1,
  COMPLAINT = 2,
}

export interface Feedback {
  id: number;
  donorId: number;
  donorName: string;
  subject: string;
  message: string;
  type: FeedbackType;
  typeName?: string;
  status: FeedbackStatus;
  statusName?: string;
  createdOn: string;
  attachments?: string[];
}

export interface FeedbackListResponse {
  items: Feedback[];
  totalRows: number;
  pageIndex?: number;
  pageSize?: number;
}

interface UnifiedResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors: any;
  statusCode: number;
}

export const feedbackService = {
  /**
   * Fetch all feedback and complaints
   */
  async getAll(params: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    pageNumber: number;
    pageSize: number;
  }): Promise<FeedbackListResponse> {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append('type', String(params.type));
    if (params.status) queryParams.append('status', String(params.status));
    queryParams.append('pageNumber', String(params.pageNumber));
    queryParams.append('pageSize', String(params.pageSize));

    const response = await api.get<UnifiedResponse<FeedbackListResponse>>(`/v1/admin/feedback?${queryParams.toString()}`);
    return response.data || { items: [], totalRows: 0 };
  },

  /**
   * Get a single feedback/complaint by ID
   */
  async getById(id: number): Promise<Feedback> {
    const response = await api.get<UnifiedResponse<Feedback>>(`/v1/admin/feedback/${id}`);
    return response.data;
  },

  /**
   * Update feedback/complaint status
   */
  async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback> {
    const response = await api.patch<UnifiedResponse<Feedback>>(`/v1/admin/feedback/${id}/status`, status, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
