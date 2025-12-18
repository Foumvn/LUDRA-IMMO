'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export default function RouterBack() {
    const router = useRouter();
    const { t } = useTranslation();

    const handleCancel = () => {
        router.back();
    };

    return (
        <div>
            {/* Bouton retour */}
            <div
                onClick={handleCancel}
                className="inline-flex items-center text-primary hover:text-primary-600 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('property_details.back_to_properties')}
            </div>
        </div>
    );
}