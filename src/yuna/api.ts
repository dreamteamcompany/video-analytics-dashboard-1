const YUNA_API = 'https://functions.poehali.dev/b9775f41-cc5d-4f54-b6c3-00bb7477338f';

export interface YunaItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export const yunaApi = {
  list: async (): Promise<YunaItem[]> => {
    const res = await fetch(YUNA_API);
    if (!res.ok) throw new Error(`list ${res.status}`);
    const data = (await res.json()) as { items: YunaItem[] };
    return data.items;
  },
  create: async (title: string, description: string): Promise<YunaItem> => {
    const res = await fetch(YUNA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) throw new Error(`create ${res.status}`);
    const data = (await res.json()) as { item: YunaItem };
    return data.item;
  },
};
