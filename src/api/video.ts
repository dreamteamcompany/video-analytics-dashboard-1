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
  resolveVideoUrl: async (videoUrl: string): Promise<string> => {
    const filename = videoUrl.split('/').pop() || '';
    const streamUrl = `${STREAM_URL}?stream=${encodeURIComponent(filename)}`;

    // Кэширование в хранилище может занять время (или упереться в таймаут
    // при медленном сервере), но само сохранение при этом продолжается.
    // Поэтому повторяем запрос несколько раз — как только файл окажется
    // в кэше, функция мгновенно вернёт готовую ссылку.
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const res = await fetch(streamUrl);
        if (res.ok) {
          const data = (await res.json()) as { url: string };
          return data.url;
        }
        lastErr = new Error(`stream ${res.status}`);
      } catch (e) {
        lastErr = e;
      }
      await new Promise((r) => setTimeout(r, 4000));
    }
    throw lastErr ?? new Error('stream failed');
  },
};