'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={clsx(
        'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        {
          // Primary - gradient with glow
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-indigo-500':
            variant === 'primary',
          // Gradient - more vibrant
          'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 focus-visible:ring-purple-500':
            variant === 'gradient',
          // Secondary - subtle
          'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400':
            variant === 'secondary',
          // Outline - border with hover fill
          'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white focus-visible:ring-indigo-500':
            variant === 'outline',
          // Ghost - minimal
          'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400':
            variant === 'ghost',
        },
        {
          'px-4 py-2 text-sm gap-1.5': size === 'sm',
          'px-6 py-2.5 text-base gap-2': size === 'md',
          'px-8 py-3.5 text-lg gap-2.5': size === 'lg',
        },
        className
      )}
    >
      {loading && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.span>
      )}
      <span className={clsx('flex items-center gap-2', loading && 'opacity-0')}>
        {children}
      </span>
    </motion.button>
  );
}
