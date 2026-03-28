import axiosInstance from '@/features/authentication/utils/axiosInstance';

export interface SponsorshipProgram {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSponsorshipPayload {
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  targetAmount: number;
}

export interface UpdateSponsorshipPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  targetAmount?: number;
  isActive?: boolean;
}

export const sponsorshipApi = {
  /**
   * Create a new sponsorship program (Admin only)
   */
  async create(payload: CreateSponsorshipPayload): Promise<SponsorshipProgram> {
    const { data } = await axiosInstance.post<SponsorshipProgram>(
      '/v1/sponsorships',
      payload
    );
    return data;
  },

  /**
   * Update an existing sponsorship program (Admin only)
   */
  async update(id: number, payload: UpdateSponsorshipPayload): Promise<SponsorshipProgram> {
    const { data } = await axiosInstance.put<SponsorshipProgram>(
      `/v1/sponsorships/${id}`,
      payload
    );
    return data;
  },

  /**
   * Delete a sponsorship program (Admin only)
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/v1/sponsorships/${id}`);
  },

  /**
   * Get all sponsorship programs
   */
  async getAll(): Promise<SponsorshipProgram[]> {
    const { data } = await axiosInstance.get<SponsorshipProgram[]>('/v1/sponsorships');
    return data;
  },

  /**
   * Get a single sponsorship program by ID
   */
  async getById(id: number): Promise<SponsorshipProgram> {
    const { data } = await axiosInstance.get<SponsorshipProgram>(`/v1/sponsorships/${id}`);
    return data;
  },
};
