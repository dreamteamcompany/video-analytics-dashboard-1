import Icon from '@/components/ui/icon';
import { Slide } from './slides';
import OrgSlide from './OrgSlide';
import GoalsSlide from './GoalsSlide';
import EcosystemSlide from './EcosystemSlide';
import IndicatorsSlide from './IndicatorsSlide';
import PhasesSlide from './PhasesSlide';
import HandoffSlide from './HandoffSlide';

const TitleSlide = ({ slide }: { slide: Slide }) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-6 sm:px-12">
    {slide.logo ? (
      <img
        src={slide.logo}
        alt={slide.subtitle || 'Логотип'}
        className="h-24 sm:h-32 lg:h-40 object-contain mb-8 drop-shadow-2xl"
      />
    ) : (
      <div className="mb-6 sm:mb-8 flex flex-col items-center">
        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-2xl">
          <Icon name="Users" size={44} className="text-white/90 sm:hidden" />
          <Icon name="Users" size={56} className="text-white/90 hidden sm:block" />
        </div>
        {slide.subtitle && (
          <p className="mt-4 sm:mt-5 text-base sm:text-2xl font-semibold text-white/90 tracking-wide">
            {slide.subtitle}
          </p>
        )}
      </div>
    )}

    <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight drop-shadow-lg">
      {slide.title}
    </h1>

    <div className="mt-6 sm:mt-8 w-20 sm:w-24 h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300" />

    <div className="mt-6 sm:mt-10 space-y-2">
      {slide.author && (
        <p className="text-xl sm:text-2xl text-white/85 font-medium">{slide.author}</p>
      )}
      {slide.year && (
        <p className="text-base sm:text-lg text-white/60 tracking-[0.3em] font-semibold">
          {slide.year}
        </p>
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
  </div>
);

export default SlideView;