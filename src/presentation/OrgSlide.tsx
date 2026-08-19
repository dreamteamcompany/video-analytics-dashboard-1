import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';

const CARD_SHADOW = '0 4px 20px rgba(124,58,237,0.08), 0 1px 3px rgba(15,23,42,0.06)';
const PILL_GRADIENT = 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)';
const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';
const LINE_COLOR = '#a78bfa';

const COLUMN_ICONS = ['Target', 'Users', 'Rocket'];

const parseMoney = (v?: string) => Number((v ?? '').replace(/[^\d]/g, '')) || 0;
const formatMoney = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ');

const useDutiesToggle = (enabled: boolean) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('pointermove', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('pointermove', close);
    };
  }, [open]);

  return {
    open: enabled && open,
    ref,
    handlers: enabled
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
          onClick: () => setOpen((v) => !v),
        }
      : {},
    close: () => setOpen(false),
  };
};

const DutiesOverlay = ({ title, duties }: { title: string; duties: string[] }) =>
  createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10 duties-fade pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px]" />
      <div
        className={`relative rounded-3xl flex flex-col gap-2 px-6 py-5 text-left max-h-full overflow-auto ${duties.length > 7 ? 'w-[min(1060px,94vw)]' : 'w-[min(620px,92vw)]'}`}
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 55%, #7c3aed 100%)',
          boxShadow: '0 24px 60px rgba(15,23,42,0.45)',
        }}
      >
        <div>
          <p className="text-[10px] md:text-[12px] font-black text-white/60 tracking-[0.14em] uppercase leading-none">
            Зона ответственности
          </p>
          <p className="text-base md:text-2xl font-bold text-white leading-snug mt-1">{title}</p>
        </div>
        <div className={`gap-x-7 ${duties.length > 7 ? 'columns-2' : 'flex flex-col'}`}>
          {duties.map((d) => (
            <div key={d} className="flex items-start gap-2 break-inside-avoid mb-1.5">
              <Icon name="Check" size={14} className="text-emerald-300 flex-shrink-0 mt-[3px]" />
              <p className="text-[12px] md:text-[15px] text-white/90 leading-snug">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );

const RisksOverlay = ({ title, risks }: { title: string; risks: string[] }) =>
  createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-10 duties-fade pointer-events-none">
      <div className="absolute inset-0 bg-red-950/60 backdrop-blur-[3px] danger-flash" />
      {[
        { l: '6%', t: '4%', s: 78, d: '0ms' },
        { l: '88%', t: '10%', s: 62, d: '120ms' },
        { l: '14%', t: '72%', s: 66, d: '240ms' },
        { l: '82%', t: '76%', s: 84, d: '80ms' },
        { l: '48%', t: '2%', s: 54, d: '320ms' },
        { l: '3%', t: '38%', s: 58, d: '200ms' },
        { l: '94%', t: '44%', s: 70, d: '400ms' },
        { l: '52%', t: '92%', s: 60, d: '160ms' },
      ].map((b) => (
        <span
          key={`${b.l}${b.t}`}
          className="absolute bolt-strike"
          style={{ left: b.l, top: b.t, animationDelay: b.d }}
        >
          <Icon name="Zap" size={b.s} className="text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.9)]" />
        </span>
      ))}
      <div
        className={`relative rounded-3xl flex flex-col gap-2 px-6 py-5 text-left max-h-full overflow-auto shake-hard ${risks.length > 6 ? 'w-[min(1060px,94vw)]' : 'w-[min(620px,92vw)]'}`}
        style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 55%, #dc2626 100%)',
          boxShadow: '0 24px 70px rgba(127,29,29,0.65), 0 0 0 3px rgba(251,191,36,0.35)',
        }}
      >
        <div className="flex items-center gap-2">
          <Icon name="TriangleAlert" size={26} className="text-amber-300 flex-shrink-0 alarm-pulse" />
          <div>
            <p className="text-[10px] md:text-[12px] font-black text-amber-300 tracking-[0.14em] uppercase leading-none">
              Что будет, если убрать
            </p>
            <p className="text-base md:text-2xl font-bold text-white leading-snug mt-1">{title}</p>
          </div>
        </div>
        <div className={`gap-x-7 ${risks.length > 6 ? 'columns-2' : 'flex flex-col'}`}>
          {risks.map((d) => (
            <div key={d} className="flex items-start gap-2 break-inside-avoid mb-1.5">
              <Icon name="Zap" size={14} className="text-amber-300 flex-shrink-0 mt-[3px]" />
              <p className="text-[12px] md:text-[15px] text-white/95 leading-snug">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );

const PersonCard = ({ role, name, note, tag, salary, vacancy, photo, lead, logo, big, replace, duties, cut, cutLabel, cutTone, risks, delay = 0 }: {
  role: string; name?: string; note?: string; tag?: string; salary: string; vacancy?: boolean; photo?: string; lead?: boolean; logo?: string; big?: boolean; replace?: boolean; duties?: string[]; cut?: boolean; cutLabel?: string; cutTone?: 'red' | 'amber'; risks?: string[]; delay?: number;
}) => {
  const { open, ref, handlers } = useDutiesToggle(!!duties?.length || !!risks?.length);
  const showRisks = cut && !!risks?.length;
  const amber = cutTone === 'amber';
  const strokeColor = amber ? '#f59e0b' : '#ef4444';
  const strokeGrad = `linear-gradient(90deg, ${amber ? 'rgba(245,158,11,0)' : 'rgba(239,68,68,0)'} 0%, ${strokeColor} 12%, ${amber ? '#d97706' : '#dc2626'} 50%, ${strokeColor} 88%, ${amber ? 'rgba(245,158,11,0)' : 'rgba(239,68,68,0)'} 100%)`;
  return (
  <div
    ref={ref}
    {...handlers}
    className={`group relative flex items-center gap-3 md:gap-4 rounded-2xl backdrop-blur-sm min-w-0 px-3 md:px-5 py-3 org-in transition-transform duration-300 md:hover:scale-[1.02] min-h-[72px] md:min-h-[var(--mh)] ${duties?.length || risks?.length ? 'cursor-pointer' : ''} ${
      cut
        ? `bg-slate-100/85 ring-2 ${amber ? 'ring-amber-500' : 'ring-red-500'} [&_img]:grayscale [&_p]:text-slate-400`
        : replace
          ? 'bg-rose-50/90 ring-1 ring-rose-200'
          : 'bg-white/90'
    }`}
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
      ['--mh' as string]: big ? 'clamp(120px, 16vh, 240px)' : 'clamp(80px, 10.5vh, 160px)',
    }}
  >
    <div className="relative flex-shrink-0">
      {logo ? (
        <div className={`${big ? 'w-20 h-14 md:w-32 md:h-20' : 'w-14 h-10 md:w-20 md:h-14'} rounded-xl bg-white flex items-center justify-center px-2 ring-1 ring-slate-200`}>
          <img src={logo} alt={role} className="max-w-full max-h-full object-contain" />
        </div>
      ) : photo ? (
        <img
          src={photo}
          alt={name || role}
          className={`${big ? 'w-14 h-14 md:w-24 md:h-24' : 'w-11 h-11 md:w-14 md:h-14'} rounded-full object-cover ring-2 ${lead ? 'ring-amber-300' : replace ? 'ring-rose-300' : 'ring-violet-200'}`}
        />
      ) : (
        <div className={`${big ? 'w-14 h-14 md:w-24 md:h-24' : 'w-11 h-11 md:w-14 md:h-14'} rounded-full flex items-center justify-center ${replace ? 'bg-rose-100' : 'bg-violet-50'} ${lead ? 'ring-2 ring-amber-300' : ''}`}>
          <Icon name={replace ? 'UserMinus' : vacancy ? 'UserPlus' : 'User'} size={big ? 28 : 22} className={`${replace ? 'text-rose-500' : 'text-violet-500'} md:hidden`} />
          <Icon name={replace ? 'UserMinus' : vacancy ? 'UserPlus' : 'User'} size={big ? 44 : 26} className={`${replace ? 'text-rose-500' : 'text-violet-500'} hidden md:block`} />
        </div>
      )}
      {lead && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: '0 3px 10px rgba(124,58,237,0.25)' }}
        >
          <Icon name="Crown" size={15} className="text-amber-500" />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className={`${big ? 'text-sm md:text-2xl' : 'text-[13px] md:text-base'} font-semibold text-slate-800 leading-snug`}>
          {role}
        </p>
        {tag && (
          <span
            className="text-[10px] md:text-xs font-semibold text-white px-2 md:px-2.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: PILL_GRADIENT }}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        {name && (
          replace ? (
            <span className={`${big ? 'text-xs md:text-xl' : 'text-xs md:text-base'} leading-snug font-medium text-rose-700`}>{name}</span>
          ) : vacancy ? (
            <span className="text-[10px] md:text-xs font-semibold text-white px-2 md:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap">
              {name}
            </span>
          ) : (
            <span className={`${big ? 'text-xs md:text-xl' : 'text-xs md:text-base'} leading-snug text-slate-500`}>{name}</span>
          )
        )}
        {note && (
          <span className={`${big ? 'text-[10px] px-2 py-0.5 md:text-base md:px-4 md:py-1' : 'text-[10px] px-2 py-0.5 md:text-xs md:px-2.5'} font-semibold text-white rounded-full leading-snug bg-gradient-to-r ${replace ? 'from-rose-500 to-red-500' : 'from-emerald-500 to-teal-500 whitespace-nowrap'}`}>
            {note}
          </span>
        )}
      </div>
    </div>

    <div
      className={`rounded-full text-white font-semibold whitespace-nowrap flex-shrink-0 ${big ? 'px-2.5 py-1 text-[11px] md:px-5 md:py-2.5 md:text-xl' : 'px-2.5 py-1 text-[11px] md:px-3.5 md:py-1.5 md:text-sm'}`}
      style={{ background: PILL_GRADIENT }}
    >
      {salary}
    </div>

    {cut && (
      <>
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <span
            className="absolute left-[3%] right-[3%] top-1/2 h-[3px] rounded-full origin-center rotate-[3.2deg]"
            style={{ background: strokeGrad }}
          />
          <span
            className="absolute left-[3%] right-[3%] top-1/2 h-[3px] rounded-full origin-center -rotate-[3.2deg]"
            style={{ background: strokeGrad }}
          />
        </span>
        <span className={`absolute -top-2 left-3 z-10 text-[9px] md:text-[11px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 ${amber ? 'bg-amber-500' : 'bg-red-600'}`}>
          <Icon name={amber ? 'Clock' : 'Ban'} size={11} />
          {cutLabel || 'Сокращено'}
        </span>
      </>
    )}

    {(duties?.length || risks?.length) ? (
      <>
        <span className={`absolute top-1.5 right-1.5 ${showRisks ? 'opacity-90 alarm-pulse' : 'opacity-40'}`}>
          <Icon name={showRisks ? 'TriangleAlert' : 'Info'} size={13} className={showRisks ? (amber ? 'text-amber-500' : 'text-red-500') : 'text-violet-400'} />
        </span>
        {open && (showRisks
          ? <RisksOverlay title={role} risks={risks!} />
          : duties?.length ? <DutiesOverlay title={role} duties={duties} /> : null)}
      </>
    ) : null}
  </div>
  );
};

