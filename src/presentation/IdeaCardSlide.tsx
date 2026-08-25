import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import CardArt, { CardTileArt, ShieldArt } from './CardArt';
import IdeaBackdrop from './IdeaBackdrop';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const ROW_ICONS = [
  'Activity',
  'CalendarClock',
  'Clock',
  'Puzzle',
  'FileText',
  'MessagesSquare',
  'ShieldCheck',
  'Layers',
  'Target',
];

const ICON_RULES: [RegExp, string][] = [
  [/врем|час|минут|срок|дедлайн|задержк|опоздан|длительн/i, 'Clock'],
  [/расписан|график|смен|запис(ь|и)? на|календар|слот|окн[оа]|отпуск/i, 'CalendarClock'],
  [/деньг|финанс|бюджет|стоим|цен[аы]|оплат|выручк|маржинальн|прайс|счет|счёт|экономи|затрат/i, 'Wallet'],
  [/документ|отч[её]т|протокол|заключ|акт|справк|бумаг|шаблон|инструкц|регламент/i, 'FileText'],
  [/безопас|защит|конфиденц|доступ|прав[оа]|соглас|этик|риск|наруш|контрол/i, 'ShieldCheck'],
  [/пациент|клиент|сотрудник|персонал|врач|команд|люд|кадр/i, 'Users'],
  [/звонок|чат|сообщен|переписк|обращен|жалоб|претенз|отзыв|коммуникац/i, 'MessagesSquare'],
  [/прогноз|тренд|динамик|рост|показател|метрик|статист|аналит|kpi|выручк/i, 'TrendingUp'],
  [/склад|остатк|материал|закуп|поставк|товар|расходник|запас/i, 'Package'],
  [/снимок|фото|изображен|рентген|кт |мрт|скан/i, 'Image'],
  [/зуб|диагноз|лечен|клинич|медицин|препарат|анамнез|осмотр|имплант/i, 'Stethoscope'],
  [/ошибк|отклонен|несоответств|дефицит|проблем|инцидент|аномал|сбой/i, 'TriangleAlert'],
  [/интеграц|систем|егисз|мис|api|обмен|синхрониз|сервер/i, 'Network'],
  [/настрой|процесс|автомат|сценар|правил|алгоритм|механизм/i, 'Settings2'],
  [/провер|аудит|валидац|сверк|поиск|анализ/i, 'Search'],
  [/обучен|онбординг|знан|курс|нав[ыи]к|адаптац/i, 'GraduationCap'],
  [/уведомлен|напоминан|оповещен|сигнал|алерт/i, 'Bell'],
  [/цел|план|задач|результат|эффект/i, 'Target'],
  [/верс|истор|журнал|лог|след|измен/i, 'History'],
  [/этап|шаг|последовательн|маршрут|поток/i, 'GitBranch'],
];

const iconFor = (text: string, ci: number, i: number) =>
  ICON_RULES.find(([re]) => re.test(text))?.[1] ?? ROW_ICONS[(ci * 5 + i) % ROW_ICONS.length];

const cardTitleFor = (text: string, ci: number) => {
  if (/документ|отч[её]т|протокол|заключ|запис/i.test(text)) return 'Документы и данные';
  if (/врем|расписан|график|смен|срок|дедлайн|задержк|отпуск/i.test(text)) return 'Время и нагрузка';
  if (/деньг|финанс|бюджет|стоим|оплат|выручк|экономи/i.test(text)) return 'Финансы';
  if (/интеграц|настрой|процесс|автомат|систем|сценар|этап/i.test(text)) return 'Как это работает';
  if (/сотрудник|команд|персонал|пациент|клиент|врач|люд/i.test(text)) return 'Кого это касается';
  if (/метрик|показател|статист|динамик|рост|прогноз/i.test(text)) return 'Что анализирует';
  return ci === 0 ? 'Что анализирует' : 'Что учитывает';
};

