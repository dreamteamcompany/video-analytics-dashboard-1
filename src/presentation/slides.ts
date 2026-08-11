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
}

export interface ImpactItem {
  icon?: string;
  label: string;
  value: string;
  note?: string;
}

export interface Slide {
  id: string;
  type: 'title' | 'bullets' | 'org' | 'goals';
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
  impactGoal?: string;
  impacts?: ImpactItem[];
  kpiTitle?: string;
  kpis?: KpiItem[];
  conclusion?: string;
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
    id: 'support-goals',
    type: 'goals',
    theme: 'light',
    badge: 'Техническая поддержка',
    badgeIcon: 'Headphones',
    title: 'Цели на год',
    goalsYear: '2026',
    goals: [
      {
        title: 'AIOps-платформа предиктивного анализа',
        icon: 'BrainCircuit',
        metric: '−50%',
        metricNote: 'инцидентов',
        text: 'ML прогнозирует отказы за 2–4 часа и сам запускает профилактику.',
        effect: 'Проактив вместо «пожарной команды»',
      },
      {
        title: 'Поддержка в бизнес-метриках',
        icon: 'ChartNoAxesCombined',
        metric: 'IT ↔ ₽',
        metricNote: 'связь видна руководству',
        text: 'В дашбордах — потерянные пациенты, задержки отчётности, простой касс.',
        effect: 'IT — партнёр бизнеса, а не статья расходов',
      },
      {
        title: 'Кадровый резерв L1 → L2 → L3',
        icon: 'GraduationCap',
        metric: '3',
        metricNote: 'взаимозаменяемых инженера',
        text: '«Школа поддержки»: рост L1 → L2 и освоение смежного стека.',
        effect: 'Нет риска «одного эксперта»',
      },
      {
        title: 'AI-центр анализа корневых причин',
        icon: 'Microscope',
        metric: '−80%',
        metricNote: 'повторных инцидентов',
        text: 'Нейросеть находит глубинные причины и предлагает изменения архитектуры.',
        effect: 'Экономия времени 5+ инженеров',
      },
      {
        title: 'SLA с финансовой ответственностью',
        icon: 'FileCheck',
        metric: '15 мин',
        metricNote: 'порог простоя → компенсация',
        text: 'SLO на каждый бизнес-процесс: запись, выписка, выплаты.',
        effect: 'Прямая подотчётность IT перед бизнесом',
      },
    ],
    impactGoal: 'Поддержка — не затраты, а центр генерации прибыли',
    impacts: [
      { icon: 'ShieldCheck', label: 'Простои предотвращены', value: '300+ млн ₽' },
      { icon: 'Bot', label: 'Автоматизация расходов', value: '40+ млн ₽' },
      { icon: 'Sparkles', label: 'AI-агенты подразделениям', value: '30+ млн ₽' },
      { icon: 'ChartLine', label: 'Рост платных услуг', value: '+5%' },
    ],
    kpiTitle: 'Целевые показатели службы',
    kpis: [
      { icon: 'Timer', label: 'Реакция на критичный инцидент', value: '≤ 5 мин' },
      { icon: 'Wrench', label: 'Решение критичного инцидента', value: '≤ 1 часа' },
      { icon: 'Clock', label: 'Среднее время решения заявки', value: '≤ 4 часов' },
      { icon: 'FileCheck', label: 'Соблюдение SLA', value: '≥ 98%' },
      { icon: 'CircleCheck', label: 'Решено на первой линии', value: '≥ 70%' },
      { icon: 'Star', label: 'Оценка внутренних клиентов', value: '≥ 4.7 / 5' },
      { icon: 'Activity', label: 'Доступность ключевых систем', value: '99,9%' },
      { icon: 'RefreshCw', label: 'Повторные обращения', value: '≤ 5%' },
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
];