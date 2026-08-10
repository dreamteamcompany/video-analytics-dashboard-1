import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Doctor } from './api';

interface YunaHeaderProps {
  currentDoctor: Doctor | null;
  onLogout: () => void;
}

const YunaHeader = ({ currentDoctor, onLogout }: YunaHeaderProps) => (
  <div
    className="rounded-2xl shadow-2xl p-6 mb-6 text-white"
    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)' }}
  >
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon name="Brain" size={32} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Юна AI</h1>
          <p className="text-white/80">Интеллектуальная система для стоматологии премиум-класса</p>
        </div>
      </div>

      {/* Информация о вошедшем враче */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
        <div className="sm:text-right">
          <p className="font-semibold text-lg">{currentDoctor?.name || 'Врач'}</p>
          <p className="text-white/70">
            {currentDoctor
              ? [currentDoctor.specialty, currentDoctor.experience_years ? `Опыт ${currentDoctor.experience_years} лет` : null].filter(Boolean).join(' • ')
              : ''}
          </p>
          {currentDoctor && (
            <div className="flex items-center gap-2 mt-1 sm:justify-end">
              <div className="bg-yellow-400 px-2 py-1 rounded-full text-xs font-bold text-gray-800">
                ⭐ {currentDoctor.points} баллов
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Bot" size={16} className="text-green-400" />
              <span className="text-sm">Юна онлайн</span>
            </div>
          </div>
          <Link
            to="/yuna"
            className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
          >
            <Icon name="LayoutDashboard" size={16} />
            Дашборд
          </Link>
          <Link
            to="/yuna/settings"
            className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
          >
            <Icon name="Settings" size={16} />
            Настройки
          </Link>
          <button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default YunaHeader;
