const IdeaBackdrop = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px)',
        backgroundSize: '54px 54px',
        maskImage: 'radial-gradient(ellipse at 50% 42%, #000 12%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 42%, #000 12%, transparent 78%)',
      }}
    />

    <div
      className="absolute -top-16 -left-16 w-[30rem] h-[30rem]"
      style={{
        backgroundImage: 'radial-gradient(rgba(139,92,246,0.32) 1.4px, transparent 1.4px)',
        backgroundSize: '16px 16px',
        maskImage: 'radial-gradient(circle at 32% 32%, #000 0%, transparent 66%)',
        WebkitMaskImage: 'radial-gradient(circle at 32% 32%, #000 0%, transparent 66%)',
      }}
    />

    <div
      className="absolute -top-40 -right-40 w-[46rem] h-[46rem] rounded-full"
      style={{
        background:
          'repeating-radial-gradient(circle, rgba(167,139,250,0.26) 0 1.5px, transparent 1.5px 26px)',
        maskImage: 'radial-gradient(circle, #000 8%, transparent 68%)',
        WebkitMaskImage: 'radial-gradient(circle, #000 8%, transparent 68%)',
      }}
    />

    <div
      className="absolute -bottom-56 -left-32 w-[44rem] h-[44rem] rounded-full"
      style={{
        background:
          'repeating-radial-gradient(circle, rgba(236,72,153,0.16) 0 1.5px, transparent 1.5px 30px)',
        maskImage: 'radial-gradient(circle, #000 6%, transparent 66%)',
        WebkitMaskImage: 'radial-gradient(circle, #000 6%, transparent 66%)',
      }}
    />

    <div
      className="absolute top-[6%] right-[10%] w-[16rem] h-[16rem] opacity-60"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(124,58,237,0.16) 0 1px, transparent 1px 14px)',
        maskImage: 'radial-gradient(circle, #000 0%, transparent 68%)',
        WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 68%)',
      }}
    />

    <div
      className="aurora-a absolute -bottom-32 right-[-6rem] w-[34rem] h-[34rem] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.16) 0%, transparent 68%)' }}
    />
    <div
      className="aurora-b absolute top-[-8rem] left-[24%] w-[32rem] h-[32rem] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 68%)' }}
    />

    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 810"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M-60 690 C 240 610, 380 780, 700 690 S 1180 560, 1500 660"
        stroke="rgba(124,58,237,0.13)"
        strokeWidth="1.4"
      />
      <path
        d="M-60 740 C 260 660, 400 830, 720 740 S 1200 610, 1500 710"
        stroke="rgba(236,72,153,0.10)"
        strokeWidth="1.4"
      />
      <path
        d="M-40 120 C 260 40, 420 200, 740 110 S 1200 -10, 1500 90"
        stroke="rgba(124,58,237,0.10)"
        strokeWidth="1.4"
      />
    </svg>

    <div
      className="absolute left-[6%] bottom-[16%] w-24 h-24 rounded-[28px] rotate-12"
      style={{ border: '1.5px solid rgba(139,92,246,0.16)' }}
    />
    <div
      className="absolute right-[7%] top-[26%] w-16 h-16 rounded-full"
      style={{ border: '1.5px solid rgba(236,72,153,0.16)' }}
    />
    <div
      className="absolute left-[16%] top-[12%] w-10 h-10 rounded-2xl -rotate-6"
      style={{ border: '1.5px solid rgba(139,92,246,0.18)' }}
    />
  </div>
);

export default IdeaBackdrop;
