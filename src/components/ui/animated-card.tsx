
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  hover = true,
  ...props
}) => {
  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 },
  };

  const hoverVariants = hover ? {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay }}
      whileHover={hoverVariants}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn("transition-shadow duration-300", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  );
};
