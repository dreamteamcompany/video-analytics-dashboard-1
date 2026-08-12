import Icon from '@/components/ui/icon';

export const eventMeta = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('наруш') || t.includes('violat') || t.includes('alert'))
    return { color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400', label: 'Нарушение', icon: 'TriangleAlert' };
  if (t.includes('вход') || t.includes('enter') || t.includes('in'))
    return { color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-400', label: 'Вход', icon: 'LogIn' };
  if (t.includes('выход') || t.includes('exit') || t.includes('out'))
    return { color: 'text-orange-500', bg: 'bg-orange-50', dot: 'bg-orange-400', label: 'Выход', icon: 'LogOut' };
  return { color: 'text-brand', bg: 'bg-brand-light', dot: 'bg-brand', label: type || '—', icon: 'Activity' };
};

export const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`bg-white rounded-2xl card-shadow p-6 ${className}`} style={style}>{children}</div>
);

export const SectionHead = ({ icon, title, action }: { icon: string; title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 blue-gradient rounded-xl flex items-center justify-center">
        <Icon name={icon} size={16} className="text-white" />
      </div>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
    {action}
  </div>
);
