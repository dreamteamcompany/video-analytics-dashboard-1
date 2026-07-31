import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { yunaApi, YunaSession } from './api';
import { fmtTime, fmtDate, scoreColor } from './utils';

const SessionHistory = ({ refreshKey }: { refreshKey: number }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<YunaSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    yunaApi
      .listSessions()
      .then((s) => {
        if (active) setSessions(s);
      })
      .catch(() => { /* silent */ })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="History" size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">История приёмов</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Icon name="LoaderCircle" size={24} className="text-primary animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Пока нет приёмов. Запишите первый выше.
        </p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const c = s.overall != null ? scoreColor(s.overall) : null;
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/yuna/${s.id}`)}
                className="w-full flex items-center gap-3 text-left rounded-xl border border-border px-3 py-2.5 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Stethoscope" size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {s.title || 'Приём'} · {fmtDate(s.created_at)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Длительность {fmtTime(s.duration_sec)}
                  </p>
                </div>
                {c && s.overall != null && (
                  <div className={`px-2.5 py-1 rounded-lg ${c.bg} flex-shrink-0`}>
                    <span className={`text-sm font-bold ${c.text}`}>{s.overall}</span>
                  </div>
                )}
                <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default SessionHistory;
