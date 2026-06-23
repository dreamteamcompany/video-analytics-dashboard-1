import { useRef, useState, useCallback, useEffect } from 'react';
import { Zone } from '@/api/zones';

export interface Rect {
  x1: number; y1: number;
  x2: number; y2: number;
}

interface UseCanvasDrawingProps {
  zones: Zone[];
  previewWidth: number;
  previewHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  onTooltip: (name: string | null, x: number, y: number) => void;
}

const ZONE_COLORS = [
  '#4F6EF7', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
];

export function useCanvasDrawing({
  zones,
  previewWidth,
  previewHeight,
  sourceWidth,
  sourceHeight,
  onTooltip,
}: UseCanvasDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draft, setDraft] = useState<Rect | null>(null);
  const drawing = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });

  // масштаб preview → source
  const scaleX = sourceWidth / previewWidth;
  const scaleY = sourceHeight / previewHeight;

  const toSource = useCallback((r: Rect): Rect => ({
    x1: Math.round(Math.min(r.x1, r.x2) * scaleX),
    y1: Math.round(Math.min(r.y1, r.y2) * scaleY),
    x2: Math.round(Math.max(r.x1, r.x2) * scaleX),
    y2: Math.round(Math.max(r.y1, r.y2) * scaleY),
  }), [scaleX, scaleY]);

  const toPreview = useCallback((z: Zone): Rect => ({
    x1: z.x1 / scaleX,
    y1: z.y1 / scaleY,
    x2: z.x2 / scaleX,
    y2: z.y2 / scaleY,
  }), [scaleX, scaleY]);

  // ── отрисовка ──
  const redraw = useCallback((currentDraft: Rect | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // сохранённые зоны
    zones.forEach((z, i) => {
      const r = toPreview(z);
      const color = ZONE_COLORS[i % ZONE_COLORS.length];
      const w = r.x2 - r.x1;
      const h = r.y2 - r.y1;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = color + '22';
      ctx.beginPath();
      ctx.roundRect(r.x1, r.y1, w, h, 4);
      ctx.fill();
      ctx.stroke();

      // подпись
      const label = z.employee_name;
      ctx.font = 'bold 12px Rubik, sans-serif';
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(r.x1, r.y1 - 20, tw + 12, 20);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, r.x1 + 6, r.y1 - 5);
      ctx.restore();
    });

    // черновик
    if (currentDraft) {
      const x = Math.min(currentDraft.x1, currentDraft.x2);
      const y = Math.min(currentDraft.y1, currentDraft.y2);
      const w = Math.abs(currentDraft.x2 - currentDraft.x1);
      const h = Math.abs(currentDraft.y2 - currentDraft.y1);

      ctx.save();
      ctx.strokeStyle = '#4F6EF7';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.fillStyle = 'rgba(79,110,247,0.12)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }
  }, [zones, toPreview]);

  useEffect(() => { redraw(draft); }, [redraw, draft]);

  // ── mouse events ──
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    drawing.current = true;
    startPt.current = pos;
    setDraft({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
    onTooltip(null, 0, 0);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const pos = getPos(e);
    setDraft({ x1: startPt.current.x, y1: startPt.current.y, x2: pos.x, y2: pos.y });
  };

  const onMouseUp = () => { drawing.current = false; };

  const onMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing.current) return;
    const pos = getPos(e);
    // ищем зону под курсором
    const hit = zones.find(z => {
      const r = toPreview(z);
      return pos.x >= Math.min(r.x1, r.x2) && pos.x <= Math.max(r.x1, r.x2)
          && pos.y >= Math.min(r.y1, r.y2) && pos.y <= Math.max(r.y1, r.y2);
    });
    if (hit) onTooltip(hit.employee_name, e.clientX, e.clientY);
    else onTooltip(null, 0, 0);
  };

  const clearDraft = () => setDraft(null);

  const getDraftForSave = (): Rect | null => {
    if (!draft) return null;
    return toSource(draft);
  };

  return { canvasRef, draft, onMouseDown, onMouseMove, onMouseUp, onMouseClick, clearDraft, getDraftForSave };
}
