import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Utterance } from './api';

const speakerMeta = (s: Utterance['speaker']) => {
  if (s === 'doctor')
    return { label: 'Врач', icon: 'Stethoscope', wrap: 'items-start', bubble: 'bg-primary/10 text-foreground', badge: 'text-primary' };
  if (s === 'patient')
    return { label: 'Пациент', icon: 'User', wrap: 'items-end', bubble: 'bg-secondary text-foreground', badge: 'text-muted-foreground' };
  return { label: '—', icon: 'MessageCircle', wrap: 'items-start', bubble: 'bg-muted text-foreground', badge: 'text-muted-foreground' };
};

const TranscriptView = ({ utterances }: { utterances: Utterance[] }) => {
  if (utterances.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FileText" size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">Расшифровка приёма</h2>
      </div>
      <div className="space-y-3">
        {utterances.map((u, i) => {
          const m = speakerMeta(u.speaker);
          const isPatient = u.speaker === 'patient';
          return (
            <div key={i} className={`flex flex-col ${m.wrap}`}>
              <div className={`flex items-center gap-1.5 mb-1 ${m.badge}`}>
                <Icon name={m.icon} size={13} />
                <span className="text-xs font-medium">{m.label}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.bubble} ${
                  isPatient ? 'rounded-tr-sm' : 'rounded-tl-sm'
                }`}
              >
                {u.text}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TranscriptView;
