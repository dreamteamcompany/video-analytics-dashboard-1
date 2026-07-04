import { api } from './client';

const STREAM_URL = 'https://functions.poehali.dev/5a09fdd4-da8f-4553-93e0-8282e36decae';

export interface VideoEvent {
  name: string;
  event_type: string;
  details?: string;
  timestamp_sec: number;
  bbox?: [number, number, number, number];
  [key: string]: unknown;
}

export interface VideoStatus {
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  error?: string;
}

export interface VideoResult {
  video_url: string;
  events: VideoEvent[];
}

export const videoApi = {
  status: (taskId: string) => api.get<VideoStatus>(`/video_status/${taskId}`),
  result: (taskId: string) => api.get<VideoResult>(`/video_result/${taskId}`),
  streamUrl: (videoUrl: string) => {
    const filename = videoUrl.split('/').pop() || '';
    return `${STREAM_URL}?stream=${encodeURIComponent(filename)}`;
  },
};