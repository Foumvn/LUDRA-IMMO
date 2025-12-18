'use client';

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import HeroSection from '@/pages/home/components/HeroSection';
import FeaturedProperties from '@/pages/home/components/FeaturedProperties';
import HowItWorks from '@/pages/home/components/HowItWorks';
import CTA from '@/pages/home/components/CTA';

const HomePage = memo(() => {
  const { ready } = useTranslation();
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = (searchQuery: any) => {
    console.log('Recherche executée:', searchQuery);
    setSearchResults(searchQuery);
    
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-tertiary-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-tertiary-100">
      <HeroSection onSearch={handleSearch} />
      <main>
        <FeaturedProperties />
        <HowItWorks />
        <CTA />
      </main>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;