const IdeaCardSlide = ({ slide }: { slide: Slide }) => {
  const points = slide.ideaPoints ?? [];
  const flow = slide.ideaFlow ?? [];
  const groups = slide.ideaColumns ?? [];
  const half = Math.ceil(points.length / 2);
  const rawCards = groups.length
    ? groups.map((g) => ({ title: g.title, icon: g.icon, points: g.points }))
    : [
        { title: '', icon: slide.badgeIcon, points: points.slice(0, half).map((p) => p.text) },
        { title: '', icon: slide.badgeIcon, points: points.slice(half).map((p) => p.text) },
      ];

  const usedTitles = new Set<string>();
  const cards = rawCards.map((c, ci) => {
    if (c.title) return c;
    let t = cardTitleFor(c.points.join(' '), ci);
    if (usedTitles.has(t)) t = ci === 0 ? 'Что анализирует' : 'Что учитывает';
    if (usedTitles.has(t)) t = ci === 0 ? 'Основные блоки' : 'Дополнительно';
    usedTitles.add(t);
    return { ...c, title: t };
  });

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fbfaff 42%, #f5f2fd 74%, #fdf2f9 100%)' }}
    >
      {slide.id === 'ops-chair-load' ? (
        <IdeaBackdrop />
      ) : (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[22rem] h-[22rem] opacity-70"
          style={{
            backgroundImage: 'radial-gradient(rgba(139,92,246,0.30) 1.3px, transparent 1.3px)',
            backgroundSize: '15px 15px',
            maskImage: 'radial-gradient(circle at 25% 25%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 25% 25%, #000 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -top-24 -right-24 w-[30rem] h-[30rem] rounded-full"
          style={{
            background:
              'repeating-radial-gradient(circle, rgba(196,181,253,0.30) 0 1.4px, transparent 1.4px 20px)',
            maskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-[24rem] h-[24rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.10) 0%, transparent 70%)' }}
        />
      </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-16 xl:px-24 pt-3 pb-16 md:pb-5 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1460px] mx-auto flex flex-col md:flex-1 md:min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-3 md:mb-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-[12px] md:text-[14px] font-bold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 24px rgba(124,58,237,0.32)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              {slide.ideaTag && (
                <span
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] md:text-[13px] font-bold text-violet-600"
                  style={{ boxShadow: '0 6px 18px rgba(124,58,237,0.10)' }}
                >
                  {slide.ideaTag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-0.5">
              <h2 className="text-[24px] sm:text-[32px] md:text-[clamp(30px,5vh,48px)] font-black leading-tight tracking-tight text-center text-[#221a4d]">
                {slide.title}
              </h2>
            </div>

            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[clamp(14px,2.2vh,19px)] font-medium leading-snug max-w-[900px] text-center text-slate-500 px-2">
                {slide.subtitle}
              </p>
            )}
          </div>

          {flow.length > 0 && (
            <div className="flex-shrink-0 flex flex-wrap items-center justify-center gap-1.5 mb-3">
              {flow.map((f, i) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span
                    className="rounded-lg px-3 py-1.5 text-[11px] md:text-[13px] font-semibold text-violet-700"
                    style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                  >
                    {f}
                  </span>
                  {i < flow.length - 1 && (
                    <Icon name="ChevronRight" size={14} className="text-violet-300 flex-shrink-0" />
                  )}
                </span>
              ))}
            </div>
          )}

          <div className="md:flex-1 md:min-h-0 flex flex-col justify-center overflow-hidden">
          <div className="relative flex items-stretch">
            <div className="relative w-full grid gap-4 lg:gap-[92px] lg:grid-cols-2 items-stretch">
              {cards.map((card, ci) => (
                <div
                  key={ci}
                  className="relative flex flex-col rounded-[26px] md:rounded-[30px] bg-white px-4 sm:px-6 lg:px-7 pb-5 pt-5 org-drop"
                  style={{
                    boxShadow: '0 22px 60px rgba(109,40,217,0.10), 0 2px 6px rgba(109,40,217,0.05)',
                    animationDelay: `${140 + ci * 120}ms`,
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 mb-2">
                    <div
                      className="flex-shrink-0 w-[46px] h-[46px] sm:w-[54px] sm:h-[54px] rounded-[16px] flex items-center justify-center p-2.5"
                      style={{ background: 'linear-gradient(135deg,#f3f0ff,#e9e4fe)' }}
                    >
                      <CardTileArt index={ci} text={`${card.title} ${card.points.join(' ')}`} avoid={ci > 0 ? `${cards[0].title} ${cards[0].points.join(' ')}` : ''} className="w-full h-full" />
                    </div>
                    <div className="min-w-0 flex flex-col gap-1.5">
                      {card.title && (
                        <p className="text-[14px] sm:text-[16px] md:text-[clamp(15px,2.4vh,20px)] font-black leading-tight text-[#221a4d]">
                          {card.title}
                        </p>
                      )}
                      <span className="block w-12 h-[3px] rounded-full bg-violet-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 flex items-center gap-3 lg:gap-5">
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 sm:gap-[clamp(4px,1.1vh,10px)]">
                    {card.points.map((t, i) => (
                      <div
                        key={t}
                        className="flex items-center gap-3 rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-[clamp(6px,1.2vh,12px)] org-in transition-colors"
                        style={{
                          background: 'linear-gradient(135deg,#fbfaff,#f6f3fe)',
                          animationDelay: `${300 + i * 60}ms`,
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-[32px] h-[32px] sm:w-[clamp(30px,4.6vh,38px)] sm:h-[clamp(30px,4.6vh,38px)] rounded-xl flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                        >
                          <Icon
                            name={iconFor(t, ci, i)}
                            size={18}
                            className="text-violet-600"
                          />
                        </span>
                        <p className="min-w-0 text-[12px] sm:text-[13px] md:text-[clamp(13px,1.95vh,16.5px)] font-bold text-[#2b2359] leading-snug">
                          {t}
                        </p>
                      </div>
                    ))}
                  </div>
                    <div className="hidden xl:flex flex-shrink-0 w-[30%] max-w-[220px] items-center justify-center">
                      <CardArt index={ci} text={`${card.title} ${card.points.join(' ')}`} avoid={ci > 0 ? `${cards[0].title} ${cards[0].points.join(' ')}` : ''} className="w-full h-auto opacity-95" />
                    </div>
                  </div>
                </div>
              ))}

              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
                <span className="absolute w-[76px] h-[2px] bg-violet-200" />
                <span className="absolute left-[-38px] w-2.5 h-2.5 rounded-full bg-violet-300" />
                <span className="absolute right-[-38px] w-2.5 h-2.5 rounded-full bg-violet-300" />
                <span className="absolute w-[118px] h-[118px] rounded-full border border-dashed border-violet-200" />
                <span
                  className="relative w-[80px] h-[80px] rounded-full bg-white flex items-center justify-center text-[22px] font-black text-violet-600"
                  style={{ boxShadow: '0 14px 34px rgba(124,58,237,0.18)' }}
                >
                  AI
                </span>
              </div>
            </div>
          </div>

          <div className="contents">
          {slide.ideaText && (
            <div className="flex-shrink-0 mt-3 flex justify-center">
              <div
                className="flex items-center gap-3 rounded-[22px] bg-white px-4 sm:px-6 py-3 max-w-[1100px]"
                style={{ boxShadow: '0 14px 40px rgba(109,40,217,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                >
                  <Icon name="Sparkles" size={19} className="text-violet-600" />
                </span>
                <p className="min-w-0 text-[11.5px] md:text-[15px] font-semibold text-slate-600 leading-snug">
                  {slide.ideaText}
                </p>
              </div>
            </div>
          )}

          {slide.ideaNote && (
            <div className="flex-shrink-0 mt-2.5 flex justify-center">
              <div
                className="flex items-center gap-3 sm:gap-4 rounded-[22px] bg-white px-4 sm:px-6 py-3 max-w-[1100px]"
                style={{ boxShadow: '0 14px 40px rgba(109,40,217,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                >
                  <Icon name="Lightbulb" size={19} className="text-violet-600" />
                </span>
                <span className="flex-shrink-0 text-[12px] md:text-[15px] font-black text-violet-700 pr-3 sm:pr-4 border-r border-violet-100">
                  Важно
                </span>
                <p className="min-w-0 text-[11.5px] md:text-[15px] font-semibold text-slate-600 leading-snug">
                  {slide.ideaNote}
                </p>
                <ShieldArt className="hidden md:block flex-shrink-0 w-[52px] h-[52px]" />
              </div>
            </div>
          )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCardSlide;