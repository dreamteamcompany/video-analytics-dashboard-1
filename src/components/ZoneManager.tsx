import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { zonesApi, Zone } from '@/api/zones';
import { facesApi } from '@/api/faces';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';

// Разрешение исходного видео на сервере
const SOURCE_W = 1920;
const SOURCE_H = 1080;
const PREVIEW_W = 640;
const PREVIEW_H = 360;

interface Tooltip {
  name: string;
  x: number;
  y: number;
}

export default function ZoneManager() {
  const [zones, setZones]         = useState<Zone[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selected, setSelected]   = useState('');
  const [saving, setSaving]       = useState(false);
  const [tooltip, setTooltip]     = useState<Tooltip | null>(null);
  const containerRef              = useRef<HTMLDivElement>(null);

  const handleTooltip = (name: string | null, x: number, y: number) => {
    if (!name) { setTooltip(null); return; }
    const box = containerRef.current?.getBoundingClientRect();
    setTooltip({ name, x: x - (box?.left ?? 0), y: y - (box?.top ?? 0) });
  };

  const { canvasRef, draft, onMouseDown, onMouseMove, onMouseUp, onMouseClick, clearDraft, getDraftForSave } =
    useCanvasDrawing({
      zones,
      previewWidth: PREVIEW_W,
      previewHeight: PREVIEW_H,
      sourceWidth: SOURCE_W,
      sourceHeight: SOURCE_H,
      onTooltip: handleTooltip,
    });

  // загрузка данных
  const loadZones = async () => {
    try { setZones(await zonesApi.list()); } catch { /* silent */ }
  };

  useEffect(() => {
    loadZones();
    facesApi.list().then(list => {
      setEmployees(list);
      if (list.length) setSelected(list[0]);
    });
  }, []);

  // сохранение зоны
  const handleSave = async () => {
    const rect = getDraftForSave();
    if (!rect) return toast.error('Нарисуйте зону на превью');
    if (!selected) return toast.error('Выберите сотрудника');
    const w = Math.abs(rect.x2 - rect.x1);
    const h = Math.abs(rect.y2 - rect.y1);
    if (w < 10 || h < 10) return toast.error('Зона слишком маленькая');

    setSaving(true);
    try {
      await zonesApi.create({
        employee_name: selected,
        x1: rect.x1, y1: rect.y1,
        x2: rect.x2, y2: rect.y2,
      });
      toast.success(`Зона для «${selected}» сохранена`);
      clearDraft();
      await loadZones();
    } catch { toast.error('Не удалось сохранить зону'); }
    finally { setSaving(false); }
  };

  const hasDraft = !!draft && Math.abs(draft.x2 - draft.x1) > 4;

  return (
    <div className="space-y-4">
      {/* ── ПРЕВЬЮ + CANVAS ── */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border border-border bg-secondary select-none"
        style={{ width: PREVIEW_W, maxWidth: '100%', aspectRatio: `${PREVIEW_W}/${PREVIEW_H}` }}
      >
        {/* фоновая сетка вместо видео */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220 20% 88%)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
            fill="hsl(220 15% 70%)" fontSize="14" fontFamily="Rubik, sans-serif">
            Превью камеры · {SOURCE_W}×{SOURCE_H}
          </text>
        </svg>

        {/* canvas поверх */}
        <canvas
          ref={canvasRef}
          width={PREVIEW_W}
          height={PREVIEW_H}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onClick={onMouseClick}
          onMouseLeave={onMouseUp}
        />

        {/* подсказка при клике на зону */}
        {tooltip && (
          <div
            className="absolute z-10 bg-foreground text-background text-xs font-semibold px-2.5 py-1.5 rounded-lg pointer-events-none shadow-lg"
            style={{ left: tooltip.x + 8, top: tooltip.y - 36 }}
          >
            {tooltip.name}
          </div>
        )}

        {/* бейдж режима */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          Режим разметки
        </div>
      </div>

      {/* ── ПАНЕЛЬ УПРАВЛЕНИЯ ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* выбор сотрудника */}
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Icon name="UserRound" size={16} className="text-muted-foreground flex-shrink-0" />
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="flex-1 h-9 rounded-xl border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {employees.length === 0
              ? <option value="">— нет сотрудников —</option>
              : employees.map(e => <option key={e} value={e}>{e}</option>)
            }
          </select>
        </div>

        {/* очистить черновик */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasDraft}
          onClick={clearDraft}
          className="rounded-xl gap-1.5"
        >
          <Icon name="Eraser" size={14} /> Очистить
        </Button>

        {/* сохранить */}
        <Button
          size="sm"
          disabled={!hasDraft || saving || !selected}
          onClick={handleSave}
          className="rounded-xl gap-1.5 blue-gradient text-white border-0 shadow-sm"
        >
          {saving
            ? <Icon name="LoaderCircle" size={14} className="animate-spin" />
            : <Icon name="Save" size={14} />
          }
          Сохранить зону
        </Button>
      </div>

      {/* ── СПИСОК ЗОН ── */}
      {zones.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Сохранённые зоны ({zones.length})
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {zones.map((z, i) => (
              <div key={i} className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2.5">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: ['#4F6EF7','#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444'][i % 6] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{z.employee_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    ({z.x1},{z.y1}) → ({z.x2},{z.y2})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
