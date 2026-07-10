export interface SuccessStory {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStoriesListResponse {
  succeeded: boolean;
  data: SuccessStory[];
  message?: string;
}

export interface SuccessStoryResponse {
  succeeded: boolean;
  data: SuccessStory;
  message?: string;
}

export interface CreateSuccessStoryDto {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface UpdateSuccessStoryDto {
  title: string;
  description: string;
  imageUrl?: string;
}