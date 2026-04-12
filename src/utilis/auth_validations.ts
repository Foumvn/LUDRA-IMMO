// utilis/auth_validations.ts
import * as z from 'zod';

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'auth.validation.emailOrPhone_required'),
  password: z.string().min(1, 'auth.validation.password_required'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'auth.validation.name_required')
    .min(2, 'auth.validation.name_min'),
  email: z.string()
    .min(1, 'auth.validation.email_required')
    .email('auth.validation.email_invalid'),
  phone: z.string()
    .min(1, 'auth.validation.phone_required')
    .regex(/^(\+237|237)?[6|2|3]\d{8}$/, 'auth.validation.phone_invalid'),
  city: z.string()
    .min(1, 'auth.validation.city_required'),
  password: z.string()
    .min(1, 'auth.validation.password_required')
    .min(8, 'auth.validation.password_min')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'auth.validation.password_complexity'),
  confirmPassword: z.string()
    .min(1, 'auth.validation.confirmPassword_required'),
  role: z.enum(['visitor', 'user', 'landlord', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'auth.validation.passwords_match',
  path: ['confirmPassword'],
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;