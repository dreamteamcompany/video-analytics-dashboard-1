import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { yunaApi, Doctor } from './api';

const emptyForm = { name: '', specialty: '', experience_years: 0, avatar_url: '', is_active: true, login: '', password: '' };

const YunaSettingsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDoctors(await yunaApi.listDoctors());
    } catch {
      setError('Не удалось загрузить список');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startNew = () => { setForm(emptyForm); setEditing('new'); setError(null); };
  const startEdit = (d: Doctor) => {
    setForm({ name: d.name, specialty: d.specialty, experience_years: d.experience_years, avatar_url: d.avatar_url, is_active: d.is_active, login: d.login || '', password: '' });
    setEditing(d.id);
    setError(null);
  };

  const save = async () => {
    if (!form.name.trim()) { setError('Введите имя врача'); return; }
    if (!form.login.trim()) { setError('Введите логин'); return; }
    if (editing === 'new' && form.password.length < 4) { setError('Пароль должен быть не короче 4 символов'); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing === 'new') {
        await yunaApi.createDoctor(form);
      } else if (typeof editing === 'number') {
        await yunaApi.updateDoctor(editing, form);
      }
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить учётную запись врача?')) return;
    try {
      await yunaApi.deleteDoctor(id);
      await load();
    } catch {
      setError('Не удалось удалить');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link to="/yuna" className="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center hover:bg-gray-50">
              <Icon name="ArrowLeft" size={20} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Настройки</h1>
              <p className="text-sm text-gray-600">Учётные записи врачей</p>
            </div>
          </div>
          <button onClick={startNew} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center">
            <Icon name="Plus" size={18} className="mr-1" />Добавить врача
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>}

        {editing !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editing === 'new' ? 'Новый врач' : 'Редактирование'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Имя *</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Доктор Иванов А.С." />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Специальность</span>
                <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Стоматолог-хирург" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Опыт (лет)</span>
                <input type="number" min={0} value={form.experience_years}
                  onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Ссылка на фото</span>
                <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="https://…" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Логин *</span>
                <input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })}
                  autoComplete="off"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="ivanov" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">{editing === 'new' ? 'Пароль *' : 'Новый пароль'}</span>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={editing === 'new' ? 'Мин. 4 символа' : 'Оставьте пустым, чтобы не менять'} />
              </label>
            </div>
            <label className="flex items-center space-x-2 mt-4">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <span className="text-sm text-gray-700">Активен (участвует в рейтинге)</span>
            </label>
            <div className="flex gap-3 mt-5">
              <button onClick={save} disabled={saving} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors">
                {saving ? 'Сохраняю…' : 'Сохранить'}
              </button>
              <button onClick={() => setEditing(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg transition-colors">
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Загрузка…</p>
          ) : doctors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Пока нет ни одной учётной записи. Добавьте первого врача.</p>
          ) : (
            <div className="space-y-3">
              {doctors.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {d.avatar_url ? (
                      <img src={d.avatar_url} alt={d.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-blue-500" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{d.name}</span>
                        {!d.is_active && <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">неактивен</span>}
                      </div>
                      <p className="text-xs text-gray-600">
                        {[d.specialty, d.experience_years ? `${d.experience_years} лет` : null].filter(Boolean).join(' • ')} • ⭐ {d.points} баллов
                      </p>
                      {d.login && <p className="text-xs text-gray-400">Логин: {d.login}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(d)} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                      <Icon name="Pencil" size={16} className="text-gray-600" />
                    </button>
                    <button onClick={() => remove(d.id)} className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center">
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YunaSettingsPage;