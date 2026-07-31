export const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const fmtDate = (iso: string) => {
  const d = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const scoreColor = (v: number) => {
  if (v >= 75) return { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' };
  if (v >= 50) return { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
  return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' };
};
