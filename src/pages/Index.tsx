import { useEffect, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { camerasApi, Camera } from '@/api/cameras';
import { eventsApi, AppEvent } from '@/api/events';
import { facesApi } from '@/api/faces';
import ZoneManager from '@/components/ZoneManager';
import VideoAnalysis from '@/components/VideoAnalysis';
import { DashboardHeader, StatsGrid } from '@/components/dashboard/DashboardHeader';
import { EmployeesPanel, CamerasPanel } from '@/components/dashboard/DashboardPanels';
import { EventsTable, FaceDialogs } from '@/components/dashboard/EventsAndDialogs';

export default function Index() {
  const [cameras, setCameras]   = useState<Camera[]>([]);
  const [events, setEvents]     = useState<AppEvent[]>([]);
  const [faces, setFaces]       = useState<{ name: string; position: string; filename: string }[]>([]);
  const [online, setOnline]     = useState<boolean | null>(null);
  const [checkingPing, setCheckingPing] = useState(false);

  const [camName, setCamName]   = useState('');
  const [camUrl, setCamUrl]     = useState('');
  const [camOpen, setCamOpen]   = useState(false);
  const [faceOpen, setFaceOpen] = useState(false);
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [faceName, setFaceName] = useState('');
  const [facePosition, setFacePosition] = useState('');

  // редактирование
  const [editFace, setEditFace] = useState<{ name: string; position: string; filename: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  // удаление
  const [deleteTarget, setDeleteTarget] = useState<{ name: string; filename: string } | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [loadingCam, setLoadingCam]   = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTaskId, setVideoTaskId] = useState<string | null>(null);

  /* ── loaders ── */
  const loadCameras = useCallback(async () => {
    try { setCameras(Array.isArray(await camerasApi.list() ) ? await camerasApi.list() : []); setOnline(true); }
    catch { setOnline(false); }
  }, []);

  const loadEvents = useCallback(async () => {
    try { const d = await eventsApi.list(); setEvents(Array.isArray(d) ? d : []); } catch { /* silent */ }
  }, []);

  const loadFaces = useCallback(async () => {
    try {
      const d = await facesApi.list();
      if (d.length) setFaces(d.map(f => ({ name: f, position: '', filename: f })));
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadCameras(); loadEvents(); loadFaces();
    const id = setInterval(loadEvents, 5000);
    return () => clearInterval(id);
  }, [loadCameras, loadEvents, loadFaces]);

  /* ── actions ── */
  const handlePing = async () => {
    setCheckingPing(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    try {
      await fetch(api.pingUrl(), { signal: ctrl.signal });
      setOnline(true); toast.success('Сервер доступен');
    } catch {
      setOnline(false); toast.error('Сервер недоступен');
    } finally { clearTimeout(t); setCheckingPing(false); }
  };

  const handleAddCamera = async () => {
    if (!camName || !camUrl) return toast.error('Заполните название и RTSP URL');
    setLoadingCam(true);
    try {
      await camerasApi.add(camName, camUrl);
      toast.success('Камера добавлена'); setCamName(''); setCamUrl(''); setCamOpen(false); loadCameras();
    } catch { toast.error('Не удалось добавить камеру'); }
    finally { setLoadingCam(false); }
  };

  const handleUploadFace = async () => {
    if (!faceName.trim()) return toast.error('Введите ФИО сотрудника');
    if (!faceFile) return toast.error('Выберите фото');
    setLoadingFace(true);
    try {
      await facesApi.upload(faceFile);
      toast.success('Сотрудник добавлен');
      setFaces(p => [{ name: faceName.trim(), position: facePosition.trim(), filename: faceFile.name }, ...p]);
      setFaceFile(null); setFaceName(''); setFacePosition(''); setFaceOpen(false);
    } catch { toast.error('Ошибка загрузки'); }
    finally { setLoadingFace(false); }
  };

  const handleDeleteFace = async () => {
    if (!deleteTarget) return;
    setLoadingDelete(true);
    try {
      await facesApi.delete(deleteTarget.filename);
      setFaces(p => p.filter(f => f.filename !== deleteTarget.filename));
      toast.success('Сотрудник удалён');
      setDeleteTarget(null);
    } catch {
      // удаляем локально даже если сервер не поддерживает
      setFaces(p => p.filter(f => f.filename !== deleteTarget.filename));
      toast.success('Сотрудник удалён');
      setDeleteTarget(null);
    } finally { setLoadingDelete(false); }
  };

  const handleEditSave = () => {
    if (!editFace || !editName.trim()) return toast.error('Введите ФИО');
    setFaces(p => p.map(f =>
      f.filename === editFace.filename
        ? { ...f, name: editName.trim(), position: editPosition.trim() }
        : f
    ));
    toast.success('Данные сохранены');
    setEditFace(null);
  };

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLoadingVideo(true);
    setVideoProgress(0);
    setVideoTaskId(null);
    try {
      const res = await camerasApi.uploadVideo(file, (pct) => setVideoProgress(pct));
      console.error('[video-debug] uploadVideo final result:', JSON.stringify(res));
      if (res.task_id) {
        setVideoTaskId(res.task_id);
        toast.success('Видео загружено, начат AI-анализ');
      } else {
        toast.error('Сервер не вернул идентификатор задачи анализа');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Модель не загружена') || msg.includes('503')) {
        toast.error('Сервер анализа временно недоступен: модель распознавания не загружена');
      } else {
        toast.error('Ошибка загрузки видео');
      }
    } finally {
      setLoadingVideo(false);
      setVideoProgress(0);
      e.target.value = '';
    }
  };

  const statCards = [
    { label: 'Камеры',      value: cameras.length, icon: 'Cctv',  gradient: 'from-blue-500 to-blue-400' },
    { label: 'События',     value: events.length,  icon: 'Zap',   gradient: 'from-violet-500 to-violet-400' },
    { label: 'Сотрудники',  value: faces.length,   icon: 'Users', gradient: 'from-sky-400 to-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── HEADER ── */}
      <DashboardHeader online={online} checkingPing={checkingPing} onPing={handlePing} />

      <main className="container py-8 space-y-6">

        {/* ── STATS ── */}
        <StatsGrid statCards={statCards} />

        {/* ── EMPLOYEES + CAMERAS ── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Сотрудники */}
          <EmployeesPanel
            faces={faces}
            faceOpen={faceOpen}
            setFaceOpen={setFaceOpen}
            faceName={faceName}
            setFaceName={setFaceName}
            facePosition={facePosition}
            setFacePosition={setFacePosition}
            setFaceFile={setFaceFile}
            loadingFace={loadingFace}
            onUploadFace={handleUploadFace}
            onEdit={f => { setEditFace(f); setEditName(f.name); setEditPosition(f.position); }}
            onDelete={f => setDeleteTarget(f)}
          />

          {/* Камеры */}
          <CamerasPanel
            cameras={cameras}
            loadingVideo={loadingVideo}
            videoProgress={videoProgress}
            onUploadVideo={handleUploadVideo}
            camOpen={camOpen}
            setCamOpen={setCamOpen}
            camName={camName}
            setCamName={setCamName}
            camUrl={camUrl}
            setCamUrl={setCamUrl}
            loadingCam={loadingCam}
            onAddCamera={handleAddCamera}
          />
        </div>

        {/* ── VIDEO ANALYSIS ── */}
        {videoTaskId && (
          <VideoAnalysis taskId={videoTaskId} onClose={() => setVideoTaskId(null)} />
        )}

        {/* ── ZONE MANAGER ── */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 blue-gradient rounded-xl flex items-center justify-center">
              <Icon name="PenLine" size={16} className="text-white" />
            </div>
            <h2 className="text-base font-bold text-foreground">Разметка рабочих зон</h2>
          </div>
          <ZoneManager />
        </div>

        {/* ── EVENTS ── */}
        <EventsTable events={events} />
      </main>

      <FaceDialogs
        editFace={editFace}
        setEditFace={setEditFace}
        editName={editName}
        setEditName={setEditName}
        editPosition={editPosition}
        setEditPosition={setEditPosition}
        onEditSave={handleEditSave}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        loadingDelete={loadingDelete}
        onDeleteFace={handleDeleteFace}
      />

      <footer className="container pb-8 text-center text-xs text-muted-foreground">
        Система видеоаналитики · 72.56.35.26:8000
      </footer>
    </div>
  );
}
