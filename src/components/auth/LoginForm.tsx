// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import URL from '@/utilis/url/url_front';
import Link from 'next/link'; 

interface LoginFormProps {
  onSuccess: (credentials: { emailOrPhone: string; password: string }) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSuccess(formData);
    } catch (err: any) {
      setError(err.message || t('auth.validation.signin_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('auth.login.title')}
        </h1>
        <p className="text-gray-600">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.login.emailOrPhone')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              required
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t('auth.placeholder.emailOrPhone')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.login.password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t('auth.placeholder.password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('auth.login.submit') : t('auth.login.submit')}
        </Button>

        {/* Links */}
          <div className="text-center text-sm text-gray-600">
            {t('auth.login.noAccount')}{' '}
            <Link href={URL.auth.register} className="text-primary font-semibold hover:underline">
              {t('auth.login.signup')}
            </Link>
          </div>
          {/* Mot de passe oublié */}
          <div className="text-center">
            <Link href={URL.auth.forgotPassword} className="text-primary text-sm font-medium hover:underline">
              {t('auth.login.forgotPassword')}
            </Link>
          </div>
      </form>

      {/* Comptes de test */}
      
      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('auth.login.test_accounts')}
        </h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div><strong>Admin:</strong> papa.dollar@email.com / Password123</div>
          <div><strong>Landlord:</strong> dollar.test@email.com / Password123</div>
          <div><strong>User:</strong> fatou.diop@email.com / Password123</div>
        </div>
      </div> */}
    </Card>
  );
}