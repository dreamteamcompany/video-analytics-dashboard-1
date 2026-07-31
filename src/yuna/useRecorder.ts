import { useCallback, useRef, useState } from 'react';

export interface RecordingResult {
  base64: string;
  format: string;
  durationSec: number;
}

type RecorderState = 'idle' | 'recording' | 'paused';

export function useRecorder() {
  const [state, setState] = useState<RecorderState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const tick = useCallback(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTick = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      const rec = new MediaRecorder(stream, {
        mimeType: mime,
        audioBitsPerSecond: 128000,
      });
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRef.current = rec;
      rec.start(1000);
      startedAtRef.current = Date.now();
      setSeconds(0);
      setState('recording');
      tick();
    } catch {
      setError('Не удалось получить доступ к микрофону. Разрешите доступ в браузере.');
    }
  }, [tick]);

  const pause = useCallback(() => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.pause();
      stopTick();
      setState('paused');
    }
  }, [stopTick]);

  const resume = useCallback(() => {
    if (mediaRef.current?.state === 'paused') {
      mediaRef.current.resume();
      tick();
      setState('recording');
    }
  }, [tick]);

  const stop = useCallback((): Promise<RecordingResult | null> => {
    return new Promise((resolve) => {
      const rec = mediaRef.current;
      if (!rec) {
        resolve(null);
        return;
      }
      const durationSec = Math.round((Date.now() - startedAtRef.current) / 1000);
      rec.onstop = () => {
        stopTick();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = String(reader.result);
          const base64 = result.split(',')[1] || '';
          const format = rec.mimeType.includes('mp4') ? 'mp4' : 'webm';
          setState('idle');
          setSeconds(0);
          resolve({ base64, format, durationSec });
        };
        reader.readAsDataURL(blob);
      };
      rec.stop();
    });
  }, [stopTick]);

  const cancel = useCallback(() => {
    stopTick();
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    chunksRef.current = [];
    setState('idle');
    setSeconds(0);
  }, [stopTick]);

  return { state, seconds, error, start, pause, resume, stop, cancel };
}