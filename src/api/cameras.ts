import { api } from './client';

export interface Camera {
  id?: number | string;
  name: string;
  rtsp_url: string;
  [key: string]: unknown;
}

const UPLOAD_VIDEO_URL = 'https://functions.poehali.dev/5a09fdd4-da8f-4553-93e0-8282e36decae';
const CHUNK_SIZE = 200 * 1024; // 200 KB (после base64 ~270 KB — укладывается в лимит платформы)

export interface UploadVideoResult {
  task_id: string;
  status: string;
}

async function fileToBase64Chunk(slice: Blob): Promise<string> {
  const buf = await slice.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function genUploadId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const camerasApi = {
  list: () => api.get<Camera[]>('/cameras'),
  add: (name: string, rtsp_url: string) =>
    api.postJson<Camera>('/add_camera', { name, rtsp_url }),

  uploadVideo: async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadVideoResult> => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = genUploadId();
    let lastResult: UploadVideoResult = { task_id: '', status: 'error' };

    for (let i = 0; i < totalChunks; i++) {
      const slice = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const chunk = await fileToBase64Chunk(slice);

      const res = await fetch(UPLOAD_VIDEO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          upload_id: uploadId,
          chunk,
          chunk_index: i,
          total_chunks: totalChunks,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Chunk ${i} failed: ${err}`);
      }

      lastResult = await res.json();
      onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
    }

    return lastResult;
  },
};