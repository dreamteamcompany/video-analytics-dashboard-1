const PROXY_URL = 'https://functions.poehali.dev/6d19f93a-211f-4993-a9ae-1a8c49877413';

export const API_URL = PROXY_URL;

function proxyUrl(path: string): string {
  return `${PROXY_URL}?path=${encodeURIComponent(path)}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(proxyUrl(path), options);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  return (ct.includes('application/json') ? res.json() : res.text()) as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  postForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: 'POST', body: form }),
  postJson: <T>(path: string, data: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  pingUrl: () => `${PROXY_URL}?path=/`,
};
