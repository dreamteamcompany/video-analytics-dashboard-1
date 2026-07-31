import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { yunaApi, SessionDetail } from './api';
import { fmtTime, fmtDate } from './utils';
import AnalysisReport from './AnalysisReport';
import TranscriptView from './TranscriptView';

const YunaSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    yunaApi
      .getSession(Number(id))
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить приём');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Stethoscope" size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {data ? `${data.session.title || 'Приём'}` : 'Приём'}
              </h1>
              {data && (
                <p className="text-sm text-muted-foreground">
                  {fmtDate(data.session.created_at)} · {fmtTime(data.session.duration_sec)}
                </p>
              )}
            </div>
          </div>
          <Link to="/yuna">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Icon name="ArrowLeft" size={16} />
              К приёмам
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Icon name="LoaderCircle" size={28} className="text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : data ? (
          <>
            {data.analysis ? (
              <AnalysisReport analysis={data.analysis} />
            ) : (
              <Card className="p-5 mb-6">
                <p className="text-sm text-muted-foreground text-center py-4">
                  Для этого приёма нет отчёта анализа.
                </p>
              </Card>
            )}
            <TranscriptView utterances={data.utterances} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default YunaSessionPage;
