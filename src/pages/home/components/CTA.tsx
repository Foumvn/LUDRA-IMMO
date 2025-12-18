// components/home/CTA.tsx
'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';

const CTA = memo(() => {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <div className="animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                        {t('cta.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Link href={URL.public.properties}>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="text-primary hover:bg-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        {t('cta.primary_button')}   
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </Link>
                    <Link href={URL.public.about}>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-white text-white shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        {t('cta.secondary_button')}
                    </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
});

CTA.displayName = 'CTA';
export default CTA;