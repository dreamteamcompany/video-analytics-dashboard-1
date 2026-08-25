import { useEffect, useRef, useState } from 'react';

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

export {
  CARD_SHADOW,
  PILL_GRADIENT,
  HEADER_GRADIENT,
  LINE_COLOR,
  COLUMN_ICONS,
  parseMoney,
  formatMoney,
  useDutiesToggle,
};
