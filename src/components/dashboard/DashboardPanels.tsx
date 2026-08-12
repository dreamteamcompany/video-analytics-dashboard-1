import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Camera } from '@/api/cameras';
import { Card, SectionHead } from './shared';

export interface FaceItem { name: string; position: string; filename: string }

interface EmployeesPanelProps {
  faces: FaceItem[];
  faceOpen: boolean;
  setFaceOpen: (open: boolean) => void;
  faceName: string;
  setFaceName: (v: string) => void;
  facePosition: string;
  setFacePosition: (v: string) => void;
  setFaceFile: (f: File | null) => void;
  loadingFace: boolean;
  onUploadFace: () => void;
  onEdit: (f: FaceItem) => void;
  onDelete: (f: FaceItem) => void;
}

export const EmployeesPanel = ({
  faces, faceOpen, setFaceOpen, faceName, setFaceName, facePosition, setFacePosition,
  setFaceFile, loadingFace, onUploadFace, onEdit, onDelete,
}: EmployeesPanelProps) => (
  <Card>
    <SectionHead
      icon="UserRound"
      title="Сотрудники"
      action={
        <Dialog open={faceOpen} onOpenChange={open => { setFaceOpen(open); if (!open) { setFaceName(''); setFacePosition(''); setFaceFile(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl gap-1.5 blue-gradient text-white border-0 shadow-sm">
              <Icon name="UserPlus" size={14} /> Добавить сотрудника
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Новый сотрудник</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">ФИО <span className="text-destructive">*</span></Label>
                <Input
                  value={faceName}
                  onChange={e => setFaceName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Должность</Label>
                <Input
                  value={facePosition}
                  onChange={e => setFacePosition(e.target.value)}
                  placeholder="Менеджер, охранник…"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Фото лица <span className="text-destructive">*</span></Label>
                <Input
                  type="file" accept="image/*"
                  className="rounded-xl"
                  onChange={e => setFaceFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">Фото используется для распознавания в системе</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onUploadFace} disabled={loadingFace} className="rounded-xl blue-gradient text-white border-0 w-full">
                {loadingFace ? <Icon name="LoaderCircle" size={16} className="animate-spin" /> : 'Добавить сотрудника'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    />
    {faces.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 blue-gradient-soft rounded-2xl flex items-center justify-center mb-3">
          <Icon name="Users" size={28} className="text-brand" />
        </div>
        <p className="text-sm font-medium text-foreground">Сотрудники не загружены</p>
        <p className="text-xs text-muted-foreground mt-1">Нажмите «Добавить сотрудника» выше</p>
      </div>
    ) : (
      <ul className="space-y-2">
        {faces.map((f, i) => (
          <li key={i} className="group flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-9 h-9 blue-gradient rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {f.name ? f.name.charAt(0).toUpperCase() : <Icon name="User" size={15} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{f.name || f.filename}</p>
              {f.position
                ? <p className="text-xs text-muted-foreground truncate">{f.position}</p>
                : <p className="text-xs text-muted-foreground/50 truncate italic">Должность не указана</p>
              }
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(f)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-muted-foreground hover:text-brand transition-colors"
                title="Редактировать"
              >
                <Icon name="Pencil" size={13} />
              </button>
              <button
                onClick={() => onDelete(f)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                title="Удалить"
              >
                <Icon name="Trash2" size={13} />
              </button>
            </div>
            <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0" />
          </li>
        ))}
      </ul>
    )}
  </Card>
);

interface CamerasPanelProps {
  cameras: Camera[];
  loadingVideo: boolean;
  videoProgress: number;
  onUploadVideo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  camOpen: boolean;
  setCamOpen: (open: boolean) => void;
  camName: string;
  setCamName: (v: string) => void;
  camUrl: string;
  setCamUrl: (v: string) => void;
  loadingCam: boolean;
  onAddCamera: () => void;
}

export const CamerasPanel = ({
  cameras, loadingVideo, videoProgress, onUploadVideo, camOpen, setCamOpen,
  camName, setCamName, camUrl, setCamUrl, loadingCam, onAddCamera,
}: CamerasPanelProps) => (
  <Card>
    <SectionHead
      icon="Cctv"
      title="Камеры и видео"
      action={
        <div className="flex gap-2">
          <label className={`relative inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-border px-3 py-1.5 text-xs font-medium overflow-hidden transition-colors ${loadingVideo ? 'text-brand pointer-events-none' : 'text-muted-foreground hover:bg-secondary'}`}>
            {loadingVideo && (
              <span className="absolute inset-0 bg-brand/10 transition-all" style={{ width: `${videoProgress}%` }} />
            )}
            <span className="relative flex items-center gap-1.5">
              {loadingVideo
                ? <><Icon name="LoaderCircle" size={13} className="animate-spin" />{videoProgress}%</>
                : <><Icon name="Film" size={13} />Видео</>}
            </span>
            <input type="file" accept="video/*" className="hidden" disabled={loadingVideo} onChange={onUploadVideo} />
          </label>
          <Dialog open={camOpen} onOpenChange={setCamOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl gap-1.5 blue-gradient text-white border-0 shadow-sm">
                <Icon name="Plus" size={14} /> Камера
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Добавить камеру</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Название</Label>
                  <Input value={camName} onChange={e => setCamName(e.target.value)} placeholder="Cam-01 / Вход" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">RTSP URL</Label>
                  <Input value={camUrl} onChange={e => setCamUrl(e.target.value)} placeholder="rtsp://..." className="rounded-xl font-mono text-sm" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={onAddCamera} disabled={loadingCam} className="rounded-xl blue-gradient text-white border-0">
                  {loadingCam ? <Icon name="LoaderCircle" size={16} className="animate-spin" /> : 'Добавить'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    />
    {cameras.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 blue-gradient-soft rounded-2xl flex items-center justify-center mb-3">
          <Icon name="Cctv" size={28} className="text-brand" />
        </div>
        <p className="text-sm font-medium text-foreground">Камеры не подключены</p>
        <p className="text-xs text-muted-foreground mt-1">Добавьте камеру через кнопку выше</p>
      </div>
    ) : (
      <ul className="space-y-2">
        {cameras.map((c, i) => (
          <li key={c.id ?? i} className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-2 h-2 rounded-full bg-success live-ring flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{c.rtsp_url}</p>
            </div>
            <Icon name="Cctv" size={16} className="text-brand flex-shrink-0" />
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default EmployeesPanel;
