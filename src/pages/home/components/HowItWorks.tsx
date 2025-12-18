// components/home/HowItWorks.tsx
'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Home } from 'lucide-react';

import { processSteps } from '@/data/homeData';

const HowItWorks = memo(() => {
  const { t } = useTranslation();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Search,
      Calendar,
      Home,
    };
    return icons[iconName];
  };

  const ProcessStep = ({ step, index }: { step: any; index: number }) => {
    const IconComponent = getIconComponent(step.icon);
    
    return (
      <div 
        className="text-center animate-fade-in-up group hover:transform hover:scale-105 transition-all duration-300"
        style={{ animationDelay: `${index * 0.3}s` }}
      >
        <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors shadow-lg">
          {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary transition-colors">
          {t(step.title)}
        </h3>
        <p className="text-gray-600 leading-relaxed">{t(step.description)}</p>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('process.title')}{' '}
            <span className="text-primary">{t('process.highlighted_title')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {processSteps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';
export default HowItWorks;