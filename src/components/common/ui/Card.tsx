// components/ui/Card.tsx
import React from 'react';
import { cn } from '@/utilis/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';