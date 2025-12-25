
import { Region } from './types';

export const AVATARS = [
  // --- Ряд 1: Закон, Порядок и Лидерство ---
  { 
    id: 0, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Judy&backgroundColor=b6e3f4&eyebrows=variant02&skinColor=8d5524',
    category: 'Служба'
  },
  { 
    id: 1, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Lola&backgroundColor=fbcfe8&hairColor=db2777&skinColor=fce7f3',
    category: 'Бизнес'
  },
  { 
    id: 2, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bogo&backgroundColor=37474f&skinColor=fce5d3',
    category: 'Служба'
  },
  { 
    id: 3, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Lionheart&backgroundColor=fff3e0&hairColor=fbc02d&skinColor=fce5d3',
    category: 'Политика'
  },
  { 
    id: 4, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bellwether&backgroundColor=e0f7fa&glasses=variant02&skinColor=fce5d3',
    category: 'Офис'
  },

  // --- Ряд 2: Творчество и Разнообразие ---
  { 
    id: 5, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gazelle&backgroundColor=fce4ec&hairColor=fdd835&skinColor=8d5524',
    category: 'Творчество'
  },
  { 
    id: 6, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Benjamin&backgroundColor=fff9c4&skinColor=fce5d3',
    category: 'Служба'
  },
  { 
    id: 7, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Yax&backgroundColor=e8f5e9&hairColor=8d6e63&skinColor=fce5d3',
    category: 'Общество'
  },
  { 
    id: 8, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Robert&backgroundColor=d7ccc8&skinColor=fce5d3',
    category: 'Офис'
  },
  { 
    id: 9, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Godfather&backgroundColor=263238&skinColor=fce5d3',
    category: 'Бизнес'
  },

  // --- Ряд 3: Обычная жизнь и Семья ---
  { 
    id: 10, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bonnie&backgroundColor=f3e5f5&skinColor=fce5d3',
    category: 'Семья'
  },
  { 
    id: 11, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Finnick&backgroundColor=ffe0b2&skinColor=fce5d3',
    category: 'Улица'
  },
  { 
    id: 12, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gideon&backgroundColor=dcedc8&skinColor=fce5d3',
    category: 'Сервис'
  },
  { 
    id: 13, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Duke&backgroundColor=cfd8dc&skinColor=fce5d3',
    category: 'Бизнес'
  },
  { 
    id: 14, 
    name: '', 
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=DrMadge&backgroundColor=e3f2fd&glasses=variant04&skinColor=fce5d3',
    category: 'Наука'
  },
];

