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
  // Переносит готовое видео в наше хранилище (один раз) и возвращает
  // постоянную CDN-ссылку. Браузер играет видео напрямую с CDN.
  resolveVideoUrl: async (
    videoUrl: string,
    onWait?: (attempt: number) => void,
  ): Promise<string> => {
    const filename = videoUrl.split('/').pop() || '';
    // Перенос большого видео в хранилище может не уложиться в один вызов
    // (таймаут функции). Функция идемпотентна: как только файл окажется
    // в хранилище, повторный вызов вернёт ссылку мгновенно. Поэтому при
    // таймауте (504/502) повторяем несколько раз.
    const MAX_ATTEMPTS = 8;
    let lastStatus = 0;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      onWait?.(attempt);
      try {
        const res = await fetch(`${STREAM_URL}?stream=${encodeURIComponent(filename)}`);
        if (res.ok) {
          const data = (await res.json()) as { url: string };
          return data.url;
        }
        lastStatus = res.status;
        if (res.status !== 504 && res.status !== 502) {
          throw new Error(`stream ${res.status}`);
        }
      } catch (e) {
        if (attempt === MAX_ATTEMPTS) throw e;
      }
      await new Promise(r => setTimeout(r, 4000));
    }
    throw new Error(`stream ${lastStatus || 'timeout'}`);
  },
};