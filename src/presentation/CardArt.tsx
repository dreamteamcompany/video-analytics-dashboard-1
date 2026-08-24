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

const TILES = [TileChart, TileFlame, TilePeople];

export const CardTileArt = ({ index, className = '' }: { index: number; className?: string }) => {
  const Tile = TILES[index % TILES.length];
  return <Tile className={className} />;
};

const ARTS = [ChartArt, ProfileArt, FlowArt];

export const CardArt = ({ index, className = '' }: { index: number; className?: string }) => {
  const Art = ARTS[index % ARTS.length];
  return <Art className={className} />;
};

export { ShieldArt };
export default CardArt;