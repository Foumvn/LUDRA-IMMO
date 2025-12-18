// components/home/HeroSection.tsx
'use client';

import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';

import { heroImages, statistics } from '@/data/homeData';
import { filterOptions } from '@/data/propertyData';

import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';

interface HeroSectionProps {
  onSearch?: (query: any) => void;
}

const HeroSection = memo(({ onSearch }: HeroSectionProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    keyword: '',
    location: '',
    type: '',
    priceRange: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer les paramètres de recherche
    const searchParams = new URLSearchParams();
    
    if (searchQuery.keyword) {
      searchParams.append('search', searchQuery.keyword);
    }
    if (searchQuery.location) {
      searchParams.append('location', searchQuery.location);
    }
    if (searchQuery.type) {
      searchParams.append('type', searchQuery.type);
    }
    if (searchQuery.priceRange) {
      searchParams.append('priceRange', searchQuery.priceRange);
    }

    // Naviguer vers la page des propriétés avec les filtres
    const queryString = searchParams.toString();
    router.push(`/public/properties/list${queryString ? `?${queryString}` : ''}`);
    
    // Appeler le callback si fourni
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-blue-900/80 to-purple-900/80 z-10"></div>
      
      {/* Background Images Slider */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${heroImages[currentHeroImage]})`,
          transform: `scale(1.02)`
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 w-full">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              {/* Keyword Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('hero.search_placeholder')}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-transparent outline-none transition-all text-gray-900 text-lg bg-white/95"
                  value={searchQuery.keyword}
                  onChange={(e) => setSearchQuery({...searchQuery, keyword: e.target.value})}
                />
              </div>

              {/* Location Dropdown */}
              <div className="relative w-full md:w-56">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <select 
                  value={searchQuery.location}
                  onChange={(e) => setSearchQuery({...searchQuery, location: e.target.value})}
                  className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-transparent outline-none appearance-none bg-white/95 text-gray-900 text-lg cursor-pointer transition-all hover:border-gray-400"
                >
                  <option value="">{t('hero.all_locations')}</option>
                  {filterOptions.locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {t(loc.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              {/* Type Dropdown */}
              <div className="relative w-full md:w-56">
                <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <select 
                  value={searchQuery.type}
                  onChange={(e) => setSearchQuery({...searchQuery, type: e.target.value})}
                  className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-transparent outline-none appearance-none bg-white/95 text-gray-900 text-lg cursor-pointer transition-all hover:border-gray-400"
                >
                  <option value="">{t('hero.all_types')}</option>
                  {filterOptions.propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {t(type.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              <Button 
                type="submit" 
                className="py-4 px-8 text-lg whitespace-nowrap bg-secondary hover:bg-secondary-600 border-secondary shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                {t('hero.search_button')}
              </Button>
            </form>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-200 drop-shadow-lg">
                  {t(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Home className="h-6 w-6 text-white animate-pulse" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;