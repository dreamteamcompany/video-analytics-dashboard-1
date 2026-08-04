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
  login?: string;
}

const TOKEN_KEY = 'yuna_token';

export const authStore = {
  get: (): string => localStorage.getItem(TOKEN_KEY) || '',
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const authHeaders = (): Record<string, string> => {
  const t = authStore.get();
  return t ? { Authorization: t } : {};
};

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

export interface SpeechStats {
  count: number;
  comm_quality: { empathy: number; clarity: number; professionalism: number; engagement: number };
  needs: { active_questions: number; depth: number; hidden_needs: number };
  objections: { financial: number; fear_pain: number; time_need: number };
  promotions: { mentioned: number; relevance: number; conversion: number };
  listening: { clarifying: number; paraphrasing: number };
  med_terms: { explained: number; adapted: number };
  emotion: { positive: number; neutral: number; negative: number };
  pauses_sec: number;
  filler_words: { word: string; count: number }[];
  mistakes: { name: string; share: number }[];
}

export interface PsychologyStats {
  count: number;
  avg_stress: number;
  high_stress_count: number;
  distribution: { low: number; medium: number; high: number };
}

export interface YunaStats {
  counts: { today: number; week: number; month: number; total: number };
  kpi: {
    quality: number | null;
    communication: number | null;
    avg_minutes: number | null;
    satisfaction: number | null;
  };
  speech: SpeechStats | null;
  psychology: PsychologyStats | null;
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
  listSessions: async (doctorId?: number | null): Promise<YunaSession[]> => {
    const url = doctorId ? `${YUNA_API}?doctor_id=${doctorId}` : YUNA_API;
    const res = await fetch(url);
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

  createDoctor: async (d: Partial<Doctor> & { login?: string; password?: string }): Promise<Doctor> => {
    const res = await fetch(`${YUNA_API}?resource=doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(d),
    });
    if (!res.ok) {
      let msg = `create ${res.status}`;
      try { const e = (await res.json()) as { error?: string }; if (e.error) msg = e.error; } catch { /* ignore */ }
      throw new Error(msg);
    }
    return ((await res.json()) as { doctor: Doctor }).doctor;
  },

  updateDoctor: async (id: number, d: Partial<Doctor> & { login?: string; password?: string }): Promise<Doctor> => {
    const res = await fetch(`${YUNA_API}?resource=doctors&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(d),
    });
    if (!res.ok) {
      let msg = `update ${res.status}`;
      try { const e = (await res.json()) as { error?: string }; if (e.error) msg = e.error; } catch { /* ignore */ }
      throw new Error(msg);
    }
    return ((await res.json()) as { doctor: Doctor }).doctor;
  },

  deleteDoctor: async (id: number): Promise<void> => {
    const res = await fetch(`${YUNA_API}?resource=doctors&id=${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error(`delete ${res.status}`);
  },

  login: async (login: string, password: string): Promise<Doctor> => {
    const res = await fetch(`${YUNA_API}?resource=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    if (!res.ok) {
      let msg = 'Неверный логин или пароль';
      try { const e = (await res.json()) as { error?: string }; if (e.error) msg = e.error; } catch { /* ignore */ }
      throw new Error(msg);
    }
    const data = (await res.json()) as { token: string; doctor: Doctor };
    authStore.set(data.token);
    return data.doctor;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${YUNA_API}?resource=logout`, { method: 'POST', headers: { ...authHeaders() } });
    } catch { /* ignore */ }
    authStore.clear();
  },

  me: async (): Promise<Doctor | null> => {
    if (!authStore.get()) return null;
    const res = await fetch(`${YUNA_API}?resource=me`, { headers: { ...authHeaders() } });
    if (!res.ok) {
      authStore.clear();
      return null;
    }
    return ((await res.json()) as { doctor: Doctor }).doctor;
  },

  rating: async (): Promise<RatingEntry[]> => {
    const res = await fetch(`${YUNA_API}?resource=rating`);
    if (!res.ok) throw new Error(`rating ${res.status}`);
    return ((await res.json()) as { rating: RatingEntry[] }).rating;
  },

  stats: async (doctorId?: number | null): Promise<YunaStats> => {
    const url = doctorId ? `${YUNA_API}?resource=stats&doctor_id=${doctorId}` : `${YUNA_API}?resource=stats`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`stats ${res.status}`);
    return (await res.json()) as YunaStats;
  },

  learning: async (): Promise<Learning> => {
    const res = await fetch(`${YUNA_API}?resource=learning`);
    if (!res.ok) throw new Error(`learning ${res.status}`);
    return (await res.json()) as Learning;
  },
};