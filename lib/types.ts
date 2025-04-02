export interface ImageTransformResponse {
  originalImageUrl: string;
  transformedImageUrl: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ProgressState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
} 