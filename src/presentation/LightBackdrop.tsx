const LightBackdrop = () => (
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

    <svg className="absolute bottom-[6%] left-[1%] w-[12%] h-[34%]" viewBox="0 0 150 220" fill="none">
      <g stroke="rgba(124,58,237,0.08)" strokeWidth="1.5">
        <polygon points="60,20 92,38 92,74 60,92 28,74 28,38" />
        <polygon points="105,95 133,111 133,143 105,159 77,143 77,111" />
        <polygon points="45,150 73,166 73,198 45,214 17,198 17,166" />
      </g>
    </svg>

    <svg className="absolute bottom-0 left-0 w-[42%] h-[42%]" viewBox="0 0 500 300" fill="none" preserveAspectRatio="none">
      <g stroke="rgba(124,58,237,0.12)" strokeWidth="1.8" fill="none">
        <path d="M-40 300 C 80 200, 200 260, 320 170 S 480 60, 560 20" />
        <path d="M-40 300 C 90 215, 210 275, 330 190 S 490 85, 570 45" />
        <path d="M-40 300 C 100 230, 220 290, 340 210 S 500 110, 580 70" />
        <path d="M-40 300 C 110 245, 230 305, 350 230 S 510 135, 590 95" />
      </g>
    </svg>

    <div
      className="absolute -top-24 -left-20 w-96 h-96 rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)' }}
    />
    <div
      className="absolute -bottom-28 right-[12%] w-[28rem] h-[28rem] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
    />
  </div>
);

export default LightBackdrop;
