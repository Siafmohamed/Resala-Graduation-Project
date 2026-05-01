export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface ImageUploadOptions {
  maxSizeMB: number;
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
}
