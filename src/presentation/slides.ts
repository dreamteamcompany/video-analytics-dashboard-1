export interface OrgPerson {
  role: string;
  name?: string;
  salary: string;
  vacancy?: boolean;
}

export interface OrgColumn {
  title: string;
  people: OrgPerson[];
}

export interface Slide {
  id: string;
  type: 'title' | 'bullets' | 'org';
  title?: string;
  subtitle?: string;
  author?: string;
  year?: string;
  logo?: string;
  bullets?: { icon?: string; text: string; note?: string }[];
  badge?: string;
  head?: { role: string; salary: string };
  columns?: OrgColumn[];
  payroll?: string;
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
    id: 'support',
    type: 'org',
    badge: 'Техническая поддержка',
    head: { role: 'Руководитель Службы', salary: '120 000 ₽/мес' },
    payroll: '700 000 ₽/мес',
    columns: [
      {
        title: '1-я линия',
        people: [
          { role: 'Специалист 1-й линии', name: 'Шарипов С.Ш.', salary: '70 000 ₽/мес' },
          { role: 'Специалист 1-й линии', name: 'Анфёрова В.С.', salary: '70 000 ₽/мес' },
          { role: 'Специалист 1-й линии', name: 'Савосин С.А.', salary: '70 000 ₽/мес' },
          { role: 'Специалист 1-й линии', name: 'Поиск сотрудника', salary: '70 000 ₽/мес', vacancy: true },
        ],
      },
      {
        title: '2-я линия',
        people: [
          { role: 'Специалист 2-й линии', name: 'Онищенко Д.А. (повышение ЗП)', salary: '100 000 ₽/мес' },
          { role: 'Специалист 2-й линии', name: 'Медведев Д.В. (перевод)', salary: '100 000 ₽/мес' },
        ],
      },
      {
        title: '3-я линия',
        people: [
          { role: 'Специалист 3-й линии (AI)', name: 'В будущем', salary: '100 000 ₽/мес', vacancy: true },
        ],
      },
    ],
  },
];
