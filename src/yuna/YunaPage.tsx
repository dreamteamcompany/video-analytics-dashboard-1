import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { yunaApi, YunaItem } from './api';

const YunaPage = () => {
  const [items, setItems] = useState<YunaItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await yunaApi.list());
      setError(null);
    } catch {
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const item = await yunaApi.create(title.trim(), description.trim());
      setItems((prev) => [item, ...prev]);
      setTitle('');
      setDescription('');
      setError(null);
    } catch {
      setError('Не удалось сохранить запись');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="Sparkles" size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Юна</h1>
            <p className="text-sm text-muted-foreground">Отдельное приложение</p>
          </div>
        </div>

        <Card className="p-5 mb-8">
          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Название записи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
            />
            <Textarea
              placeholder="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving ? 'Сохраняю…' : 'Добавить'}
            </Button>
          </form>
        </Card>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Icon name="LoaderCircle" size={28} className="text-primary animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Пока нет записей. Добавьте первую выше.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YunaPage;
