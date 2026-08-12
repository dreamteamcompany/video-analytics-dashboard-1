export interface OrgPerson {
  role: string;
  name?: string;
  note?: string;
  tag?: string;
  salary: string;
  vacancy?: boolean;
  photo?: string;
  lead?: boolean;
  logo?: string;
  big?: boolean;
  replace?: boolean;
}

export interface OrgColumn {
  title: string;
  icon?: string;
  people: OrgPerson[];
  subBlocks?: { title: string; icon?: string }[];
}

export interface Goal {
  title: string;
  icon?: string;
  text: string;
  result?: string;
  effect?: string;
  metric?: string;
  metricNote?: string;
}

export interface KpiItem {
  icon?: string;
  label: string;
  value: string;
  note?: string;
  progress?: number;
}

export interface ImpactItem {
  icon?: string;
  label: string;
  value?: string;
  note?: string;
}

export interface EcoItem {
  icon?: string;
  title: string;
  note?: string;
}

export interface EcoBenefit {
  icon?: string;
  title: string;
  note?: string;
}

export interface IndicatorItem {
  icon?: string;
  title: string;
  metric: string;
  metricNote?: string;
  note?: string;
}

export interface PhaseItem {
  stage: string;
  period: string;
  title: string;
  icon?: string;
  summary: string;
  points: { icon?: string; text: string }[];
  outcome?: string;
}

export interface Slide {
  id: string;
  type: 'title' | 'bullets' | 'org' | 'goals' | 'ecosystem' | 'indicators' | 'phases';
  theme?: 'light' | 'dark';
  title?: string;
  subtitle?: string;
  author?: string;
  year?: string;
  logo?: string;
  bullets?: { icon?: string; text: string; note?: string }[];
  badge?: string;
  badgeIcon?: string;
  columnsLabel?: string;
  head?: { role: string; name?: string; salary: string; photo?: string; vacancy?: boolean };
  columns?: OrgColumn[];
  payroll?: string;
  payrollNote?: string;
  goals?: Goal[];
  goalsYear?: string;
  goalsImage?: string;
  flow?: { icon?: string; title: string; lines: string[] }[];
  impactGoal?: string;
  impacts?: ImpactItem[];
  kpiTitle?: string;
  kpis?: KpiItem[];
  conclusion?: string;
  coreTitle?: string;
  coreNote?: string;
  coreIcon?: string;
  ecoItems?: EcoItem[];
  ecoBenefits?: EcoBenefit[];
  indicators?: IndicatorItem[];
  indicatorsFooter?: string;
  phases?: PhaseItem[];
  phasesFooter?: string;
}

