// Определение типа языка
export type Language = 'en' | 'ru' | 'tj';

// Интерфейс для переводов
export interface Translations {
  // Навигация
  nav: {
    home: string;
    about: string;
    contact: string;
    signIn: string;
    searchPlaceholder: string;
    searchRequired: {
      title: string;
      description: string;
    };
  };
  
  // Главная страница
  hero: {
    title: string;
    subtitle: string;
    categoryLabel: string;
  };
  
  // Каталог
  catalog: {
    featuredTitle: string;
    popularTitle: string;
    allToolsTitle: string;
    searchResultsTitle: string;
    sortBy: string;
    popularity: string;
    newest: string;
    rating: string;
    noToolsFound: string;
    noResultsFound: string;
    tryIt: string;
    openTool: string;
    updated: string;
  };
  
  // Карточки инструментов
  toolCard: {
    explore: string;
    openTool: string;
    features: string;
    useCases: string;
    pricing: string;
    freeTier: string;
    premium: string;
    save: string;
    website: string;
    category: string;
    lastUpdated: string;
    tags: string;
  };
  
  // Подвал
  footer: {
    tagline: string;
    resources: string;
    documentation: string;
    apiAccess: string;
    tutorials: string;
    blog: string;
    company: string;
    aboutUs: string;
    careers: string;
    contact: string;
    mediaKit: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
    gdprCompliance: string;
    copyright: string;
    suggestTool: string;
  };
}

