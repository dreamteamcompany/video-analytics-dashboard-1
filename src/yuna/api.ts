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
  audio_url?: string;
}

export interface SessionDetail {
  session: {
    id: number;
    title: string;
    status: string;
    transcript: string;
    duration_sec: number;
    created_at: string;
    audio_url?: string;
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

export interface Tactics {
  approach: string;
  sequence: string[];
  equipment: string[];
  notes: string[];
}

export interface Complications {
  risk: number;
  factors: { name: string; impact: string }[];
}

export interface Treatment {
  recommended: { title: string; detail: string }[];
  match: number;
  alternatives: { name: string; score: number }[];
  aftercare: string[];
}

export interface PatientCard {
  name: string;
  age: number | null;
  sex: string;
  weight_kg: number | null;
  allergies: string[];
  chronic: string[];
  smoking: string;
  complaints: string[];
  localization: string;
}

export interface Anesthesia {
  drug: string;
  dose_ml: number | null;
  reserve_ml: number | null;
  max_ml: number | null;
  basis: string;
  alternatives: { name: string; dose_ml: number | null }[];
}

export interface DrugControl {
  contraindications: { drug: string; reason: string }[];
  interactions: { drug: string; note: string }[];
  safe: string[];
}

export interface Upsell {
  potential: string;
  services: { name: string; score: number }[];
  phrases: string[];
}

export interface Loyalty {
  repeat: number;
  nps: number | null;
  recommend: number;
}

export interface DoctorState {
  status: string;
  stress: number;
  speech_rate: string;
  tone: string;
  improve: { area: string; delta: string }[];
  coaching: string;
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
  tactics?: Tactics | null;
  complications?: Complications | null;
  treatment?: Treatment | null;
  patient?: PatientCard | null;
  anesthesia?: Anesthesia | null;
  drug_control?: DrugControl | null;
  upsell?: Upsell | null;
  loyalty?: Loyalty | null;
  doctor_state?: DoctorState | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience_years: number;
  avatar_url: string;
  points: number;
  is_active: boolean;
}

export interface RatingEntry {
  place: number;
  id: number;
  name: string;
  specialty: string;
  experience_years: number;
  avatar_url: string;
  points: number;
  sessions_week: number;
}

export interface YunaStats {
  counts: { today: number; week: number; month: number; total: number };
  kpi: {
    quality: number | null;
    communication: number | null;
    avg_minutes: number | null;
    satisfaction: number | null;
  };
}

export interface Learning {
  recommended: { topic: string; relevance: number; why: string }[];
  events: { title: string; date: string; format: string; url: string }[];
  focus: string;
}

export interface TranscribeResult {
  session_id: number;
  utterances: Utterance[];
  transcript: string;
  analysis: Analysis | null;
  audio_url?: string;
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
    doctorId?: number | null,
  ): Promise<TranscribeResult> => {
    const res = await fetch(YUNA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio_base64: audioBase64,
        format,
        duration_sec: durationSec,
        doctor_id: doctorId ?? null,
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

  listDoctors: async (): Promise<Doctor[]> => {
    const res = await fetch(`${YUNA_API}?resource=doctors`);
    if (!res.ok) throw new Error(`doctors ${res.status}`);
    return ((await res.json()) as { doctors: Doctor[] }).doctors;
  },

  createDoctor: async (d: Partial<Doctor>): Promise<Doctor> => {
    const res = await fetch(`${YUNA_API}?resource=doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    if (!res.ok) {
      let msg = `create ${res.status}`;
      try { const e = (await res.json()) as { error?: string }; if (e.error) msg = e.error; } catch { /* ignore */ }
      throw new Error(msg);
    }
    return ((await res.json()) as { doctor: Doctor }).doctor;
  },

  updateDoctor: async (id: number, d: Partial<Doctor>): Promise<Doctor> => {
    const res = await fetch(`${YUNA_API}?resource=doctors&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    if (!res.ok) throw new Error(`update ${res.status}`);
    return ((await res.json()) as { doctor: Doctor }).doctor;
  },

  deleteDoctor: async (id: number): Promise<void> => {
    const res = await fetch(`${YUNA_API}?resource=doctors&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`delete ${res.status}`);
  },

  rating: async (): Promise<RatingEntry[]> => {
    const res = await fetch(`${YUNA_API}?resource=rating`);
    if (!res.ok) throw new Error(`rating ${res.status}`);
    return ((await res.json()) as { rating: RatingEntry[] }).rating;
  },

  stats: async (): Promise<YunaStats> => {
    const res = await fetch(`${YUNA_API}?resource=stats`);
    if (!res.ok) throw new Error(`stats ${res.status}`);
    return (await res.json()) as YunaStats;
  },

  learning: async (): Promise<Learning> => {
    const res = await fetch(`${YUNA_API}?resource=learning`);
    if (!res.ok) throw new Error(`learning ${res.status}`);
    return (await res.json()) as Learning;
  },
};