import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import SlideView from './SlideView';
import { slides2 as slides } from './slides2';

const Presentation2Page = () => {
  const total = slides.length;
  const [index, setIndex] = useState(() => {
    const n = parseInt(new URLSearchParams(window.location.search).get('slide') || '1', 10);
    return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
  });
  const touchX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key === 'Home') setIndex(0);
      if (e.key === 'End') setIndex(total - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('slide', String(index + 1));
    window.history.replaceState(null, '', url.toString());
  }, [index]);

  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -50) next();
    if (dx > 50) prev();
    touchX.current = null;
  };

  const light = slides[index].theme === 'light';
  const btn = light
    ? 'bg-white/80 hover:bg-white text-violet-700 border-slate-200 shadow-lg'
    : 'bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm';

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: light
          ? '#eef0f6'
          : 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 45%, #7c3aed 100%)',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Декоративные пятна */}
      {!light && (
        <>
          <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
        </>
      )}

      {/* Слайд */}
      <div className="relative h-full w-full pb-14 sm:pb-16">
        <SlideView key={slides[index].id} slide={slides[index]} />
      </div>

      {/* Стрелка влево */}
      {index > 0 && (
        <button
          onClick={prev}
          aria-label="Предыдущий слайд"
          className={`absolute z-50 left-2 sm:left-6 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center transition-colors ${btn}`}
        >
          <Icon name="ChevronLeft" size={22} />
        </button>
      )}

      {/* Стрелка вправо */}
      {index < total - 1 && (
        <button
          onClick={next}
          aria-label="Следующий слайд"
          className={`absolute z-50 right-2 sm:right-6 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center transition-colors ${btn}`}
        >
          <Icon name="ChevronRight" size={22} />
        </button>
      )}

      {/* Полноэкранный режим */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFull ? 'Выйти из полного экрана' : 'Полный экран'}
        className={`absolute z-50 top-2 right-2 sm:top-4 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${btn}`}
      >
        <Icon name={isFull ? 'Minimize' : 'Maximize'} size={16} />
      </button>

      {/* Нижняя панель: точки + счётчик */}
      <div
        className={`absolute z-40 bottom-0 inset-x-0 pb-3 sm:pb-4 pt-6 sm:pt-8 pointer-events-none ${
          light ? '' : 'bg-gradient-to-t from-black/25 to-transparent'
        }`}
      >
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center px-16 sm:px-4 pointer-events-auto">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Слайд ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === index
                    ? `w-6 h-2 sm:w-8 sm:h-2.5 ${light ? 'bg-violet-600' : 'bg-white'}`
                    : `w-2 h-2 sm:w-2.5 sm:h-2.5 ${light ? 'bg-slate-300 hover:bg-slate-400' : 'bg-white/40 hover:bg-white/70'}`
                }`}
              />
            ))}
          </div>
          <p className={`text-xs sm:text-sm font-medium ${light ? 'text-slate-400' : 'text-white/60'}`}>
            {index + 1} / {total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Presentation2Page;