// Reusable Button component - Consistent button styling and behavior
'use client';

import { ButtonHTMLAttributes } from 'react';
import { getButtonStyle, getButtonMouseHandlers } from '@/utils/buttonStyles';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: 'primary' | 'danger';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const style = getButtonStyle(variant);
  const mouseHandlers = getButtonMouseHandlers(variant);

  const baseClassName = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClassName = loading ? 'opacity-75 cursor-not-allowed' : '';

  return (
    <button
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
      className={`${baseClassName} ${variantClassName} ${className}`.trim()}
      disabled={disabled || loading}
      {...(!loading && mouseHandlers)}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
