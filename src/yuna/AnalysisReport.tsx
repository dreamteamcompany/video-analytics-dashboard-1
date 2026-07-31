import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Analysis } from './api';
import { scoreColor } from './utils';

const METRICS: { key: keyof Analysis; label: string; icon: string }[] = [
  { key: 'empathy', label: 'Эмпатия врача', icon: 'HeartHandshake' },
  { key: 'trust', label: 'Доверие пациента', icon: 'Handshake' },
  { key: 'patient_state', label: 'Состояние пациента', icon: 'Brain' },
  { key: 'quality', label: 'Качество и сервис', icon: 'BadgeCheck' },
  { key: 'communication', label: 'Коммуникация', icon: 'MessagesSquare' },
];

const ScoreBar = ({ label, icon, value }: { label: string; icon: string; value: number }) => {
  const c = scoreColor(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon name={icon} size={15} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${c.text}`}>{value}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${c.bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const ListBlock = ({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: string;
  color: string;
  items: string[];
}) => {
  if (!items.length) return null;
  return (
    <div>
      <div className={`flex items-center gap-1.5 mb-2 ${color}`}>
        <Icon name={icon} size={16} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.replace('text-', 'bg-')}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AnalysisReport = ({ analysis }: { analysis: Analysis }) => {
  const overall = Math.round(
    (analysis.empathy + analysis.trust + analysis.quality + analysis.communication) / 4,
  );
  const oc = scoreColor(overall);

  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon name="ClipboardCheck" size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Отчёт по приёму</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Общая оценка</span>
          <span className={`text-2xl font-bold ${oc.text}`}>{overall}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {METRICS.map((m) => (
          <ScoreBar key={m.key} label={m.label} icon={m.icon} value={analysis[m.key] as number} />
        ))}
      </div>

      {analysis.summary && (
        <div className="bg-secondary/60 rounded-xl px-4 py-3 mb-5">
          <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      <div className="space-y-5">
        <ListBlock title="Сильные стороны" icon="ThumbsUp" color="text-green-600" items={analysis.strengths} />
        <ListBlock title="Рекомендации врачу" icon="Lightbulb" color="text-primary" items={analysis.recommendations} />
        <ListBlock title="Тревожные моменты" icon="TriangleAlert" color="text-red-500" items={analysis.concerns} />
      </div>
    </Card>
  );
};

export default AnalysisReport;