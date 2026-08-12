import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from './shared';

interface DashboardHeaderProps {
  online: boolean | null;
  checkingPing: boolean;
  onPing: () => void;
}

export const DashboardHeader = ({ online, checkingPing, onPing }: DashboardHeaderProps) => (
  <header className="bg-white border-b border-border sticky top-0 z-20 card-shadow">
    <div className="container flex items-center justify-between py-3.5">
      {/* logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 blue-gradient rounded-2xl flex items-center justify-center shadow-md">
          <Icon name="ScanEye" size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium leading-none mb-0.5 uppercase tracking-wider">Видеоаналитика</p>
          <h1 className="text-lg font-bold leading-none text-foreground">Панель управления</h1>
        </div>
      </div>

      {/* status + ping */}
      <div className="flex items-center gap-3">
        <Link to="/yuna">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 border-border"
          >
            <Icon name="Sparkles" size={14} />
            Юна
          </Button>
        </Link>
        <Link to="/presentation">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 border-border"
          >
            <Icon name="Presentation" size={14} />
            Презентация
          </Button>
        </Link>
        <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
          <span className={`w-2 h-2 rounded-full live-ring ${online ? 'bg-success' : online === false ? 'bg-destructive' : 'bg-muted-foreground'}`} />
          <span className="text-xs font-medium text-muted-foreground">
            {online ? 'Онлайн' : online === false ? 'Офлайн' : 'Подключение…'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onPing}
          disabled={checkingPing}
          className="rounded-xl gap-1.5 border-border"
        >
          {checkingPing
            ? <Icon name="LoaderCircle" size={14} className="animate-spin" />
            : <Icon name="Radio" size={14} />}
          Пинг
        </Button>
      </div>
    </div>
  </header>
);

interface StatsGridProps {
  statCards: { label: string; value: number; icon: string; gradient: string }[];
}

export const StatsGrid = ({ statCards }: StatsGridProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {statCards.map((s, i) => (
      <Card
        key={s.label}
        className="animate-fade-up flex items-center gap-5"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
          <Icon name={s.icon} size={26} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground leading-none">{s.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
        </div>
      </Card>
    ))}
  </div>
);

export default DashboardHeader;
