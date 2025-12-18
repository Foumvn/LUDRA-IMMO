// components/home/FeaturedProperties.tsx
'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { featuredProperties } from '@/data/propertyData';
import PropertyCard from '@/components/common/card/PropertyCard';
import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';

const FeaturedProperties = memo(() => {
  const { t } = useTranslation();

  return (
    <section id="properties" className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('featured_section.title')}{' '}
            <span className="text-secondary">{t('featured_section.highlighted_title')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('featured_section.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
              showFavorite={true}
            />
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up">
          <Link href={URL.public.properties}>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              {t('cta.primary_button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedProperties.displayName = 'FeaturedProperties';
export default FeaturedProperties;