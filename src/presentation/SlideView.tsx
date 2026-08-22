import Icon from '@/components/ui/icon';
import { Slide } from './slides';
import OrgSlide from './OrgSlide';
import GoalsSlide from './GoalsSlide';
import EcosystemSlide from './EcosystemSlide';
import IndicatorsSlide from './IndicatorsSlide';
import PhasesSlide from './PhasesSlide';
import HandoffSlide from './HandoffSlide';
import SplitRolesSlide from './SplitRolesSlide';
import ClosingSlide from './ClosingSlide';
import AiSlide from './AiSlide';
import LightBackdrop from './LightBackdrop';

const TitleSlide = ({ slide }: { slide: Slide }) => (
  <div
    className="h-full relative overflow-hidden flex flex-col items-center justify-center text-center px-6 sm:px-12"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
    }}
  >
    <LightBackdrop />

    <div className="relative z-10 flex flex-col items-center">
      <div
        className="org-drop rounded-3xl bg-white px-8 sm:px-16 py-6 sm:py-9 flex flex-col items-center"
        style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.12), 0 2px 6px rgba(15,23,42,0.06)' }}
      >
        <img
          src={slide.logo || '/logo-team.png'}
          alt={slide.subtitle || 'Команда мечты'}
          className="h-12 sm:h-20 lg:h-24 object-contain"
        />

        <h1 className="mt-5 sm:mt-8 text-4xl sm:text-7xl lg:text-8xl font-extrabold text-slate-900 tracking-tight">
          {slide.title}
        </h1>

        <div
          className="mt-5 sm:mt-7 w-20 sm:w-28 h-1.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)' }}
        />

        <div className="mt-5 sm:mt-7 space-y-1.5">
          {slide.author && (
            <p className="text-xl sm:text-2xl font-semibold text-slate-700">{slide.author}</p>
          )}
          {slide.year && (
            <p className="text-sm sm:text-base text-violet-500 tracking-[0.3em] font-bold">
              {slide.year}
            </p>
          )}
        </div>
      </div>

      {slide.subtitle && (
        <span
          className="org-drop mt-5 sm:mt-7 inline-flex items-center gap-2 sm:gap-2.5 rounded-full px-5 py-2.5 sm:px-7 sm:py-3 text-white text-[13px] sm:text-lg font-semibold"
          style={{
            background: 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)',
            boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            animationDelay: '180ms',
          }}
        >
          <Icon name="LayoutGrid" size={18} className="flex-shrink-0" />
          <span className="leading-snug">{slide.subtitle}</span>
        </span>
      )}
    </div>
  </div>
);

const BulletsSlide = ({ slide }: { slide: Slide }) => (
  <div className="h-full flex flex-col justify-center px-6 sm:px-14 lg:px-24 py-12">
    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
      {slide.title}
    </h2>
    {slide.subtitle && (
      <p className="text-lg sm:text-xl text-white/70 mb-8">{slide.subtitle}</p>
    )}
    <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 mb-8" />

    <div className="space-y-4 max-w-4xl">
      {slide.bullets?.map((b, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5"
        >
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Icon name={b.icon || 'Check'} size={22} className="text-cyan-200" />
          </div>
          <div>
            <p className="text-white text-lg sm:text-xl font-semibold leading-snug">{b.text}</p>
            {b.note && <p className="text-white/65 text-sm sm:text-base mt-1">{b.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SlideView = ({ slide }: { slide: Slide }) => (
  <div className="h-full w-full animate-slide-fade-in">
    {slide.type === 'title' && <TitleSlide slide={slide} />}
    {slide.type === 'bullets' && <BulletsSlide slide={slide} />}
    {slide.type === 'org' && <OrgSlide slide={slide} />}
    {slide.type === 'goals' && <GoalsSlide slide={slide} />}
    {slide.type === 'ecosystem' && <EcosystemSlide slide={slide} />}
    {slide.type === 'indicators' && <IndicatorsSlide slide={slide} />}
    {slide.type === 'phases' && <PhasesSlide slide={slide} />}
    {slide.type === 'handoff' && <HandoffSlide slide={slide} />}
    {slide.type === 'split' && <SplitRolesSlide slide={slide} />}
    {slide.type === 'closing' && <ClosingSlide slide={slide} />}
    {slide.type === 'ai' && <AiSlide slide={slide} />}
  </div>
);

export default SlideView;