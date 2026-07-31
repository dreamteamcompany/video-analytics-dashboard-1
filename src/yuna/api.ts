const YUNA_API = 'https://functions.poehali.dev/b9775f41-cc5d-4f54-b6c3-00bb7477338f';

export type Speaker = 'doctor' | 'patient' | 'unknown';

export interface Utterance {
  speaker: Speaker;
  text: string;
}

export interface SessionMetrics {
  empathy: number | null;
  trust: number | null;
  patient_state: number | null;
  quality: number | null;
  communication: number | null;
}

export interface YunaSession {
  id: number;
  title: string;
  status: string;
  duration_sec: number;
  created_at: string;
  overall: number | null;
  metrics: SessionMetrics | null;
}

export interface SessionDetail {
  session: {
    id: number;
    title: string;
    status: string;
    transcript: string;
    duration_sec: number;
    created_at: string;
  };
  utterances: Utterance[];
  analysis: Analysis | null;
}

export interface DentalExam {
  name: string;
  reason: string;
}

export interface DentalDiagnosis {
  primary_diagnosis: {
    name: string;
    probability: number;
    tooth: string;
  };
  differential: string[];
  examinations: DentalExam[];
  plan: string[];
}

export interface Analysis {
  empathy: number;
  trust: number;
  patient_state: number;
  quality: number;
  communication: number;
  summary: string;
  recommendations: string[];
  strengths: string[];
  concerns: string[];
  dental?: DentalDiagnosis | null;
}

export interface TranscribeResult {
  session_id: number;
  utterances: Utterance[];
  transcript: string;
  analysis: Analysis | null;
}

export const yunaApi = {
  listSessions: async (): Promise<YunaSession[]> => {
    const res = await fetch(YUNA_API);
    if (!res.ok) throw new Error(`list ${res.status}`);
    const data = (await res.json()) as { sessions: YunaSession[] };
    return data.sessions;
  },

  getSession: async (id: number): Promise<SessionDetail> => {
    const res = await fetch(`${YUNA_API}?session_id=${id}`);
    if (!res.ok) throw new Error(`session ${res.status}`);
    return (await res.json()) as SessionDetail;
  },

  transcribe: async (
    audioBase64: string,
    format: string,
    durationSec: number,
  ): Promise<TranscribeResult> => {
    const res = await fetch(YUNA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio_base64: audioBase64,
        format,
        duration_sec: durationSec,
      }),
    });
    if (!res.ok) {
      let msg = `transcribe ${res.status}`;
      try {
        const err = (await res.json()) as { error?: string };
        if (err.error) msg = err.error;
      } catch { /* ignore */ }
      throw new Error(msg);
    }
    return (await res.json()) as TranscribeResult;
  },
};