// Словарь переводов
const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      signIn: 'Sign In',
      searchPlaceholder: 'Search AI tools...',
      searchRequired: {
        title: 'Search query required',
        description: 'Please enter a search term to find AI tools.'
      }
    },
    hero: {
      title: 'Discover AI Tools For Every Need',
      subtitle: 'Explore our extensive catalog of AI neural networks categorized by functionality. Find the perfect tool for your next project.',
      categoryLabel: 'All'
    },
    catalog: {
      featuredTitle: 'Featured AI Tools',
      popularTitle: 'Popular AI Tools',
      allToolsTitle: 'All AI Tools',
      searchResultsTitle: 'Search Results for',
      sortBy: 'Sort by:',
      popularity: 'Popularity',
      newest: 'Newest',
      rating: 'Rating',
      noToolsFound: 'No tools found',
      noResultsFound: 'No results found for. Try a different search term.',
      tryIt: 'Try it',
      openTool: 'Open Tool',
      updated: 'Updated'
    },
    toolCard: {
      explore: 'Explore',
      openTool: 'Open Tool',
      features: 'Features',
      useCases: 'Use Cases',
      pricing: 'Pricing:',
      freeTier: 'Free tier available',
      premium: 'Premium from $19/mo',
      save: 'Save',
      website: 'Website',
      category: 'Category:',
      lastUpdated: 'Last Updated:',
      tags: 'Tags'
    },
    footer: {
      tagline: 'Your comprehensive AI tool catalog, curated for every need.',
      resources: 'Resources',
      documentation: 'Documentation',
      apiAccess: 'API Access',
      tutorials: 'Tutorials',
      blog: 'Blog',
      company: 'Company',
      aboutUs: 'About Us',
      careers: 'Careers',
      contact: 'Contact',
      mediaKit: 'Media Kit',
      legal: 'Legal',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      gdprCompliance: 'GDPR Compliance',
      copyright: 'All rights reserved.',
      suggestTool: 'Suggest a new AI tool'
    }
  },
  
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      contact: 'Контакты',
      signIn: 'Войти',
      searchPlaceholder: 'Поиск ИИ инструментов...',
      searchRequired: {
        title: 'Требуется поисковый запрос',
        description: 'Пожалуйста, введите поисковый запрос для поиска инструментов ИИ.'
      }
    },
    hero: {
      title: 'Найдите ИИ-инструменты для любых задач',
      subtitle: 'Исследуйте наш обширный каталог нейронных сетей, распределенных по категориям. Найдите идеальный инструмент для вашего следующего проекта.',
      categoryLabel: 'Все'
    },
    catalog: {
      featuredTitle: 'Рекомендуемые ИИ-инструменты',
      popularTitle: 'Популярные ИИ-инструменты',
      allToolsTitle: 'Все ИИ-инструменты',
      searchResultsTitle: 'Результаты поиска для',
      sortBy: 'Сортировать по:',
      popularity: 'Популярности',
      newest: 'Новизне',
      rating: 'Рейтингу',
      noToolsFound: 'Инструменты не найдены',
      noResultsFound: 'Результаты не найдены для. Попробуйте другой поисковый запрос.',
      tryIt: 'Попробовать',
      openTool: 'Открыть инструмент',
      updated: 'Обновлено'
    },
    toolCard: {
      explore: 'Подробнее',
      openTool: 'Открыть инструмент',
      features: 'Возможности',
      useCases: 'Варианты использования',
      pricing: 'Стоимость:',
      freeTier: 'Бесплатный тариф доступен',
      premium: 'Премиум от $19/месяц',
      save: 'Сохранить',
      website: 'Веб-сайт',
      category: 'Категория:',
      lastUpdated: 'Последнее обновление:',
      tags: 'Теги'
    },
    footer: {
      tagline: 'Ваш полный каталог инструментов ИИ, подобранный для любых потребностей.',
      resources: 'Ресурсы',
      documentation: 'Документация',
      apiAccess: 'API доступ',
      tutorials: 'Руководства',
      blog: 'Блог',
      company: 'Компания',
      aboutUs: 'О нас',
      careers: 'Карьера',
      contact: 'Контакты',
      mediaKit: 'Медиа-кит',
      legal: 'Правовая информация',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Условия использования',
      cookiePolicy: 'Политика Cookie',
      gdprCompliance: 'Соответствие GDPR',
      copyright: 'Все права защищены.',
      suggestTool: 'Предложить новый ИИ-инструмент'
    }
  },
  
  tj: {
    nav: {
      home: 'Асосӣ',
      about: 'Дар бораи мо',
      contact: 'Тамос',
      signIn: 'Воридшавӣ',
      searchPlaceholder: 'Ҷустуҷӯи абзорҳои зеҳни сунъӣ...',
      searchRequired: {
        title: 'Дархости ҷустуҷӯ лозим аст',
        description: 'Лутфан, барои ёфтани абзорҳои зеҳни сунъӣ истилоҳи ҷустуҷӯро ворид кунед.'
      }
    },
    hero: {
      title: 'Абзорҳои зеҳни сунъиро барои ҳар эҳтиёҷ кашф кунед',
      subtitle: 'Феҳристи васеи шабакаҳои асабии сунъии моро, ки аз рӯи функсияҳо гурӯҳбандӣ шудаанд, омӯзед. Абзори комилро барои лоиҳаи навбатии худ пайдо кунед.',
      categoryLabel: 'Ҳама'
    },
    catalog: {
      featuredTitle: 'Абзорҳои зеҳни сунъии барҷаста',
      popularTitle: 'Абзорҳои зеҳни сунъии машҳур',
      allToolsTitle: 'Ҳамаи абзорҳои зеҳни сунъӣ',
      searchResultsTitle: 'Натиҷаҳои ҷустуҷӯ барои',
      sortBy: 'Тартиб додан аз рӯи:',
      popularity: 'Машҳурӣ',
      newest: 'Навтарин',
      rating: 'Рейтинг',
      noToolsFound: 'Ягон абзор ёфт нашуд',
      noResultsFound: 'Барои ягон натиҷа ёфт нашуд. Истилоҳи дигари ҷустуҷӯро истифода баред.',
      tryIt: 'Санҷидан',
      openTool: 'Кушодани абзор',
      updated: 'Навсозӣ шуд'
    },
    toolCard: {
      explore: 'Омӯхтан',
      openTool: 'Кушодани абзор',
      features: 'Имконотҳо',
      useCases: 'Ҳолатҳои истифода',
      pricing: 'Нархгузорӣ:',
      freeTier: 'Сатҳи ройгон дастрас аст',
      premium: 'Премиум аз $19/моҳ',
      save: 'Сабт кардан',
      website: 'Вебсайт',
      category: 'Категория:',
      lastUpdated: 'Навсозии охирин:',
      tags: 'Тегҳо'
    },
    footer: {
      tagline: 'Феҳристи ҳамаҷонибаи абзорҳои зеҳни сунъии шумо, барои ҳар гуна эҳтиёҷ.',
      resources: 'Захираҳо',
      documentation: 'Хуҷҷатҳо',
      apiAccess: 'Дастрасии API',
      tutorials: 'Дарсҳо',
      blog: 'Блог',
      company: 'Ширкат',
      aboutUs: 'Дар бораи мо',
      careers: 'Мансабҳо',
      contact: 'Тамос',
      mediaKit: 'Дастаи медиа',
      legal: 'Ҳуқуқӣ',
      privacyPolicy: 'Сиёсати махфият',
      termsOfService: 'Шартҳои хизматрасонӣ',
      cookiePolicy: 'Сиёсати Cookie',
      gdprCompliance: 'Мутобиқат ба GDPR',
      copyright: 'Ҳамаи ҳуқуқҳо ҳифз шудаанд.',
      suggestTool: 'Пешниҳоди абзори нави зеҳни сунъӣ'
    }
  }
};

export default translations;