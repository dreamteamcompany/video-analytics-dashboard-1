import Icon from '@/components/ui/icon';

export const YunaStyles = () => (
  <style>{`
        @keyframes yuna-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes yuna-protocol-glow { from { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); } to { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } }
        @keyframes yuna-anesthesia-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes yuna-alert-pulse { 0%, 100% { background-color: #fef2f2; } 50% { background-color: #fecaca; } }
        @keyframes yuna-training-glow { from { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }
        @keyframes yuna-treatment-glow { 0%, 100% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.3); } 50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); } }
        @keyframes yuna-prediction-glow { from { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }
        @keyframes yuna-auto-fill-glow { 0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); } 50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); } }
        @keyframes yuna-stress-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes yuna-coaching-glow { from { box-shadow: 0 0 10px rgba(168, 85, 247, 0.3); } to { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6); } }
        @keyframes yuna-voice-automation { 0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } }
        @keyframes yuna-voice-level { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        @keyframes yuna-upsell-pulse { from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); } to { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); } }
        .yuna-voice-automation { animation: yuna-voice-automation 3s ease-in-out infinite; }
        .yuna-protocol-glow { animation: yuna-protocol-glow 2s ease-in-out infinite alternate; }
        .yuna-anesthesia-calc { animation: yuna-anesthesia-pulse 3s ease-in-out infinite; }
        .yuna-contraindication-alert { animation: yuna-alert-pulse 1.5s ease-in-out infinite; }
        .yuna-training-rec { animation: yuna-training-glow 2s ease-in-out infinite alternate; }
        .yuna-treatment-recommendation { animation: yuna-treatment-glow 3s ease-in-out infinite; }
        .yuna-prediction-glow { animation: yuna-prediction-glow 2s ease-in-out infinite alternate; }
        .yuna-auto-fill-glow { animation: yuna-auto-fill-glow 2s ease-in-out infinite; }
        .yuna-stress-pulse { animation: yuna-stress-pulse 1.5s ease-in-out infinite; }
        .yuna-coaching-glow { animation: yuna-coaching-glow 2s ease-in-out infinite alternate; }
        .yuna-voice-recording { animation: yuna-pulse 2s infinite; }
        .yuna-upsell-analysis { animation: yuna-upsell-pulse 2s ease-in-out infinite alternate; }
        .yuna-voice-level-indicator { animation: yuna-voice-level 1.5s ease-in-out infinite alternate; }
        .yuna-quality-metric { transition: all 0.3s ease; }
        .yuna-quality-metric:hover { transform: translateY(-2px); }
        .yuna-medical-term { background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600; }
        .yuna-copyright { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .yuna-section-divider { border-left: 3px solid; padding-left: 12px; }
        .yuna-doctor-divider { border-color: #1e40af; }
        .yuna-patient-divider { border-color: #0369a1; }
      `}</style>
);

export const YunaFooter = () => (
  <footer className="mt-8 py-6 border-t border-gray-200">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon name="Bot" size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Юна AI Ассистент</h3>
          <p className="text-sm text-gray-600">Интеллектуальная система для стоматологии</p>
        </div>
      </div>

      <div className="text-center md:text-right">
        <div className="yuna-copyright text-lg font-bold mb-1">© 2025 Роберт Лалиев</div>
        <p className="text-sm text-gray-600">Все права защищены.</p>
      </div>
    </div>
  </footer>
);

export default YunaStyles;
