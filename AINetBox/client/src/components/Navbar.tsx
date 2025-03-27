import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTools } from "@/context/ToolsContext";

// Языковые настройки
type Language = 'en' | 'ru' | 'tj';

interface LanguageContent {
  home: string;
  about: string;
  contact: string;
  signIn: string;
  searchPlaceholder: string;
  searchRequired: {
    title: string;
    description: string;
  };
}

const translations: Record<Language, LanguageContent> = {
  en: {
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
  ru: {
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
  tj: {
    home: 'Асосӣ',
    about: 'Дар бораи мо',
    contact: 'Тамос',
    signIn: 'Воридшавӣ',
    searchPlaceholder: 'Ҷустуҷӯи абзорҳои зеҳни сунъӣ...',
    searchRequired: {
      title: 'Дархости ҷустуҷӯ лозим аст',
      description: 'Лутфан, барои ёфтани абзорҳои зеҳни сунъӣ истилоҳи ҷустуҷӯро ворид кунед.'
    }
  }
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { searchTools } = useTools();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Получить текущие переводы на основе выбранного языка
  const t = translations[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      searchTools(searchQuery);

      // If we're not on the home page, navigate there to show results
      if (location !== "/") {
        setLocation("/");
      }
    } else {
      toast({
        title: t.searchRequired.title,
        description: t.searchRequired.description,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="relative z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDuration: "4s" }}></div>
                  <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" style={{ animationDuration: "4s", animationDelay: "0.3s" }}></div>
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDuration: "4s", animationDelay: "0.6s" }}></div>
                </div>
                <span className="ml-3 text-2xl font-bold text-white">AIBox</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6">
                <Link href="/">
                  <div className={`${location === "/" ? "text-white" : "text-gray-300"} hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out cursor-pointer`}>
                    {t.home}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center mr-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('ru')} 
                className={`px-2 py-1 rounded ${language === 'ru' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLanguage('tj')} 
                className={`px-2 py-1 rounded ${language === 'tj' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                TJ
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar block w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                placeholder={t.searchPlaceholder}
              />
            </form>
          </div>

          {/* Right side menu */}
          <div className="flex items-center">
            <Button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              {t.signIn}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button 
                className="text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/70 backdrop-blur-md">
          <Link href="/">
            <div className={`${location === "/" ? "text-white" : "text-gray-300"} block px-3 py-2 rounded-md text-base font-medium cursor-pointer`}>
              {t.home}
            </div>
          </Link>

          {/* Mobile Language Selector */}
          <div className="flex px-3 py-2 space-x-2">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ru')} 
              className={`px-2 py-1 rounded ${language === 'ru' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              RU
            </button>
            <button 
              onClick={() => setLanguage('tj')} 
              className={`px-2 py-1 rounded ${language === 'tj' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              TJ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;