export const REGIONS: Region[] = [
  {
    id: 'family',
    name: 'Дом Начал',
    description: 'Этап 1: Семья. Базовые ценности и доверие.',
    iconName: 'Heart',
    color: 'bg-rose-500',
    bgGradient: 'from-rose-400 to-rose-600',
    questions: [
      {
        npcName: 'Родитель',
        npcDescription: 'Человек, который был рядом с самого начала.',
        imageUrl: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Что чаще слышишь в своей семье?',
        answers: [
          {
            text: 'Главное — быть добрым и поддерживать других',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Эмоционально поддерживающая среда формирует чувство безопасности и внутреннего благополучия. Уважение со стороны окружающих растёт, но ориентация на материальный успех выражена слабо.',
          },
          {
            text: 'Главное — быть успешным и самостоятельным',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Фокус на достижениях формирует стремление к финансовой независимости и признанию, однако эмоциональная поддержка отходит на второй план.',
          },
        ],
      },
      {
        npcName: 'Соседская Тётя',
        npcDescription: 'Знает всё о правилах общежития.',
        imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Как у вас решают конфликты?',
        answers: [
          {
            text: 'Разговором и поддержкой',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Навык конструктивного общения снижает стресс и делает человека более социально привлекательным.',
          },
          {
            text: 'Жёстко, через правила и дисциплину',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 1 },
              { type: 'status', amount: 2 },
            ],
            reason: 'Строгая система формирует ответственность и авторитет, что усиливает статус и практическую устойчивость, но не способствует эмоциональному комфорту.',
          },
        ],
      },
    ],
  },
  {
    id: 'education',
    name: 'Город Знаний',
    description: 'Этап 2: Образование. Мышление и дисциплина.',
    iconName: 'Brain',
    color: 'bg-blue-500',
    bgGradient: 'from-blue-400 to-blue-600',
    questions: [
      {
        npcName: 'Учитель',
        npcDescription: 'Наставник, открывающий двери в мир.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Почему ты учишься?',
        answers: [
          {
            text: 'Чтобы стать образованным человеком',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Внутренняя мотивация даёт удовольствие от процесса и формирует уважение со стороны окружающих.',
          },
          {
            text: 'Чтобы получить хорошую профессию',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Ориентация на карьеру повышает будущее материальное благополучие и добавляет статус как «человеку с целью».',
          },
        ],
      },
      {
        npcName: 'Одноклассник-лидер',
        npcDescription: 'Всегда знает, где самые крутые перспективы.',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Как ты выбираешь профиль после 9-го класса?',
        answers: [
          {
            text: 'Что нравится',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Выбор по интересам усиливает удовлетворённость и формирует уверенность в себе.',
          },
          {
            text: 'Что перспективно',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Рациональный выбор увеличивает будущий доход и престиж.',
          },
        ],
      },
    ],
  },
  {
    id: 'economy',
    name: 'Остров Карьеры',
    description: 'Этап 3: Труд. Профессиональный путь и деньги.',
    iconName: 'Coins',
    color: 'bg-emerald-600',
    bgGradient: 'from-emerald-500 to-emerald-700',
    questions: [
      {
        npcName: 'HR-менеджер',
        npcDescription: 'Оценивает людей по их резюме.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        dialogue: 'При выборе первой работы что важнее?',
        answers: [
          {
            text: 'Опыт и развитие',
            rewards: [
              { type: 'happiness', amount: 1 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 2 },
            ],
            reason: 'Развитие приносит удовлетворение, а профессиональный рост повышает статус на рынке труда.',
          },
          {
            text: 'Стабильная зарплата',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Важно для финансовой стабильности, но не добавляет удовольствия или счастья.',
          },
        ],
      },
      {
        npcName: 'Коллега',
        npcDescription: 'С ним приходится работать каждый день.',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Конфликт на работе. Как поступишь?',
        answers: [
          {
            text: 'Беру паузу, сохраняю спокойствие',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Эмоциональная устойчивость повышает счастье и уважение коллег.',
          },
          {
            text: 'Пробиваю свою идею',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 1 },
              { type: 'status', amount: 2 },
            ],
            reason: 'Напористость даёт карьерный рост и увеличение дохода.',
          },
        ],
      },
    ],
  },
  {
    id: 'state',
    name: 'Город Порядка',
    description: 'Этап 4: Государство. Безопасность и ответственность.',
    iconName: 'Shield',
    color: 'bg-slate-600',
    bgGradient: 'from-slate-500 to-slate-700',
    questions: [
      {
        npcName: 'Сотрудник административной службы',
        npcDescription: 'Следит за порядком и правилами.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Как участвуешь в жизни общества?',
        answers: [
          {
            text: 'Волонтёрство',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Помощь людям усиливает чувство смысла и уважение.',
          },
          {
            text: 'Следую нормам (документы, налоги)',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 1 },
              { type: 'status', amount: 2 },
            ],
            reason: 'Законопослушность повышает статус и финансовую стабильность.',
          },
        ],
      },
      {
        npcName: 'Пожилой сосед',
        npcDescription: 'Видел жизнь и знает цену безопасности.',
        imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Как обеспечиваешь безопасность?',
        answers: [
          {
            text: 'Страховка, накопления',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Финансовая подушка повышает устойчивость и даёт уверенность.',
          },
          {
            text: 'Поддержка друзей',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Социальные связи — сильный фактор стабильности и счастья.',
          },
        ],
      },
    ],
  },
  {
    id: 'culture',
    name: 'Порт Возможностей',
    description: 'Этап 5: Культура. Мечты и будущее.',
    iconName: 'Anchor',
    color: 'bg-violet-600',
    bgGradient: 'from-violet-500 to-violet-700',
    questions: [
      {
        npcName: 'Путешествующий философ',
        npcDescription: 'Ищет смыслы за горизонтом.',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Каким ты видишь будущее?',
        answers: [
          {
            text: 'Семейным и спокойным',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Фокус на гармонии приносит эмоциональное благополучие.',
          },
          {
            text: 'Успешным и влиятельным',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 1 },
              { type: 'status', amount: 2 },
            ],
            reason: 'Амбиции усиливают статус и финансовые перспективы.',
          },
        ],
      },
      {
        npcName: 'Инноватор',
        npcDescription: 'Создаёт завтрашний день сегодня.',
        imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80',
        dialogue: 'Как принимаешь решения?',
        answers: [
          {
            text: 'Исходя из ценностей',
            rewards: [
              { type: 'happiness', amount: 2 },
              { type: 'income', amount: 0 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Ценностные выборы повышают устойчивое счастье.',
          },
          {
            text: 'Анализирую выгоды',
            rewards: [
              { type: 'happiness', amount: 0 },
              { type: 'income', amount: 2 },
              { type: 'status', amount: 1 },
            ],
            reason: 'Рациональность увеличивает доход и престиж.',
          },
        ],
      },
    ],
  },
];
