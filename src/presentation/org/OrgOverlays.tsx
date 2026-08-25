import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';
import LightningBolt from '../LightningBolt';

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
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-10 duties-fade pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-red-950/60 backdrop-blur-[3px] danger-flash" />
      <div className="absolute inset-0 screen-flash" />
      {[
        { l: '6%', t: '-12%', s: 620, d: '0ms', r: -7, v: 0, o: 0.9 },
        { l: '84%', t: '-14%', s: 700, d: '2100ms', r: 9, v: 1, o: 0.85 },
        { l: '34%', t: '-9%', s: 470, d: '4700ms', r: -3, v: 2, o: 0.6 },
        { l: '62%', t: '-11%', s: 540, d: '7300ms', r: 5, v: 3, o: 0.6 },
        { l: '18%', t: '112%', s: 560, d: '1100ms', r: 186, v: 1, o: 0.8 },
        { l: '73%', t: '114%', s: 640, d: '3400ms', r: 173, v: 2, o: 0.75 },
        { l: '45%', t: '110%', s: 440, d: '6100ms', r: 181, v: 0, o: 0.5 },
        { l: '-8%', t: '22%', s: 620, d: '900ms', r: 82, v: 3, o: 0.7 },
        { l: '-6%', t: '68%', s: 500, d: '5400ms', r: 96, v: 0, o: 0.55 },
        { l: '108%', t: '18%', s: 660, d: '2800ms', r: -84, v: 2, o: 0.7 },
        { l: '106%', t: '72%', s: 520, d: '6800ms', r: -97, v: 1, o: 0.55 },
        { l: '-4%', t: '-8%', s: 480, d: '3900ms', r: 38, v: 2, o: 0.45 },
        { l: '104%', t: '-6%', s: 500, d: '7700ms', r: -42, v: 3, o: 0.45 },
      ].map((b) => (
        <span
          key={`${b.l}${b.t}`}
          className="absolute origin-top"
          style={{ left: b.l, top: b.t, transform: `rotate(${b.r}deg)`, opacity: b.o }}
        >
          <span className="block bolt-flash" style={{ animationDelay: b.d }}>
            <LightningBolt size={b.s} variant={b.v} />
          </span>
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
              <Icon name="TriangleAlert" size={13} className="text-amber-300 flex-shrink-0 mt-[3px]" />
              <p className="text-[12px] md:text-[15px] text-white/95 leading-snug">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );

export { DutiesOverlay, RisksOverlay };
