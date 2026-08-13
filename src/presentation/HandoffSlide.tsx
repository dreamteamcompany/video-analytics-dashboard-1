import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const CARD_SHADOW = '0 4px 20px rgba(124,58,237,0.08), 0 1px 3px rgba(15,23,42,0.06)';
const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';

const SideCard = ({
  side,
  accent,
  delay,
}: {
  side: NonNullable<Slide['handoffLeft']>;
  accent: 'violet' | 'indigo';
  delay: number;
}) => (
  <div
    className="rounded-3xl bg-white/95 px-4 md:px-6 py-3 md:py-4 flex flex-col gap-2.5 org-in min-w-0"
    style={{ boxShadow: CARD_SHADOW, animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          accent === 'violet' ? 'bg-violet-50' : 'bg-indigo-50'
        }`}
      >
        <Icon
          name={side.icon ?? 'Users'}
          size={24}
          className={accent === 'violet' ? 'text-violet-500' : 'text-indigo-500'}
        />
      </div>
      <div className="min-w-0">
        <span
          className="inline-block text-[10px] md:text-xs font-bold text-white px-2.5 py-0.5 rounded-full"
          style={{ background: HEADER_GRADIENT }}
        >
          {side.badge}
        </span>
        <p className="text-[13px] md:text-xl font-bold text-slate-800 leading-snug mt-1">
          {side.title}
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      {side.points.map((p) => (
        <div key={p} className="flex items-start gap-2">
          <Icon name="Check" size={14} className="text-emerald-500 flex-shrink-0 mt-[3px]" />
          <p className="text-[12px] md:text-base text-slate-600 leading-snug">{p}</p>
        </div>
      ))}
    </div>
  </div>
);

const HandoffSlide = ({ slide }: { slide: Slide }) => (
  <div
    className="h-full flex flex-col overflow-hidden relative"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
    }}
  >
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[34%] h-[42%]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.28) 1.7px, transparent 1.7px)',
          backgroundSize: '17px 17px',
          maskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
        }}
      />
      <div
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-28 right-[12%] w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
      />
    </div>

    <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-3 pb-6 md:pb-10 min-h-0 overflow-y-auto md:overflow-hidden">
      <div className="flex-shrink-0 flex flex-col items-center gap-2 md:gap-3">
        {slide.badge && (
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-2.5 text-white text-[12px] md:text-base font-semibold"
            style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            <Icon name={slide.badgeIcon ?? 'ArrowLeftRight'} size={18} className="flex-shrink-0" />
            {slide.badge}
          </span>
        )}
        <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 text-center leading-tight">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="text-[12px] md:text-lg text-slate-500 text-center max-w-3xl leading-snug">
            {slide.subtitle}
          </p>
        )}
      </div>

      <div className="mt-2 md:mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center flex-shrink-0">
        {slide.handoffLeft && <SideCard side={slide.handoffLeft} accent="violet" delay={150} />}

        <div className="flex md:flex-col items-center justify-center gap-2 md:gap-3 org-drop" style={{ animationDelay: '320ms' }}>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-white text-[11px] md:text-sm font-bold whitespace-nowrap"
            style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(99,102,241,0.28)' }}
          >
            <Icon name="FileText" size={15} className="flex-shrink-0" />
            {slide.handoffForward}
            <Icon name="ArrowRight" size={15} className="flex-shrink-0 hidden md:block" />
            <Icon name="ArrowDown" size={15} className="flex-shrink-0 md:hidden" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-white text-[11px] md:text-sm font-bold text-violet-600 whitespace-nowrap ring-1 ring-violet-200">
            <Icon name="ArrowLeft" size={15} className="flex-shrink-0 hidden md:block" />
            <Icon name="ArrowUp" size={15} className="flex-shrink-0 md:hidden" />
            {slide.handoffBack}
            <Icon name="CircleCheck" size={15} className="flex-shrink-0 text-emerald-500" />
          </div>
        </div>

        {slide.handoffRight && <SideCard side={slide.handoffRight} accent="indigo" delay={450} />}
      </div>

      {slide.handoffSteps && (
        <div
          className="mt-2 md:mt-3 grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-5 flex-shrink-0"
        >
          {slide.handoffSteps.map((st, i) => (
            <div
              key={st.step}
              className="relative rounded-2xl bg-white/95 px-3 md:px-4 py-2.5 md:py-3 flex flex-col gap-1 org-in min-w-0"
              style={{ boxShadow: CARD_SHADOW, animationDelay: `${650 + i * 110}ms` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: HEADER_GRADIENT }}
                >
                  <Icon name={st.icon ?? 'Circle'} size={18} />
                </div>
                <span className="text-2xl md:text-3xl font-extrabold text-violet-100 leading-none">
                  {st.step}
                </span>
              </div>
              <p className="text-[12px] md:text-base font-bold text-slate-800 leading-snug">
                {st.title}
              </p>
              <p className="text-[11px] md:text-[13px] text-slate-500 leading-snug">{st.text}</p>
              <span className="mt-auto pt-1 text-[10px] md:text-xs font-semibold text-violet-600">
                {st.owner}
              </span>
            </div>
          ))}
        </div>
      )}

      {slide.handoffResult && (
        <div
          className="mt-2 md:mt-3 rounded-3xl px-4 md:px-8 py-3 md:py-3.5 flex items-center gap-3 md:gap-5 org-drop flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 55%, #7c3aed 100%)',
            boxShadow: '0 18px 44px rgba(76,29,149,0.30)',
            animationDelay: '1250ms',
          }}
        >
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Icon name="Gem" size={26} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] md:text-xl font-extrabold text-white leading-snug">
              {slide.handoffResult}
            </p>
            {slide.handoffResultNote && (
              <p className="text-[11px] md:text-base text-white/70 leading-snug mt-1">
                {slide.handoffResultNote}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default HandoffSlide;