const StatCard = ({ icon, value, label, delay }: {
  icon: string; value: string; label: string; delay: number;
}) => (
  <div
    className="flex-1 min-w-0 rounded-2xl bg-white/90 px-3 md:px-5 py-2.5 flex items-center gap-2 md:gap-3 org-drop min-h-[52px] md:min-h-[clamp(58px,8vh,110px)]"
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
    }}
  >
    <Icon name={icon} size={20} className="text-violet-500 flex-shrink-0 md:hidden" />
    <Icon name={icon} size={26} className="text-violet-500 flex-shrink-0 hidden md:block" />
    <div className="min-w-0">
      <p className="text-lg md:text-2xl font-bold text-violet-600 leading-none">{value}</p>
      <p className="text-[11px] md:text-sm text-slate-500 leading-tight mt-0.5">{label}</p>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => {
  const isMobile = useIsMobile();
  const headDuties = useDutiesToggle(!!slide.head?.duties?.length);
  const allPeople = slide.columns?.flatMap((c) => c.people) ?? [];
  const total = allPeople.filter((p) => !p.cut).length + (slide.head ? 1 : 0);
  const vacancies = allPeople.filter((p) => p.vacancy && !p.cut).length;
  const colCount = slide.columns?.length ?? 3;
  const statsIndex = isMobile ? colCount - 1 : colCount >= 3 ? 1 : 0;
  const statsWidth = !isMobile && colCount >= 3 ? 'md:w-[calc(160%+1.5rem)]' : 'w-full';

  return (
  <div
    className="h-full flex flex-col overflow-hidden relative"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
    }}
  >
    {/* Фоновые узоры */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Точечная сетка в правом верхнем углу */}
      <div
        className="absolute top-0 right-0 w-[34%] h-[42%]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.28) 1.7px, transparent 1.7px)',
          backgroundSize: '17px 17px',
          maskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
        }}
      />

      {/* Гексагоны справа */}
      <svg className="absolute top-[8%] right-[2%] w-[26%] h-[70%]" viewBox="0 0 300 400" fill="none">
        <g stroke="rgba(124,58,237,0.09)" strokeWidth="1.6">
          <polygon points="230,40 268,62 268,106 230,128 192,106 192,62" />
          <polygon points="150,120 188,142 188,186 150,208 112,186 112,142" />
          <polygon points="255,175 293,197 293,241 255,263 217,241 217,197" />
          <polygon points="185,265 223,287 223,331 185,353 147,331 147,287" />
          <polygon points="90,300 121,318 121,354 90,372 59,354 59,318" />
        </g>
        <g fill="rgba(236,72,153,0.035)">
          <polygon points="230,40 268,62 268,106 230,128 192,106 192,62" />
          <polygon points="255,175 293,197 293,241 255,263 217,241 217,197" />
        </g>
      </svg>

      {/* Гексагоны слева внизу */}
      <svg className="absolute bottom-[6%] left-[1%] w-[12%] h-[34%]" viewBox="0 0 150 220" fill="none">
        <g stroke="rgba(124,58,237,0.08)" strokeWidth="1.5">
          <polygon points="60,20 92,38 92,74 60,92 28,74 28,38" />
          <polygon points="105,95 133,111 133,143 105,159 77,143 77,111" />
          <polygon points="45,150 73,166 73,198 45,214 17,198 17,166" />
        </g>
      </svg>

      {/* Волны в левом нижнем углу */}
      <svg className="absolute bottom-0 left-0 w-[42%] h-[42%]" viewBox="0 0 500 300" fill="none" preserveAspectRatio="none">
        <g stroke="rgba(124,58,237,0.12)" strokeWidth="1.8" fill="none">
          <path d="M-40 300 C 80 200, 200 260, 320 170 S 480 60, 560 20" />
          <path d="M-40 300 C 90 215, 210 275, 330 190 S 490 85, 570 45" />
          <path d="M-40 300 C 100 230, 220 290, 340 210 S 500 110, 580 70" />
          <path d="M-40 300 C 110 245, 230 305, 350 230 S 510 135, 590 95" />
        </g>
      </svg>

      {/* Мягкие цветные пятна */}
      <div
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-28 right-[12%] w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
      />
    </div>
    <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-4 pb-6 md:pb-2 min-h-0 overflow-y-auto md:overflow-hidden">
      {/* Верхняя строка: бейдж + руководитель */}
      <div className="flex-shrink-0 relative flex flex-col md:block items-center md:items-start gap-3 md:gap-0 md:flex md:flex-row md:justify-center">
        {slide.badge && (
          <span
            className="md:absolute md:left-0 md:top-0 inline-flex items-center justify-center gap-2 md:gap-2.5 rounded-full px-4 py-2 md:px-6 md:py-3 text-white text-[13px] md:text-lg font-semibold w-full md:w-auto md:max-w-[30%] text-center"
            style={{
              background: HEADER_GRADIENT,
              boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            }}
          >
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={16} className="flex-shrink-0 md:hidden" />
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={20} className="flex-shrink-0 hidden md:block" />
            <span className="leading-snug">{slide.badge}</span>
          </span>
        )}

        {slide.head && (
          <div className="relative org-drop w-full md:w-auto z-0 hover:z-[60]">
            <div
              className="absolute left-1/2 -top-3.5 md:-top-4 -translate-x-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center z-10"
              style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.22)' }}
            >
              <Icon name="Crown" size={18} className="text-violet-500 md:hidden" />
              <Icon name="Crown" size={22} className="text-violet-500 hidden md:block" />
            </div>
            <div
              ref={headDuties.ref}
              {...headDuties.handlers}
              className={`group relative rounded-3xl px-6 sm:px-20 pt-5 md:pt-4 pb-3 md:pb-2.5 text-center flex flex-col items-center ${slide.head.replace ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-white'} ${slide.head.duties?.length ? 'cursor-pointer' : ''}`}
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.12), 0 2px 6px rgba(15,23,42,0.06)' }}
            >
              {slide.head.photo && (
                <img
                  src={slide.head.photo}
                  alt={slide.head.name || slide.head.role}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 mb-1.5 ${slide.head.replace ? 'ring-rose-300' : 'ring-violet-200'}`}
                />
              )}
              <p className="text-lg md:text-3xl font-bold text-slate-800 leading-tight">
                {slide.head.role}
              </p>
              {slide.head.name && (
                slide.head.vacancy ? (
                  <span className="text-[11px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap mt-1.5">
                    {slide.head.name}
                  </span>
                ) : (
                  <p className="text-sm md:text-xl text-slate-500 leading-tight mt-1">
                    {slide.head.name}
                  </p>
                )
              )}
              {slide.head.note && (
                <span className="text-[10px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-0.5 md:py-1 rounded-full bg-gradient-to-r from-rose-500 to-red-500 leading-snug mt-1.5">
                  {slide.head.note}
                </span>
              )}
              <p className={`text-base md:text-2xl font-bold leading-tight mt-1.5 ${slide.head.replace ? 'text-rose-600' : 'text-violet-600'}`}>
                {slide.head.salary}
              </p>
              {slide.head.salaryNote && (
                <p className="text-[10px] md:text-xs text-slate-400 leading-tight mt-0.5">
                  {slide.head.salaryNote}
                </p>
              )}

              {slide.head.duties && slide.head.duties.length > 0 && (
                <>
                  <span className="absolute top-2 right-2 opacity-40">
                    <Icon name="Info" size={14} className="text-violet-400" />
                  </span>
                  {headDuties.open && (
                    <DutiesOverlay title={slide.head.role} duties={slide.head.duties} />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Скруглённая разводка линий к колонкам */}
      <div className="flex-shrink-0 relative h-5 sm:h-8">
        <div
          className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2"
          style={{ background: LINE_COLOR }}
        />
        {colCount > 1 && !isMobile && (
          <div
            className="absolute top-1/2 bottom-[11px] rounded-t-2xl border-l-2 border-r-2 border-t-2"
            style={{
              borderColor: LINE_COLOR,
              left: `${50 / colCount}%`,
              right: `${50 / colCount}%`,
            }}
          />
        )}
        {(isMobile || colCount % 2 === 1) && (
          <div
            className="absolute left-1/2 top-1/2 bottom-[11px] w-[2px] -translate-x-1/2"
            style={{ background: LINE_COLOR }}
          />
        )}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : colCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: isMobile ? 1 : colCount }, (_, i) => i).map((i) => (
            <div key={i} className="relative flex justify-center">
              <div
                className="absolute bottom-0 w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px]"
                style={{ borderTopColor: LINE_COLOR }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Колонки линий */}
      <div
        className="flex-1 grid grid-cols-1 gap-4 sm:gap-6 min-h-0"
        style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : colCount}, minmax(0, 1fr))` }}
      >
        {slide.columns?.map((col, ci) => (
          <div key={`${col.title}-${ci}`} className="flex flex-col min-w-0">
            {/* Заголовок линии */}
            <div
              className="rounded-full py-2 md:py-2.5 px-4 md:px-6 flex items-center justify-center gap-2 md:gap-2.5 mb-2.5 org-drop"
              style={{
                background: HEADER_GRADIENT,
                boxShadow: '0 8px 22px rgba(99,102,241,0.28)',
                animationDelay: `${250 + ci * 110}ms`,
              }}
            >
              <Icon name={col.icon ?? COLUMN_ICONS[ci] ?? 'Circle'} size={16} className="text-white/90 md:hidden flex-shrink-0" />
              <Icon name={col.icon ?? COLUMN_ICONS[ci] ?? 'Circle'} size={20} className="text-white/90 hidden md:block flex-shrink-0" />
              <p className="text-[13px] md:text-xl font-semibold text-white text-center leading-snug">{col.title}</p>
            </div>

            {/* Карточки сотрудников */}
            <div className="space-y-2">
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} delay={500 + ci * 120 + i * 110} />
              ))}
            </div>

            {col.subBlocks && col.subBlocks.length > 0 && (
              <>
                <div className="relative h-5 sm:h-8 flex-shrink-0">
                  <div
                    className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2"
                    style={{ background: LINE_COLOR }}
                  />
                  <div
                    className="absolute top-1/2 bottom-[11px] rounded-t-2xl border-l-2 border-r-2 border-t-2"
                    style={{
                      borderColor: LINE_COLOR,
                      left: `${50 / (isMobile ? 2 : col.subBlocks.length)}%`,
                      right: `${50 / (isMobile ? 2 : col.subBlocks.length)}%`,
                    }}
                  />
                  {!isMobile && col.subBlocks.length % 2 === 1 && (
                    <div
                      className="absolute left-1/2 top-1/2 bottom-[11px] w-[2px] -translate-x-1/2"
                      style={{ background: LINE_COLOR }}
                    />
                  )}
                  <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : col.subBlocks.length}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: isMobile ? 2 : col.subBlocks.length }, (_, i) => i).map((i) => (
                      <div key={i} className="relative flex justify-center">
                        <div
                          className="absolute bottom-0 w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px]"
                          style={{ borderTopColor: LINE_COLOR }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="grid gap-2 md:gap-3"
                  style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : col.subBlocks.length}, minmax(0, 1fr))` }}
                >
                  {col.subBlocks.map((sb, si) => (
                    <div
                      key={sb.title}
                      className="rounded-2xl bg-white/90 px-3 md:px-5 py-3 md:py-4 flex flex-col items-center justify-center text-center gap-2 md:gap-3 org-in min-h-[92px] md:min-h-[clamp(150px,20vh,300px)]"
                      style={{ boxShadow: CARD_SHADOW, animationDelay: `${800 + si * 110}ms` }}
                    >
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <Icon name={sb.icon ?? 'Server'} size={20} className="text-violet-500 md:hidden" />
                        <Icon name={sb.icon ?? 'Server'} size={28} className="text-violet-500 hidden md:block" />
                      </div>
                      <p className="text-[11px] md:text-lg font-semibold text-slate-700 leading-snug">
                        {sb.title}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Итоги в цифрах + ФОТ */}
            {ci === statsIndex && slide.payroll && (
              <div className={`mt-auto pt-3 ${statsWidth}`}>
                {slide.columns && (
                  <div className="flex gap-2 md:gap-3 mb-2">
                    <StatCard icon="Users" value={String(total)} label="сотрудников" delay={1200} />
                    <StatCard icon="Layers" value={String(slide.columns.length)} label={slide.columnsLabel ?? 'линии поддержки'} delay={1320} />
                    {vacancies > 0 && (
                      <StatCard icon="Search" value={String(vacancies)} label={vacancies === 1 ? 'вакансия' : 'вакансии'} delay={1440} />
                    )}
                  </div>
                )}
                <div
                  className="relative rounded-3xl bg-white pl-4 md:pl-8 pr-24 md:pr-40 py-3 md:py-4 flex items-center overflow-hidden org-drop min-h-[76px] md:min-h-[clamp(96px,13vh,165px)]"
                  style={{
                    boxShadow: CARD_SHADOW,
                    animationDelay: '1550ms',
                  }}
                >
                  <div className="min-w-0">
                    {slide.payrollWas && (
                      <div className="relative inline-flex items-center mb-0.5">
                        <p className="text-sm md:text-2xl font-bold text-slate-400 whitespace-nowrap">
                          ФОТ: {slide.payrollWas}
                        </p>
                        <span
                          className="pointer-events-none absolute left-[-2%] right-[-2%] top-1/2 h-[2.5px] rounded-full rotate-[-2deg]"
                          style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0) 0%, #ef4444 10%, #dc2626 50%, #ef4444 90%, rgba(239,68,68,0) 100%)' }}
                        />
                      </div>
                    )}
                    <p className={`font-extrabold text-slate-900 whitespace-nowrap ${slide.payrollWas ? 'text-lg md:text-3xl' : 'text-lg md:text-4xl'}`}>
                      ФОТ: {slide.payroll}
                      {slide.payrollWas && (
                        <span className="ml-2 md:ml-3 align-middle text-[10px] md:text-sm font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-emerald-500">
                          −{formatMoney(parseMoney(slide.payrollWas) - parseMoney(slide.payroll))} ₽
                        </span>
                      )}
                    </p>
                    {slide.payrollNote && (
                      <p className="text-[11px] md:text-sm text-slate-500 mt-1">{slide.payrollNote}</p>
                    )}
                  </div>
                  <img
                    src="/coins-3d.png"
                    alt=""
                    className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-16 md:w-32 object-contain pointer-events-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default OrgSlide;