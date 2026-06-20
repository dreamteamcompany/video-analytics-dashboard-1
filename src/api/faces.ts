import { api } from './client';

const normalizeFaces = (data: unknown): string[] => {
  if (Array.isArray(data)) {
    return data
      .map((x) =>
        typeof x === 'string'
          ? x
          : (x as Record<string, unknown>)?.name ??
            (x as Record<string, unknown>)?.filename ??
            ''
      )
      .filter(Boolean) as string[];
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const arr = obj.faces ?? obj.people ?? obj.known_people ?? obj.files;
    if (Array.isArray(arr)) return normalizeFaces(arr);
  }
  return [];
};

export const facesApi = {
  list: async (): Promise<string[]> => {
    for (const path of ['/faces', '/known_people', '/people']) {
      try {
        const data = await api.get<unknown>(path);
        return normalizeFaces(data);
      } catch {
        /* try next */
      }
    }
    return [];
  },
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.postForm<unknown>('/upload_face', form);
  },
  detect: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.postForm<unknown>('/detect', form);
  },
};