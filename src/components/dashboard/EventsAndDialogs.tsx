import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AppEvent } from '@/api/events';
import { Card, SectionHead, eventMeta } from './shared';
import { FaceItem } from './DashboardPanels';

export const EventsTable = ({ events }: { events: AppEvent[] }) => (
  <Card>
    <SectionHead
      icon="ScrollText"
      title="События и логи"
      action={
        <div className="flex items-center gap-2 bg-green-50 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-success live-ring" />
          <span className="text-xs font-medium text-green-700">Авто-обновление · 5 сек</span>
        </div>
      }
    />
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="text-left pb-3 pr-4">Сотрудник</th>
            <th className="text-left pb-3 pr-4">Тип события</th>
            <th className="text-left pb-3 pr-4">Детали</th>
            <th className="text-left pb-3">Время</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {events.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 blue-gradient-soft rounded-2xl flex items-center justify-center mb-3">
                    <Icon name="ClipboardList" size={28} className="text-brand" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Событий пока нет</p>
                  <p className="text-xs text-muted-foreground mt-1">Данные обновляются каждые 5 секунд</p>
                </div>
              </td>
            </tr>
          ) : (
            events.slice().reverse().map((ev, i) => {
              const m = eventMeta(ev.event_type);
              return (
                <tr key={ev.id ?? i} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 blue-gradient-soft rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={13} className="text-brand" />
                      </div>
                      <span className="text-sm font-semibold">{ev.name || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${m.bg} ${m.color}`}>
                      <Icon name={m.icon} size={12} /> {m.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{ev.details || '—'}</td>
                  <td className="py-3 text-xs text-muted-foreground font-mono">{ev.time || ev.timestamp || '—'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

interface FaceDialogsProps {
  editFace: FaceItem | null;
  setEditFace: (f: FaceItem | null) => void;
  editName: string;
  setEditName: (v: string) => void;
  editPosition: string;
  setEditPosition: (v: string) => void;
  onEditSave: () => void;
  deleteTarget: { name: string; filename: string } | null;
  setDeleteTarget: (t: { name: string; filename: string } | null) => void;
  loadingDelete: boolean;
  onDeleteFace: () => void;
}

export const FaceDialogs = ({
  editFace, setEditFace, editName, setEditName, editPosition, setEditPosition, onEditSave,
  deleteTarget, setDeleteTarget, loadingDelete, onDeleteFace,
}: FaceDialogsProps) => (
  <>
    {/* ── ДИАЛОГ РЕДАКТИРОВАНИЯ ── */}
    <Dialog open={!!editFace} onOpenChange={open => !open && setEditFace(null)}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Редактировать сотрудника</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">ФИО <span className="text-destructive">*</span></Label>
            <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Иванов Иван Иванович" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Должность</Label>
            <Input value={editPosition} onChange={e => setEditPosition(e.target.value)} placeholder="Менеджер, охранник…" className="rounded-xl" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setEditFace(null)}>Отмена</Button>
          <Button onClick={onEditSave} className="rounded-xl blue-gradient text-white border-0">Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ── ДИАЛОГ УДАЛЕНИЯ ── */}
    <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Удалить сотрудника?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-1">
          Сотрудник <span className="font-semibold text-foreground">{deleteTarget?.name || deleteTarget?.filename}</span> будет удалён из системы распознавания.
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button
            onClick={onDeleteFace}
            disabled={loadingDelete}
            className="rounded-xl bg-destructive hover:bg-destructive/90 text-white border-0"
          >
            {loadingDelete ? <Icon name="LoaderCircle" size={16} className="animate-spin" /> : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);

export default EventsTable;
