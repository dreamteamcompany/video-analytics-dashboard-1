import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from '@/components/ui/icon';

const WORDS_PER_MINUTE = 125;

interface SpeechSection {
  number: string;
  title: string;
  body: string;
  words: number;
  minutes: number;
}

const countWords = (text: string) =>
  text
    .replace(/[*_#>«»—–-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[а-яёa-z0-9]/i.test(w)).length;

const formatTime = (totalMinutes: number) => {
  const total = Math.round(totalMinutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
};

interface SpeechPageProps {
  file?: string;
  heading?: string;
}

const SpeechPage = ({ file = '/speech.md', heading = 'Выступление: IT-департамент' }: SpeechPageProps) => {
  const [raw, setRaw] = useState('');

  useEffect(() => {
    fetch(file)
      .then((r) => r.text())
      .then(setRaw);
  }, [file]);

  const sections = useMemo<SpeechSection[]>(() => {
    if (!raw) return [];
    const parts = raw.split(/\n(?=## Слайд )/g).slice(1);
    return parts.map((part) => {
      const [headLine, ...rest] = part.split('\n');
      const head = headLine.replace(/^##\s*/, '').replace(/\s*$/, '');
      const match = head.match(/^Слайд\s+(\d+)\.\s*(.*)$/);
      const body = rest.join('\n').replace(/\n---\s*$/, '').trim();
      const words = countWords(body);
      return {
        number: match?.[1] ?? '',
        title: match?.[2] ?? head,
        body,
        words,
        minutes: words / WORDS_PER_MINUTE,
      };
    });
  }, [raw]);

  const totalMinutes = sections.reduce((acc, s) => acc + s.minutes, 0);

  let elapsed = 0;
  const timeline = sections.map((s) => {
    const start = elapsed;
    elapsed += s.minutes;
    return { ...s, start };
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:py-0 print:px-0">
      <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm print:hidden">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Текст выступления</h1>
            <p className="mt-1 text-sm text-slate-500">
              {sections.length} слайдов · примерно {formatTime(totalMinutes)} речи в среднем темпе
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <Icon name="Printer" size={18} />
            Распечатать
          </button>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm print:rounded-none print:p-0 print:shadow-none">
          <header className="mb-8 border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-semibold text-slate-900">{heading}</h2>
            <p className="mt-2 text-slate-500">
              Полный текст по слайдам · общий хронометраж ≈ {formatTime(totalMinutes)}
            </p>
          </header>

          <section className="mb-10 break-inside-avoid">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Тайминг</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="w-12 py-2 font-medium">№</th>
                  <th className="py-2 font-medium">Слайд</th>
                  <th className="w-24 py-2 text-right font-medium">Старт</th>
                  <th className="w-24 py-2 text-right font-medium">Длит.</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((s) => (
                  <tr key={s.number} className="border-b border-slate-100">
                    <td className="py-2 text-slate-400">{s.number}</td>
                    <td className="py-2 text-slate-800">{s.title}</td>
                    <td className="py-2 text-right tabular-nums text-slate-500">
                      {formatTime(s.start)}
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">
                      {Math.max(1, Math.round(s.minutes))} мин
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {timeline.map((s) => (
            <article
              key={s.number}
              className="mb-10 break-inside-avoid border-t border-slate-200 pt-6 print:break-before-page"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  <span className="mr-2 text-slate-400">{s.number}.</span>
                  {s.title}
                </h3>
                <span className="text-sm text-slate-500">
                  ≈ {Math.max(1, Math.round(s.minutes))} мин · старт {formatTime(s.start)}
                </span>
              </div>
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-strong:text-slate-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.body}</ReactMarkdown>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeechPage;