export const slides: Slide[] = [
  {
    id: 'title',
    type: 'title',
    title: 'IT-Департамент',
    subtitle: 'Команда мечты',
    author: 'Роберт Лалиев',
    year: '2026',
    logo: '',
  },
  {
    id: 'director',
    type: 'org',
    theme: 'light',
    badge: 'Руководство IT-департамента',
    badgeIcon: 'Crown',
    columnsLabel: 'направление',
    head: { role: 'IT-директор', name: 'Лалиев Р.З.', salary: '750 000 ₽/мес', photo: '/laliev.png' },
    payroll: '810 000 ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Финансы и административные вопросы',
        icon: 'Briefcase',
        people: [
          { role: 'Помощник IT-директора по финансам и административным вопросам', name: 'Требуется поиск', salary: '60 000 ₽/мес', vacancy: true, big: true },
        ],
      },
    ],
  },
  {
    id: 'support',
    type: 'org',
    theme: 'light',
    badge: 'Техническая поддержка',
    head: { role: 'Руководитель Службы', name: 'Лютиков А.А.', salary: '120 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/bc1d12ea-f0f1-45d9-94ae-c90ade44bb54.png' },
    payroll: '700 000 ₽/мес',
    payrollNote: 'без учёта специалиста 3-й линии (AI)',
    columns: [
      {
        title: '1-я линия',
        people: [
          { role: 'Специалист 1-й линии', name: 'Шарипов С.Ш.', salary: '70 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/3118aa5c-ea37-4883-b66f-d92ee1070ead.png' },
          { role: 'Специалист 1-й линии', name: 'Анфёрова В.С.', salary: '70 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/c9b77f81-777c-4a94-b4d0-54aed1d8a113.png' },
          { role: 'Специалист 1-й линии', name: 'Савосин С.А.', salary: '70 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/bf219d9b-6ebb-4a63-ad5a-b9f2f190cbbb.png' },
          { role: 'Специалист 1-й линии', name: 'Поиск сотрудника', salary: '70 000 ₽/мес', vacancy: true },
        ],
      },
      {
        title: '2-я линия',
        people: [
          { role: 'Специалист 2-й линии', name: 'Онищенко Д.А.', note: 'повышение ЗП', salary: '100 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/352f387e-02cb-4910-9c69-fc097b5f8bf5.png' },
          { role: 'Специалист 2-й линии', name: 'Медведев Д.В.', note: 'перевод', salary: '100 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/509960a1-7ce2-4cd5-acc6-972eff97606a.png' },
        ],
      },
      {
        title: '3-я линия',
        people: [
          { role: 'Специалист 3-й линии', tag: 'AI', name: 'В будущем', salary: '100 000 ₽/мес', vacancy: true },
        ],
      },
    ],
  },
  {
    id: 'support-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Техническая поддержка',
    badgeIcon: 'Headphones',
    title: 'Планы до конца 2026 года',
    subtitle: 'Ближайшие шаги: запускаем инструменты, на которых строятся цели следующего года.',
    goalsYear: '2026',
    goals: [
      {
        title: 'ИИ-анализ заявок и автосоздание учётных записей',
        icon: 'BrainCircuit',
        metric: 'AI',
        metricNote: 'разбор обращений без участия инженера',
        text: 'Нейросеть читает обращение, определяет тип и приоритет, сама направляет исполнителю и создаёт учётные записи новым сотрудникам без ручной работы.',
        effect: 'новый сотрудник получает доступы в день выхода, инженеры не тратят время на рутину.',
      },
      {
        title: 'Завершение проекта нового Service Desk',
        icon: 'LayoutDashboard',
        metric: '100%',
        metricNote: 'заявок в единой системе',
        text: 'Доработка и полный запуск новой системы обслуживания: единое окно для заявок, прозрачные статусы, история обращений и база знаний.',
        effect: 'все обращения в одном месте — ничего не теряется, работа службы прозрачна.',
      },
      {
        title: 'Аналитика технической поддержки',
        icon: 'ChartNoAxesCombined',
        metric: 'online',
        metricNote: 'дашборд по нагрузке и качеству',
        text: 'Строим отчётность по заявкам: нагрузка на линии, типовые проблемы, узкие места и соблюдение сроков — в наглядных дашбордах.',
        effect: 'решения принимаются по данным, а не по ощущениям.',
      },
      {
        title: 'Ускорение обслуживания',
        icon: 'Timer',
        metric: '−30% / −40%',
        metricNote: 'время ответа / время решения',
        text: 'За счёт ИИ-разбора, нового Service Desk и аналитики сокращаем среднее время ответа на 30%, а среднее время решения — на 40%.',
        effect: 'сотрудники быстрее возвращаются к работе, простои сокращаются.',
      },
    ],
    flow: [
      { icon: 'Rocket', title: 'ЗАПУСКАЕМ:', lines: ['ИИ-разбор заявок, новый Service Desk,', 'аналитика поддержки'] },
      { icon: 'Timer', title: 'ПОЛУЧАЕМ:', lines: ['Ответ быстрее на 30%,', 'решение быстрее на 40%'] },
      { icon: 'Gem', title: 'ГОТОВНОСТЬ К 2027:', lines: ['Данные и автоматизация,', 'на которых строятся цели года'] },
    ],
    impactGoal: 'Фундамент, на котором строятся цели 2027 года',
    impacts: [
      { icon: 'Bot', label: 'Рутина уходит в автоматику — инженеры заняты сложными задачами' },
      { icon: 'LayoutDashboard', label: 'Единая система обслуживания вместо разрозненных каналов' },
      { icon: 'ChartNoAxesCombined', label: 'Прозрачная картина работы службы в цифрах' },
      { icon: 'Timer', label: 'Заметно быстрее ответ и решение по заявкам' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'Timer', label: 'Время ответа', value: '−30', note: '%', progress: 70 },
      { icon: 'Clock', label: 'Время решения', value: '−40', note: '%', progress: 60 },
      { icon: 'UserPlus', label: 'Доступы новым', value: '1', note: 'день', progress: 90 },
      { icon: 'LayoutDashboard', label: 'Заявки в Service Desk', value: '100', note: '%', progress: 100 },
    ],
  },
  {
    id: 'support-goals',
    type: 'goals',
    theme: 'light',
    badge: 'Техническая поддержка',
    badgeIcon: 'Headphones',
    title: 'Цели на 2027 год',
    subtitle: 'От поддержки инцидентов — к предотвращению проблем — к созданию ценности для бизнеса.',
    goalsYear: '2027',
    goalsImage: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/files/a0899ba2-4e2c-4909-9a02-9fe76c9e0a67.jpg',
    goals: [
      {
        title: 'AIOps: предиктивное предотвращение сбоев',
        icon: 'BrainCircuit',
        metric: '70%',
        metricNote: 'сбоев устраняются до обращения пользователя',
        text: 'ML прогнозирует отказы за 2–4 часа, выявляет аномалии и сам запускает профилактику — проблема не успевает стать инцидентом.',
        effect: 'меньше простоев и финансовых потерь, выше стабильность.',
      },
      {
        title: 'IT в бизнес-метриках и деньгах',
        icon: 'ChartNoAxesCombined',
        metric: '100%',
        metricNote: 'ключевых сервисов — с измеримым бизнес-эффектом',
        text: 'Для каждого критичного сервиса — стоимость и бизнес-эффект: потерянные пациенты, задержки отчётности, простой касс — в дашбордах.',
        effect: 'IT прозрачен и управляется деньгами — партнёр бизнеса, а не статья расходов.',
      },
      {
        title: 'Автоматизация и снижение стоимости поддержки',
        icon: 'Settings',
        metric: '−25%',
        metricNote: 'стоимость заявки при 50% операций без инженера',
        text: 'Маршрутизация, согласования, выдача доступов и типовые операции уходят в автоматику и самообслуживание — поддержка растёт без пропорционального роста штата.',
        effect: 'быстрее обслуживание и экономия бюджета при росте объёма услуг.',
      },
      {
        title: 'Кадровый резерв L1 → L2 → L3',
        icon: 'GraduationCap',
        metric: '3',
        metricNote: 'взаимозаменяемых инженера',
        text: '«Школа поддержки»: рост L1 → L2 и освоение смежного стека.',
        effect: 'сильная команда, меньше зависимости от рынка.',
      },
      {
        title: 'AI-центр анализа корневых причин',
        icon: 'Microscope',
        metric: '−80%',
        metricNote: 'повторных инцидентов',
        text: 'Нейросеть находит глубинные причины и предлагает изменения архитектуры.',
        effect: 'предотвращаем повторные инциденты.',
      },
      {
        title: 'SLA с финансовой ответственностью',
        icon: 'ClipboardCheck',
        metric: '15 мин',
        metricNote: 'порог простоя + компенсация',
        text: 'SLA на каждый бизнес-процесс: запись, выписка, выплаты.',
        effect: 'надёжность, которой можно доверять.',
      },
    ],
    flow: [
      { icon: 'CircleAlert', title: 'БЫЛО:', lines: ['Пользователь → проблема →', 'заявка → инженер → решение'] },
      { icon: 'Bot', title: 'СТАНЕТ:', lines: ['Данные → AI → прогноз →', 'автоматизация → предотвращение → бизнес-эффект'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Меньше потерь. Больше скорости.', 'Больше ценности.'] },
    ],
    impactGoal: 'Поддержка — не затраты, а центр генерации прибыли',
    impacts: [
      { icon: 'ShieldCheck', label: 'Сбои не доходят до бизнеса — простои и потери предотвращены' },
      { icon: 'Bot', label: 'Автоматизация снимает рутину — растём без роста штата' },
      { icon: 'GraduationCap', label: 'Своя сильная команда вместо дорогого подряда' },
      { icon: 'ClipboardCheck', label: 'SLA с ответственностью — надёжность, за которую отвечаем' },
    ],
    kpiTitle: 'Ключевые показатели службы',
    kpis: [
      { icon: 'FileCheck', label: 'Соблюдение SLA', value: '99', note: '%', progress: 99 },
      { icon: 'Activity', label: 'Доступность систем', value: '99,9', note: '%', progress: 99.9 },
      { icon: 'CircleCheck', label: 'Решено 1-й линией', value: '70', note: '%', progress: 70 },
      { icon: 'Star', label: 'Оценка сотрудников', value: '5', note: 'из 5', progress: 100 },
      { icon: 'Timer', label: 'Реакция на аварию', value: '5', note: 'мин', progress: 92 },
      { icon: 'Clock', label: 'Первый ответ', value: '15', note: 'мин', progress: 90 },
    ],
  },
  {
    id: 'med-systems',
    type: 'org',
    theme: 'light',
    badge: 'Управление эксплуатации и развития учётно-медицинских систем',
    badgeIcon: 'Stethoscope',
    columnsLabel: 'службы',
    head: { role: 'Руководитель Управления', name: 'Лазарева Ю.В.', salary: '250 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/072ff6d7-8e84-4ae1-950b-6c41791a8337.png' },
    payroll: '**** ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Служба проектов 1С и МИС',
        icon: 'ClipboardList',
        people: [
          { role: 'Менеджер проектов 1С', lead: true, name: 'Кобычева Л.Е.', salary: '120 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/196b7099-96fa-4797-a145-2b530812cdd1.png' },
          { role: 'Администратор проектов 1С', name: 'Ватлашова А.О.', salary: '80 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/b92259da-37e7-45b4-b219-00957894d33c.png' },
        ],
      },
      {
        title: 'Служба разработки 1С',
        icon: 'Code',
        people: [
          { role: 'Сеньор-разработчик 1С / Team Lead', lead: true, name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
          { role: 'Разработчик 1С', tag: 'Middle', name: 'Важенин К.В.', salary: '150 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/0a54051d-4f4f-4e16-8fdf-5d77d84b7e76.png' },
          { role: 'Разработчик 1С', tag: 'Junior', name: 'Байбекова Л.Э.', salary: '120 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/aa7d2209-d8d0-4a13-8f9f-ebd84b512b43.png' },
          { role: 'Тестировщик 1С', name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
        ],
      },
    ],
  },
  {
    id: 'med-systems-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Учётно-медицинские системы',
    badgeIcon: 'Stethoscope',
    title: 'Планы до конца 2026 года',
    subtitle: 'Приводим учётные и медицинские системы всех городов к единому актуальному стандарту.',
    goalsYear: '2026',
    goals: [
      {
        title: 'Завершить настройку синхронизации по всем городам',
        icon: 'RefreshCw',
        metric: 'все',
        metricNote: 'города сети',
        text: 'Доводим до конца обмен данными между клиниками и центральной базой: единый справочник, корректные остатки и документы во всех городах.',
        effect: 'данные по сети совпадают, отчётность собирается без ручной сверки.',
      },
      {
        title: 'Обновить все города до 11-го релиза',
        icon: 'ArrowUpCircle',
        metric: '11',
        metricNote: 'релиз во всех городах',
        text: 'Переводим все клиники на актуальную версию системы с новым функционалом и исправлениями.',
        effect: 'все работают на одной версии — поддержка проще, ошибок меньше.',
      },
      {
        title: 'Включить телефонию во всех городах',
        icon: 'PhoneCall',
        metric: 'все',
        metricNote: 'города подключены',
        text: 'Подключаем телефонию к учётной системе во всех клиниках: звонки, записи разговоров и история обращений привязаны к пациенту.',
        effect: 'администраторы работают быстрее, обращения пациентов не теряются.',
      },
      {
        title: 'Единая таблица прав доступа',
        icon: 'KeyRound',
        metric: '1',
        metricNote: 'матрица прав на всю сеть',
        text: 'Составляем единую матрицу прав: какая должность что видит и может делать в системе — вместо разбора каждого случая вручную.',
        effect: 'поток заявок в техподдержку по доступам заметно сокращается.',
      },
      {
        title: 'План-фактный учёт материалов',
        icon: 'Package',
        metric: 'план/факт',
        metricNote: 'учёт по складу',
        text: 'Реализуем задачи по складу: план и факт расхода материалов, контроль остатков и отклонений.',
        effect: 'видно реальный расход материалов и где деньги уходят мимо плана.',
      },
      {
        title: 'Решить вопросы по клиникам Казахстана',
        icon: 'Globe',
        metric: 'КЗ',
        metricNote: 'программа и отчётность',
        text: 'Определяем, в какой программе работают клиники Казахстана, какие данные передаются в госорганы, и настраиваем работу при переходе на новую систему.',
        effect: 'клиники КЗ работают легально и по понятным правилам.',
      },
    ],
    flow: [
      { icon: 'Search', title: 'СЕЙЧАС:', lines: ['Города на разных версиях,', 'данные и доступы вразнобой'] },
      { icon: 'RefreshCw', title: 'СТАНЕТ:', lines: ['Единая версия, синхронизация,', 'телефония и матрица прав'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Достоверные данные по сети', 'и меньше ручной работы'] },
    ],
    impactGoal: 'Единый стандарт учётных систем во всех городах',
    impacts: [
      { icon: 'RefreshCw', label: 'Данные по всем городам синхронны и достоверны' },
      { icon: 'ArrowUpCircle', label: 'Все клиники на одной актуальной версии' },
      { icon: 'KeyRound', label: 'Права доступа выдаются по единым правилам' },
      { icon: 'Package', label: 'Расход материалов виден в план-факте' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'RefreshCw', label: 'Синхронизация городов', value: 'все', note: 'города', progress: 100 },
      { icon: 'ArrowUpCircle', label: 'Обновление до 11 релиза', value: '11', note: 'релиз', progress: 100 },
      { icon: 'PhoneCall', label: 'Телефония в городах', value: 'все', note: 'города', progress: 90 },
      { icon: 'KeyRound', label: 'Матрица прав доступа', value: '1', note: 'таблица', progress: 100 },
      { icon: 'Package', label: 'Учёт материалов', value: 'план', note: '/ факт', progress: 80 },
      { icon: 'Globe', label: 'Клиники Казахстана', value: 'КЗ', note: 'решение принято', progress: 70 },
    ],
  },
  {
    id: 'infosec',
    type: 'org',
    theme: 'light',
    badge: 'Служба информационной безопасности',
    badgeIcon: 'ShieldCheck',
    columnsLabel: 'направления',
    head: { role: 'Руководитель Службы', name: 'Гаврилова Е.И.', salary: '180 000 ₽/мес', photo: 'https://cdn.poehali.dev/projects/bb37ddcd-e150-4859-a38d-a9aea67934e1/bucket/851dcb31-49db-40a3-b9f6-a38c0d433684.png' },
    payroll: '450 000 ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Инженерия ИБ',
        icon: 'Server',
        people: [
          { role: 'Инженер ИБ', name: 'Требуется поиск', salary: '150 000 ₽/мес', vacancy: true },
        ],
      },
      {
        title: 'Аналитика ИБ',
        icon: 'ChartLine',
        people: [
          { role: 'Аналитик ИБ', name: 'Требуется поиск', salary: '120 000 ₽/мес', vacancy: true },
        ],
      },
    ],
  },
  {
    id: 'infosec-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Информационная безопасность',
    badgeIcon: 'ShieldCheck',
    title: 'Планы до конца 2026 года',
    subtitle: 'Закрываем периметр, защищаем рабочие места и приводим процессы к единому стандарту сети клиник.',
    goalsYear: '2026',
    goals: [
      {
        title: 'Внедрение Ideco во все клиники',
        icon: 'ShieldCheck',
        metric: 'все',
        metricNote: 'клиники, кроме КЗ',
        text: 'Единый защищённый шлюз Ideco во всех клиниках сети, кроме КЗ: контроль интернет-трафика, фильтрация угроз и безопасные каналы между площадками.',
        effect: 'сеть клиник закрыта от внешних угроз по единому стандарту.',
      },
      {
        title: 'Антивирусная защита во всех клиниках',
        icon: 'ShieldAlert',
        metric: 'все',
        metricNote: 'клиники, кроме КЗ',
        text: 'Централизованная антивирусная защита рабочих станций и серверов с единым управлением и контролем обновлений.',
        effect: 'клиника не встанет из-за одного заражённого компьютера.',
      },
      {
        title: 'Процесс безопасной разработки Битрикс и 1С',
        icon: 'Code',
        metric: 'SDLC',
        metricNote: 'проверка изменений до релиза',
        text: 'Правила разработки и доработок: контроль доступа к коду, проверка изменений на уязвимости и безопасный порядок выкладки в Битрикс и 1С.',
        effect: 'доработки сайта и учётных систем не создают новых дыр.',
      },
      {
        title: 'Пакет документации по ИБ',
        icon: 'FileCheck',
        metric: '1 → все',
        metricNote: 'эталон с тиражированием на сеть',
        text: 'Полный комплект политик и регламентов ИБ для одной клиники как эталон с последующим распространением на все клиники сети.',
        effect: 'требования закрыты документально и тиражируются на всю сеть.',
      },
      {
        title: 'Экспресс-аудит и Quick Wins',
        icon: 'Radar',
        metric: '60%',
        metricNote: 'готовность по итогам года',
        text: 'Быстрая оценка защищённости и закрытие самых очевидных рисков без крупных вложений — первоочередные меры с максимальным эффектом.',
        effect: 'основные риски снимаем быстро, не дожидаясь больших проектов.',
      },
      {
        title: 'PAM: управление привилегиями',
        icon: 'KeyRound',
        metric: 'под ключ',
        metricNote: 'внедрено полностью',
        text: 'Система контроля привилегированных доступов: кто, когда и что делал с административными правами, с записью сессий.',
        effect: 'администраторские доступы под контролем — исключаем скрытые действия с данными.',
      },
    ],
    flow: [
      { icon: 'Search', title: 'СЕЙЧАС:', lines: ['Защита разрозненная,', 'единого стандарта по сети нет'] },
      { icon: 'ShieldCheck', title: 'СТАНЕТ:', lines: ['Ideco, антивирус и PAM,', 'единые регламенты по клиникам'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Клиники работают без остановок,', 'данные пациентов защищены'] },
    ],
    impactGoal: 'Безопасность — это непрерывность работы клиник',
    impacts: [
      { icon: 'ShieldCheck', label: 'Единый защищённый контур во всех клиниках сети' },
      { icon: 'ShieldAlert', label: 'Атака шифровальщика не останавливает приём пациентов' },
      { icon: 'KeyRound', label: 'Административные доступы под полным контролем' },
      { icon: 'FileCheck', label: 'Готовый пакет документов тиражируется на всю сеть' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'ShieldCheck', label: 'Ideco в клиниках', value: 'все', note: 'кроме КЗ', progress: 100 },
      { icon: 'ShieldAlert', label: 'Антивирус в клиниках', value: 'все', note: 'кроме КЗ', progress: 100 },
      { icon: 'KeyRound', label: 'PAM внедрён', value: '100', note: '%', progress: 100 },
      { icon: 'Radar', label: 'Quick Wins', value: '60', note: '%', progress: 60 },
      { icon: 'FileCheck', label: 'Пакет документации', value: '1', note: 'клиника', progress: 80 },
      { icon: 'Code', label: 'Безопасная разработка', value: '2', note: 'системы', progress: 75 },
    ],
  },
  {
    id: 'infra',
    type: 'org',
    theme: 'light',
    badge: 'Служба эксплуатации IT-инфраструктуры',
    badgeIcon: 'Server',
    columnsLabel: 'направление',
    head: { role: 'Руководитель Службы', name: 'Требуется поиск', salary: '180 000 ₽/мес', vacancy: true },
    payroll: '980 000 ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Внешний подряд',
        icon: 'Handshake',
        people: [
          { role: 'Подрядчик «Альфа»', name: 'Аутсорс-команда', tag: 'внешний', salary: '800 000 ₽/мес', big: true, logo: '/alfa-logo.png' },
        ],
        subBlocks: [
          { title: 'Основная инфраструктура', icon: 'Server' },
          { title: 'Инфраструктура клиник', icon: 'Stethoscope' },
          { title: 'Инфраструктура бухгалтерии', icon: 'Calculator' },
          { title: 'Инфраструктура Казахстана', icon: 'Globe' },
        ],
      },
    ],
  },
  {
    id: 'infra-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Эксплуатация IT-инфраструктуры',
    badgeIcon: 'Server',
    title: 'Планы до конца 2026 года',
    subtitle: 'Приводим инфраструктуру клиник к единому управляемому стандарту.',
    goalsYear: '2026',
    goals: [
      {
        title: 'Ввод компьютеров всех клиник в Active Directory',
        icon: 'Network',
        metric: '100%',
        metricNote: 'рабочих мест в едином домене',
        text: 'Все компьютеры клиник подключаем к единому домену: централизованные учётные записи, единые политики безопасности, автоматическая настройка и удалённое управление рабочими местами.',
        effect: 'единый контроль над всеми компьютерами сети: доступы выдаются и отзываются мгновенно.',
      },
      {
        title: 'Отказоустойчивый кластер серверов Битрикс',
        icon: 'Server',
        metric: '0',
        metricNote: 'простоя при отказе сервера',
        text: 'Сайт и сервисы Битрикс переносим на кластер из нескольких серверов с автоматическим переключением: если один сервер выходит из строя, нагрузку мгновенно принимает второй.',
        effect: 'сервисы работают без остановок — сотрудники не замечают аварий.',
      },
    ],
    flow: [
      { icon: 'Search', title: 'СЕЙЧАС:', lines: ['Компьютеры настраиваются', 'вручную и по-разному'] },
      { icon: 'Network', title: 'СТАНЕТ:', lines: ['Единый домен и общие политики', 'для всех клиник'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Быстрый запуск рабочих мест,', 'меньше простоев и рисков'] },
    ],
    impactGoal: 'Управляемая инфраструктура вместо ручных настроек',
    impacts: [
      { icon: 'Network', label: 'Все компьютеры клиник под единым управлением' },
      { icon: 'KeyRound', label: 'Доступы сотрудников выдаются и отзываются централизованно' },
      { icon: 'Server', label: 'Отказ сервера не останавливает работу сотрудников' },
      { icon: 'ShieldCheck', label: 'Единые политики безопасности на каждом устройстве' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'Network', label: 'Компьютеры в домене', value: '100', note: '%', progress: 100 },
      { icon: 'Building2', label: 'Клиники подключены', value: 'все', note: 'сеть', progress: 100 },
      { icon: 'Server', label: 'Кластер Битрикс', value: '2', note: 'сервера', progress: 90 },
      { icon: 'Timer', label: 'Простой при аварии', value: '0', note: 'минут', progress: 100 },
    ],
  },
  {
    id: 'digital',
    type: 'org',
    theme: 'light',
    badge: 'Служба разработки и поддержки цифровых решений',
    badgeIcon: 'Code',
    columnsLabel: 'группы',
    head: { role: 'Руководитель Службы', name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
    payroll: '**** ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Группа веб-разработки и сервисов',
        icon: 'Globe',
        people: [
          { role: 'Администратор веб-сервисов', name: 'Старжинский К.Е.', note: 'На увольнение, требуется поиск нового сотрудника', salary: '**** ₽/мес', replace: true, photo: '/starzhinsky.png' },
          { role: 'Full-stack разработчик', name: 'Синкевич Ф.В.', note: 'испытательный срок', salary: '**** ₽/мес', photo: '/sinkevich.png' },
        ],
      },
      {
        title: 'Группа искусственного интеллекта',
        icon: 'Brain',
        people: [
          { role: 'Специалист по ИИ', name: 'Кравчук Е.А.', note: 'На увольнение, требуется поиск нового сотрудника', salary: '**** ₽/мес', replace: true, photo: '/kravchuk.png' },
          { role: 'Специалист по ИИ', name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
        ],
      },
      {
        title: 'Группа контроля качества',
        icon: 'CheckCheck',
        people: [
          { role: 'QA-тестировщик', name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
        ],
      },
      {
        title: 'Группа BI-аналитики',
        icon: 'ChartColumn',
        people: [
          { role: 'Старший BI-аналитик', lead: true, name: 'Фёдоров Е.М.', salary: '**** ₽/мес', photo: '/fedorov.png' },
          { role: 'BI-аналитик', name: 'Ерастова Н.С.', salary: '**** ₽/мес', photo: '/erastova.png' },
        ],
      },
    ],
  },
  {
    id: 'digital-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Разработка и цифровые решения',
    badgeIcon: 'Code',
    title: 'Планы до конца 2026 года',
    subtitle: 'Наводим порядок в коде сервисов, чтобы исключить сбои и простои.',
    goalsYear: '2026',
    goals: [
      {
        title: 'Аудит кода во всех сервисах компании',
        icon: 'FileSearch',
        metric: 'все',
        metricNote: 'сервисы компании',
        text: 'Проверяем код каждого сервиса: находим ошибки, устаревшие и небезопасные решения, слабые места в нагрузке — и устраняем их до того, как они приведут к сбою.',
        effect: 'меньше багов и простоев: проблемы устраняем заранее, а не после остановки работы.',
      },
      {
        title: 'Code Review и контроль качества релизов',
        icon: 'GitPullRequest',
        metric: '100%',
        metricNote: 'изменений через проверку',
        text: 'Каждое изменение проходит проверку другим разработчиком, тестирование на отдельном стенде и согласованный выпуск: единые правила написания кода, версионность, откат при проблеме.',
        effect: 'ошибки не доходят до рабочих систем, обновления выходят предсказуемо и безопасно.',
      },
    ],
    flow: [
      { icon: 'Search', title: 'СЕЙЧАС:', lines: ['Проблемы в коде всплывают', 'уже во время сбоя'] },
      { icon: 'GitPullRequest', title: 'СТАНЕТ:', lines: ['Код проверен, каждое изменение', 'проходит review и тесты'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Сервисы работают стабильно,', 'без внезапных остановок'] },
    ],
    impactGoal: 'Стабильные сервисы без внезапных сбоев',
    impacts: [
      { icon: 'FileSearch', label: 'Код всех сервисов проверен и приведён в порядок' },
      { icon: 'Bug', label: 'Ошибки находим до того, как их заметят сотрудники' },
      { icon: 'GitPullRequest', label: 'Каждое изменение проверяется до выпуска' },
      { icon: 'Activity', label: 'Меньше простоев в работе систем' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'FileSearch', label: 'Сервисы с аудитом кода', value: 'все', note: 'сервисы', progress: 100 },
      { icon: 'GitPullRequest', label: 'Изменения через review', value: '100', note: '%', progress: 100 },
      { icon: 'Bug', label: 'Критичные ошибки', value: '↓', note: 'устраняем', progress: 80 },
      { icon: 'Rocket', label: 'Релизы по регламенту', value: 'все', note: 'выпуски', progress: 90 },
    ],
  },
  {
    id: 'pmo',
    type: 'org',
    theme: 'light',
    badge: 'Служба проектного управления',
    badgeIcon: 'ClipboardList',
    columnsLabel: 'направления',
    head: { role: 'Руководитель Службы', name: 'Требуется поиск', salary: '**** ₽/мес', vacancy: true },
    payroll: '**** ₽/мес',
    payrollNote: 'с учётом открытых вакансий',
    columns: [
      {
        title: 'Администрирование проектов',
        icon: 'ClipboardList',
        people: [
          { role: 'Администратор проектов', name: 'Стовбун И.Я.', note: 'На увольнение, требуется поиск нового сотрудника', salary: '**** ₽/мес', replace: true, big: true, photo: '/stovbun.png' },
        ],
      },
      {
        title: 'Администрирование проектов',
        icon: 'ClipboardList',
        people: [
          { role: 'Администратор проектов', name: 'Юдина А.', note: 'На увольнение, требуется поиск нового сотрудника', salary: '**** ₽/мес', replace: true, big: true, photo: '/yudina.png' },
        ],
      },
    ],
  },
  {
    id: 'pmo-plan-2026',
    type: 'goals',
    theme: 'light',
    badge: 'Проектное управление',
    badgeIcon: 'ClipboardList',
    title: 'Планы до конца 2026 года',
    subtitle: 'Наводим порядок в процессах и запускаем новые ИИ-продукты.',
    goalsYear: '2026',
    goals: [
      {
        title: 'Аудит логики процессов во всех сервисах',
        icon: 'Search',
        metric: 'все',
        metricNote: 'действующие сервисы',
        text: 'Разбираем, как реально работают процессы в каждом сервисе: находим лишние шаги, дубли и узкие места, по итогам вносим корректировки в логику работы.',
        effect: 'процессы становятся понятными и быстрыми, сотрудники тратят меньше времени на рутину.',
      },
      {
        title: 'Внедрение новых ИИ-продуктов',
        icon: 'Sparkles',
        metric: '2+',
        metricNote: 'продукта в работе',
        text: 'Отбираем и запускаем минимум два ИИ-решения под реальные задачи компании — от подготовки документов и аналитики до помощи сотрудникам в ежедневной работе.',
        effect: 'часть ручной работы уходит на ИИ — быстрее результат при том же штате.',
      },
      {
        title: 'Единый стандарт ведения проектов и отчётности',
        icon: 'ClipboardCheck',
        metric: '100%',
        metricNote: 'проектов в единой системе',
        text: 'Все проекты ведём по одним правилам: паспорт проекта, этапы и сроки, ответственные и регулярный отчёт о статусе в едином формате.',
        effect: 'руководство видит реальный статус любого проекта и сроки без ручных запросов.',
      },
      {
        title: 'Оцифровка бизнес-процессов каждого отдела',
        icon: 'Network',
        metric: 'все',
        metricNote: 'отделы компании',
        text: 'Описываем и переводим в электронный вид процессы каждого отдела: кто что делает, в какие сроки и по каким правилам — вместо устных договорённостей и бумаги.',
        effect: 'работа отделов прозрачна, задачи не теряются, новых сотрудников проще вводить в дело.',
      },
    ],
    flow: [
      { icon: 'Search', title: 'СЕЙЧАС:', lines: ['Процессы сложились стихийно,', 'много ручных шагов'] },
      { icon: 'Workflow', title: 'СТАНЕТ:', lines: ['Выверенная логика процессов', 'и ИИ-помощники в работе'] },
      { icon: 'Gem', title: 'РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА:', lines: ['Меньше рутины и ошибок,', 'выше скорость решений'] },
    ],
    impactGoal: 'Отлаженные процессы и ИИ вместо ручной рутины',
    impacts: [
      { icon: 'Search', label: 'Понятно, как устроен каждый процесс в сервисах' },
      { icon: 'Workflow', label: 'Лишние шаги и дубли убраны' },
      { icon: 'Sparkles', label: 'Минимум два ИИ-продукта работают на компанию' },
      { icon: 'Network', label: 'Процессы каждого отдела описаны и оцифрованы' },
    ],
    kpiTitle: 'Что изменится к концу года',
    kpis: [
      { icon: 'Search', label: 'Аудит сервисов', value: 'все', note: 'сервисы', progress: 100 },
      { icon: 'Workflow', label: 'Корректировки процессов', value: 'по', note: 'итогам аудита', progress: 80 },
      { icon: 'Sparkles', label: 'Новые ИИ-продукты', value: '2', note: 'минимум', progress: 100 },
      { icon: 'Network', label: 'Оцифровка процессов', value: 'все', note: 'отделы', progress: 90 },
    ],
  },
  {
    id: 'ai-ecosystem',
    type: 'ecosystem',
    theme: 'light',
    badge: 'Проектное управление',
    badgeIcon: 'ClipboardList',
    title: 'Цели на 2027 год',
    subtitle: 'Выход ИИ-продуктов на рынок и самоокупаемость.',
    coreTitle: 'ИИ-ядро компании',
    coreNote: 'Единые данные и модели',
    coreIcon: 'BrainCircuit',
    ecoItems: [
      { icon: 'MessageSquare', title: 'Юна AI', note: 'Запись и ответы 24/7' },
      { icon: 'Users', title: 'AI-тренажёры (обучение)', note: 'Подбор и адаптация сотрудников' },
      { icon: 'Cctv', title: 'AI-видеонаблюдение', note: 'Выявление аномалий и угроз' },
      { icon: 'ChartColumn', title: 'ИИ-аналитика и BI', note: 'Отчёты и прогнозы по данным' },
      { icon: 'UserSearch', title: 'AI-подбор персонала', note: 'Отбор и оценка кандидатов' },
      { icon: 'Stethoscope', title: 'ИИ для медицинских систем', note: 'Помощь врачу с документами' },
      { icon: 'PhoneCall', title: 'ИИ-обработка звонков', note: 'Запись, разбор, качество сервиса' },
      { icon: 'ShoppingCart', title: 'AI-закупки', note: 'Подготовка и проверка документов' },
    ],
    ecoBenefits: [
      { icon: 'Rocket', title: 'Скорость внедрения', note: 'Быстрый запуск новых ИИ-решений' },
      { icon: 'TrendingUp', title: 'Масштабируемость', note: 'Лёгкое расширение экосистемы' },
      { icon: 'ShieldCheck', title: 'Безопасность данных', note: 'Единые стандарты защиты и контроля' },
      { icon: 'PiggyBank', title: 'Коммерческий потенциал', note: 'Готовые продукты для рынка' },
    ],
  },
  {
    id: 'success-indicators',
    type: 'indicators',
    theme: 'light',
    badge: 'Контрольные точки',
    badgeIcon: 'Gauge',
    title: 'Индикаторы правильного направления IT-департамента',
    subtitle: 'Что руководство увидит к концу 2026 года — простые признаки того, что в IT всё в порядке.',
    indicators: [
      {
        icon: 'ShieldCheck',
        title: 'Системы работают без простоев',
        metric: '99,5%',
        metricNote: 'доступность сервисов',
        note: 'Бизнес не останавливается из-за сбоев ИТ.',
      },
      {
        icon: 'Timer',
        title: 'Заявки берутся в работу быстро',
        metric: '15 мин',
        metricNote: 'среднее время реакции на заявку',
        note: 'Сотрудники не ждут помощь днями.',
      },
      {
        icon: 'LayoutDashboard',
        title: 'Все обращения — в единой системе',
        metric: '100%',
        metricNote: 'заявок в Service Desk',
        note: 'Ничего не теряется, видна вся картина.',
      },
      {
        icon: 'Sparkles',
        title: 'Запущены два небольших ИИ-продукта, приносящих пользу, и один крупный готов на 50%',
        metric: '2 + 50%',
        metricNote: 'малых продукта + крупный',
        note: 'Крупный ИИ-продукт — с возможностью вывода на рынок.',
      },
      {
        icon: 'Network',
        title: 'Процессы отделов оцифрованы',
        metric: 'все',
        metricNote: 'отделы компании',
        note: 'Работа прозрачна и не зависит от людей.',
      },
      {
        icon: 'Users',
        title: 'Команда укомплектована и стабильна',
        metric: '0',
        metricNote: 'критичных вакансий',
        note: 'Ключевые роли закрыты, знания не теряются.',
      },
      {
        icon: 'Lock',
        title: 'Инциденты безопасности под контролем',
        metric: '0',
        metricNote: 'критичных инцидентов',
        note: 'Данные компании защищены.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'ИТ-продукты прошли аудит качества и безопасности',
        metric: '60%',
        metricNote: 'всех ИТ-продуктов',
        note: 'Проверенные системы — стабильный фундамент компании.',
      },
    ],
    indicatorsFooter: 'Если эти показатели достигнуты — IT-департамент движется в правильном направлении.',
  },
  {
    id: 'development-phases',
    type: 'phases',
    theme: 'light',
    badge: 'Дорожная карта',
    badgeIcon: 'Route',
    title: 'Два этапа развития IT-департамента',
    subtitle: 'Сначала строим крепкий фундамент, и только потом растём и выводим ИИ-продукты на рынок.',
    phases: [
      {
        stage: 'Этап 1',
        period: 'к концу 2026 года',
        title: 'Фундамент: порядок и оздоровление IT',
        icon: 'Building2',
        summary: 'Чтобы активно расти, нужен крепкий фундамент. Рост на плавучем основании — это риск потерять качество и все наши сервисы.',
        points: [
          { icon: 'Workflow', text: 'Налаживание и выстраивание рабочих процессов' },
          { icon: 'UserPlus', text: 'Подбор нового персонала и замена неэффективных сотрудников' },
          { icon: 'HeartPulse', text: 'Оздоровление ИТ: аудит систем, устранение слабых мест' },
          { icon: 'LayoutDashboard', text: 'Единая система заявок и прозрачность работы' },
          { icon: 'Sparkles', text: 'Первые ИИ-продукты в работе, крупный — наполовину готов' },
        ],
        outcome: 'Прочная база, на которой можно расти без риска потерять качество сервисов.',
      },
      {
        stage: 'Этап 2',
        period: 'к концу 2027 года',
        title: 'Рост и выход ИИ-продуктов на рынок',
        icon: 'Rocket',
        summary: 'На готовом фундаменте масштабируем ИИ-экосистему и делаем её самоокупаемой.',
        points: [
          { icon: 'BrainCircuit', text: 'Единое ИИ-ядро компании и экосистема продуктов' },
          { icon: 'TrendingUp', text: 'Масштабирование решений на все направления бизнеса' },
          { icon: 'ShoppingCart', text: 'Вывод ИИ-продуктов на внешний рынок' },
          { icon: 'PiggyBank', text: 'Самоокупаемость: ИТ зарабатывает, а не только тратит' },
          { icon: 'ShieldCheck', text: 'Информационная безопасность: защита данных на уровне лучших практик' },
          { icon: 'ServerCog', text: 'Отказоустойчивость: резервирование, копии, работа без простоев' },
        ],
        outcome: 'ИТ становится источником дохода, а данные и системы — под надёжной защитой.',
      },
    ],
    phasesFooter: 'Без крепкого фундамента любой рост разрушает качество — поэтому этап 2 возможен только после честно пройденного этапа 1.',
  },
];