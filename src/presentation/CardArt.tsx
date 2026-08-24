const V1 = '#c4b5fd';
const V2 = '#a78bfa';
const V3 = '#8b5cf6';
const GLASS = '#ede9fe';

const ChartArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="26" y="18" width="136" height="150" rx="18" fill="white" opacity="0.85" />
    <rect x="26" y="18" width="136" height="150" rx="18" fill={GLASS} opacity="0.75" />
    <rect x="42" y="34" width="60" height="9" rx="4.5" fill={V1} opacity="0.75" />
    <rect x="42" y="50" width="96" height="9" rx="4.5" fill={V1} opacity="0.45" />
    <rect x="46" y="106" width="20" height="44" rx="7" fill={V1} opacity="0.85" />
    <rect x="76" y="88" width="20" height="62" rx="7" fill={V2} opacity="0.8" />
    <rect x="106" y="70" width="20" height="80" rx="7" fill={V3} opacity="0.7" />
    <path d="M50 128 L80 108 L108 118 L142 78" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="80" cy="108" r="7" fill="white" stroke={V3} strokeWidth="5" />
    <circle cx="142" cy="78" r="8" fill={V3} />
    <rect x="128" y="120" width="52" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="128" y="120" width="52" height="52" rx="16" fill={V2} opacity="0.35" />
    <path d="M144 158 L166 136" stroke={V3} strokeWidth="6" strokeLinecap="round" />
    <path d="M152 134 H168 V150" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="30" y="16" width="140" height="158" rx="20" fill="white" opacity="0.85" />
    <rect x="30" y="16" width="140" height="158" rx="20" fill={GLASS} opacity="0.7" />
    <circle cx="66" cy="54" r="18" fill={V2} opacity="0.85" />
    <rect x="94" y="42" width="60" height="10" rx="5" fill={V1} opacity="0.8" />
    <rect x="94" y="60" width="42" height="10" rx="5" fill={V1} opacity="0.5" />
    <rect x="48" y="88" width="106" height="9" rx="4.5" fill={V1} opacity="0.45" />
    <rect x="48" y="105" width="82" height="9" rx="4.5" fill={V1} opacity="0.35" />
    <rect x="48" y="122" width="60" height="9" rx="4.5" fill={V1} opacity="0.3" />
    <circle cx="140" cy="138" r="34" fill="white" opacity="0.95" />
    <circle cx="140" cy="138" r="28" stroke={V1} strokeWidth="14" opacity="0.55" />
    <path
      d="M140 110 a28 28 0 0 1 24 42"
      stroke={V3}
      strokeWidth="14"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const FlowArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="20" y="30" width="72" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="20" y="30" width="72" height="52" rx="16" fill={GLASS} opacity="0.8" />
    <rect x="34" y="46" width="44" height="8" rx="4" fill={V2} opacity="0.8" />
    <rect x="34" y="60" width="28" height="8" rx="4" fill={V1} opacity="0.6" />
    <rect x="108" y="30" width="72" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="108" y="30" width="72" height="52" rx="16" fill={GLASS} opacity="0.8" />
    <rect x="122" y="46" width="44" height="8" rx="4" fill={V2} opacity="0.6" />
    <rect x="122" y="60" width="34" height="8" rx="4" fill={V1} opacity="0.5" />
    <rect x="60" y="118" width="80" height="58" rx="18" fill="white" opacity="0.95" />
    <rect x="60" y="118" width="80" height="58" rx="18" fill={V2} opacity="0.28" />
    <path d="M84 148 l12 12 22 -26" stroke={V3} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 82 L92 118" stroke={V1} strokeWidth="5" strokeLinecap="round" />
    <path d="M144 82 L108 118" stroke={V1} strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="100" r="6" fill={V3} opacity="0.5" />
  </svg>
);

const ShieldArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path
      d="M100 24 L162 50 V102 C162 140 132 166 100 178 C68 166 38 140 38 102 V50 Z"
      fill="white"
      opacity="0.9"
    />
    <path
      d="M100 24 L162 50 V102 C162 140 132 166 100 178 C68 166 38 140 38 102 V50 Z"
      fill={V2}
      opacity="0.3"
    />
    <path d="M76 100 l18 20 34 -42" stroke={V3} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileChart = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="22" y="52" width="13" height="30" rx="5" fill={V1} />
    <rect x="43" y="38" width="13" height="44" rx="5" fill={V2} />
    <rect x="64" y="24" width="13" height="58" rx="5" fill={V3} opacity="0.85" />
    <path d="M26 42 L46 26 L64 34 L82 16" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="82" cy="16" r="7" fill={V3} />
  </svg>
);

const TileFlame = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path
      d="M50 12 C64 30 78 40 78 58 a28 28 0 0 1 -56 0 C22 42 34 36 40 22 C44 34 48 38 50 12 Z"
      fill={V2}
    />
    <path d="M50 46 C58 56 62 60 62 66 a12 12 0 0 1 -24 0 C38 58 44 54 50 46 Z" fill="white" opacity="0.7" />
  </svg>
);

const TilePeople = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <circle cx="38" cy="34" r="14" fill={V2} />
    <path d="M14 78 a24 24 0 0 1 48 0 Z" fill={V2} opacity="0.75" />
    <circle cx="70" cy="40" r="11" fill={V3} opacity="0.65" />
    <path d="M52 78 a19 19 0 0 1 36 0 Z" fill={V3} opacity="0.5" />
  </svg>
);


const TileShield = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path d="M50 12 L82 26 V52 c0 20 -14 32 -32 38 C32 84 18 72 18 52 V26 Z" fill={V2} />
    <path d="M38 52 l9 10 17 -22" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileDoc = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="24" y="14" width="52" height="72" rx="10" fill={V1} />
    <rect x="34" y="30" width="32" height="7" rx="3.5" fill="white" opacity="0.9" />
    <rect x="34" y="44" width="32" height="7" rx="3.5" fill="white" opacity="0.7" />
    <rect x="34" y="58" width="20" height="7" rx="3.5" fill="white" opacity="0.55" />
    <circle cx="72" cy="70" r="16" fill={V3} />
    <path d="M66 70 l5 5 9 -10" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileClock = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <circle cx="50" cy="50" r="34" fill={V1} />
    <circle cx="50" cy="50" r="24" fill="white" opacity="0.55" />
    <path d="M50 32 V52 l14 9" stroke={V3} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileBrain = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="24" y="24" width="52" height="52" rx="16" fill={V2} />
    <circle cx="40" cy="42" r="6" fill="white" />
    <circle cx="62" cy="42" r="6" fill="white" />
    <circle cx="50" cy="62" r="6" fill="white" opacity="0.85" />
    <path d="M40 42 L50 62 L62 42" stroke="white" strokeWidth="4" opacity="0.7" />
    <path d="M14 50 h10 M76 50 h10 M50 10 v10" stroke={V3} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const TileMoney = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="14" y="28" width="72" height="46" rx="12" fill={V1} />
    <circle cx="50" cy="51" r="14" fill="white" opacity="0.8" />
    <path d="M50 42 v18 M45 47 h10 M45 55 h10" stroke={V3} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

const TileGear = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path d="M50 14 l8 8 h11 v11 l8 8 -8 8 v11 h-11 l-8 8 -8 -8 h-11 v-11 l-8 -8 8 -8 v-11 h11 z" fill={V2} />
    <circle cx="50" cy="49" r="12" fill="white" opacity="0.85" />
  </svg>
);

const TILES = [TileChart, TileFlame, TilePeople];

const KEYWORDS: [RegExp, typeof TileChart][] = [
  [/выгор|стресс|перегруз|риск|нагруз|конфликт/i, TileFlame],
  [/безопас|защит|доступ|прав|конфиденц|соглас|этик|контрол/i, TileShield],
  [/документ|отч[её]т|протокол|заключ|бумаг|запис|карт/i, TileDoc],
  [/врем|расписан|график|смен|срок|дедлайн|задержк|отпуск/i, TileClock],
  [/ии|ai|модел|алгоритм|прогноз|нейро|анализ/i, TileBrain],
  [/деньг|финанс|бюджет|стоим|оплат|выручк|экономи/i, TileMoney],
  [/интеграц|настрой|процесс|автомат|систем|сценар|этап/i, TileGear],
  [/сотрудник|команд|персонал|пациент|клиент|hr|люд|врач/i, TilePeople],
  [/метрик|показател|статист|динамик|рост|kpi|график/i, TileChart],
];

const pickTile = (text: string) => KEYWORDS.find(([re]) => re.test(text))?.[1];

export const CardTileArt = ({
  index,
  text = '',
  avoid = '',
  className = '',
}: {
  index: number;
  text?: string;
  avoid?: string;
  className?: string;
}) => {
  const mine = pickTile(text);
  const other = avoid ? pickTile(avoid) : undefined;
  const Tile =
    mine && mine !== other
      ? mine
      : KEYWORDS.map(([, t]) => t).find((t) => t !== other && t !== mine) ?? TILES[index % TILES.length];
  return <Tile className={className} />;
};

const ARTS = [ChartArt, ProfileArt, FlowArt];

const ART_KEYWORDS: [RegExp, typeof ChartArt][] = [
  [/сотрудник|персонал|пациент|клиент|hr|врач|команд|профил/i, ProfileArt],
  [/процесс|интеграц|этап|сценар|автомат|шаг|маршрут|поток/i, FlowArt],
  [/метрик|показател|прогноз|статист|динамик|рост|нагруз|kpi/i, ChartArt],
];

export const CardArt = ({
  index,
  text = '',
  className = '',
}: {
  index: number;
  text?: string;
  className?: string;
}) => {
  const Art = ART_KEYWORDS.find(([re]) => re.test(text))?.[1] ?? ARTS[index % ARTS.length];
  return <Art className={className} />;
};

export { ShieldArt };
export default CardArt;