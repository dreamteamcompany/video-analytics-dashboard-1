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
  const [level, setLevel] = useState(0);
  const [silent, setSilent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const silentSinceRef = useRef<number | null>(null);

  const SILENCE_LEVEL = 0.04;
  const SILENCE_MS = 3000;

  const stopMeter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    silentSinceRef.current = null;
    setLevel(0);
    setSilent(false);
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      const lvl = Math.min(1, rms * 3);
      setLevel(lvl);

      const now = performance.now();
      if (lvl < SILENCE_LEVEL) {
        if (silentSinceRef.current === null) silentSinceRef.current = now;
        if (now - silentSinceRef.current >= SILENCE_MS) setSilent(true);
      } else {
        silentSinceRef.current = null;
        setSilent(false);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);

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
      startMeter(stream);
    } catch {
      setError('Не удалось получить доступ к микрофону. Разрешите доступ в браузере.');
    }
  }, [tick, startMeter]);

  const pause = useCallback(() => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.pause();
      stopTick();
      stopMeter();
      setState('paused');
    }
  }, [stopTick, stopMeter]);

  const resume = useCallback(() => {
    if (mediaRef.current?.state === 'paused') {
      mediaRef.current.resume();
      tick();
      if (streamRef.current) startMeter(streamRef.current);
      setState('recording');
    }
  }, [tick, startMeter]);

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
        stopMeter();
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
  }, [stopTick, stopMeter]);

  const cancel = useCallback(() => {
    stopTick();
    stopMeter();
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    chunksRef.current = [];
    setState('idle');
    setSeconds(0);
  }, [stopTick, stopMeter]);

  return { state, seconds, level, silent, error, start, pause, resume, stop, cancel };
}