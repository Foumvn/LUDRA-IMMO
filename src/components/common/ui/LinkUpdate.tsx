import React from 'react';
import NextLink from 'next/link';
import { cn } from '@/utilis/utils';

interface LinkUpdateProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href: string;
}

export const LinkUpdate = React.forwardRef<HTMLAnchorElement, LinkUpdateProps>(
  ({ className, variant = 'primary', size = 'md', href, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-600 focus:ring-primary-500 animate-fade-in-up',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-600 focus:ring-secondary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-500'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

LinkUpdate.displayName = 'LinkUpdate';