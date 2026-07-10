import api from '@/shared/api/axiosInstance';

export interface SuccessStory {
  id: number;
  title: string;
  description: string;
  image: string;
  imageUrl?: string;
  createdDate?: string;
  createdAt?: string;
}

export interface SuccessStoriesResponse {
  items: SuccessStory[];
  totalRows: number;
}

export const successStoriesService = {
  /**
   * Fetch all success stories
   */
  async getAll(): Promise<SuccessStoriesResponse> {
    const response = await api.get('/v1/success-stories');
    return response || { items: [], totalRows: 0 };
  },

  /**
   * Get a single success story by ID
   */
  async getById(id: number): Promise<SuccessStory> {
    const response = await api.get(`/v1/success-stories/${id}`);
    return response;
  },

  /**
   * Create a new success story with image upload
   */
  async create(formData: FormData): Promise<SuccessStory> {
    const response = await api.post('/v1/admin/success-stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * Delete a success story
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/v1/admin/success-stories/${id}`);
  },

  /**
   * Update a success story
   */
  async update(id: number, formData: FormData): Promise<SuccessStory> {
    const response = await api.put(`/v1/admin/success-stories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};
