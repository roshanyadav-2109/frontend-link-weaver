
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'scale' | 'glow';
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverEffect = 'lift',
  delay = 0
}) => {
  const hoverClasses = {
    lift: 'hover:shadow-premium-hover hover:-translate-y-2',
    scale: 'hover:scale-105',
    glow: 'hover:shadow-2xl hover:shadow-brand-blue/20'
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-300 ease-out animate-fade-in',
        hoverClasses[hoverEffect],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
};
