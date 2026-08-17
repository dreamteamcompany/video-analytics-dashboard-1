import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { yunaApi, SessionDetail } from './api';
import { fmtTime, fmtDate } from './utils';
import { YunaStyles, YunaFooter } from './YunaChrome';
import AnalysisReport from './AnalysisReport';
import TranscriptView from './TranscriptView';
import DentalReport from './DentalReport';
import SpeechAnalytics from './SpeechAnalytics';
import { TacticsReport, ComplicationsReport, TreatmentReport } from './PatientReports';
import {
  AutoFillBlock,
  CurrentPatientBlock,
  LoyaltyBlock,
  UpsellBlock,
  DrugControlBlock,
  AnesthesiaBlock,
  DoctorStateBlock,
} from './LiveBlocks';

const YunaSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    yunaApi
      .getSession(Number(id))
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить приём');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const a = data?.analysis ?? null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <YunaStyles />

      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Шапка приёма */}
        <div
          className="rounded-2xl shadow-lg p-5 text-white mb-6"
          style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name="Stethoscope" size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{data?.session.title || 'Приём'}</h1>
                {data && (
                  <p className="text-sm text-white/80">
                    {fmtDate(data.session.created_at)} · Длительность {fmtTime(data.session.duration_sec)}
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/yuna/work"
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={16} />
              К рабочему месту
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Icon name="LoaderCircle" size={32} className="text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Левая колонка — врач */}
            <div className="xl:col-span-1 space-y-6">
              <div
                className="rounded-2xl shadow-lg p-4 text-white"
                style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)' }}
              >
                <h2 className="text-xl font-bold flex items-center">
                  <Icon name="Stethoscope" size={22} className="mr-3" />
                  РАЗДЕЛ ВРАЧА
                </h2>
              </div>

              {data.session.audio_url && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 yuna-section-divider yuna-doctor-divider">
                    <Icon name="Volume2" size={18} className="text-purple-500 mr-2 inline" />
                    Запись приёма
                  </h2>
                  <audio src={data.session.audio_url} controls className="w-full">
                    Ваш браузер не поддерживает воспроизведение аудио.
                  </audio>
                </div>
              )}

              <AnesthesiaBlock a={a?.anesthesia} />
              <DoctorStateBlock s={a?.doctor_state} />
            </div>

            {/* Правая часть — пациент и аналитика */}
            <div className="xl:col-span-3 space-y-6">
              <div
                className="rounded-2xl shadow-lg p-4 text-white"
                style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)' }}
              >
                <h2 className="text-xl font-bold flex items-center">
                  <Icon name="User" size={22} className="mr-3" />
                  РАЗДЕЛ ПАЦИЕНТА
                </h2>
              </div>

              <AutoFillBlock p={a?.patient} />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <CurrentPatientBlock p={a?.patient} />

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                    <Icon name="Brain" size={20} className="text-purple-500 mr-2 inline" />
                    Психологическое состояние
                  </h2>
                  {a ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">Спокойствие</span>
                          <span className="text-xs font-semibold text-green-600">{a.patient_state}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${a.patient_state}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">Доверие к врачу</span>
                          <span className="text-xs font-semibold text-blue-600">{a.trust}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${a.trust}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">Уровень тревоги</span>
                          <span className="text-xs font-semibold text-orange-600">{100 - a.patient_state}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${100 - a.patient_state}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6 text-gray-400">
                      <Icon name="Brain" size={28} className="mb-2" />
                      <p className="text-sm text-gray-500">Нет данных по этому приёму</p>
                    </div>
                  )}
                </div>

                <LoyaltyBlock l={a?.loyalty} />
              </div>

              {a ? (
                <AnalysisReport analysis={a} />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <p className="text-sm text-gray-500 text-center py-4">
                    Для этого приёма нет отчёта анализа.
                  </p>
                </div>
              )}

              <UpsellBlock u={a?.upsell} />

              {a?.dental && a.dental.primary_diagnosis ? (
                <DentalReport dental={a.dental} />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                    <Icon name="Stethoscope" size={20} className="text-blue-500 mr-2 inline" />
                    Диагностика и обследования
                  </h2>
                  <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
                    <Icon name="Stethoscope" size={32} className="mb-3" />
                    <p className="text-sm font-medium text-gray-500">Диагностики по этому приёму нет</p>
                  </div>
                </div>
              )}

              <TacticsReport tactics={a?.tactics} />
              <DrugControlBlock d={a?.drug_control} />
              <ComplicationsReport complications={a?.complications} />
              <TreatmentReport treatment={a?.treatment} />

              <SpeechAnalytics speech={a?.speech ?? null} />

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                  <Icon name="Mic" size={18} className="text-red-500 mr-2 inline" />
                  Расшифровка приёма
                </h3>
                {data.utterances.length > 0 ? (
                  <TranscriptView utterances={data.utterances} />
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">Расшифровка недоступна</p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <YunaFooter />
      </div>
    </div>
  );
};

export default YunaSessionPage;
