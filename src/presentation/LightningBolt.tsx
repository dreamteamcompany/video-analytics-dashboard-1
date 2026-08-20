const PATHS = [
  'M62 0 L44 92 L68 104 L40 224 L60 238 L32 396 L52 408 L24 566 M68 104 L104 146 L96 158 M60 238 L98 320 L90 334 M52 408 L16 470',
  'M52 0 L70 78 L46 96 L74 206 L52 220 L80 372 L58 386 L84 548 M46 96 L10 132 L18 148 M52 220 L14 296 L22 312 M58 386 L96 452',
  'M58 0 L40 70 L64 88 L36 178 L58 194 L34 300 L56 316 L30 430 L50 444 L28 574 M64 88 L98 118 M58 194 L20 240 M56 316 L94 366 L88 380',
  'M50 0 L66 104 L42 118 L70 246 L46 262 L74 414 L50 428 L70 560 M42 118 L8 168 M46 262 L86 330 M50 428 L18 492 L26 506',
];

const LightningBolt = ({ size = 300, variant = 0 }: { size?: number; variant?: number }) => {
  const d = PATHS[variant % PATHS.length];
  const width = size * 0.21;
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 120 600"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      style={{ overflow: 'visible' }}
    >
      <path
        d={d}
        stroke="rgba(125, 211, 252, 0.28)"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: 'blur(16px)' }}
      />
      <path
        d={d}
        stroke="rgba(186, 230, 253, 0.5)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: 'blur(6px)' }}
      />
      <path
        d={d}
        stroke="rgba(224, 242, 254, 0.9)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: 'blur(1.4px)' }}
      />
      <path
        d={d}
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default LightningBolt;
