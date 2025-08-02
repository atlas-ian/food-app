import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    fullWidth && 'btn--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className={loading ? 'btn__content--loading' : 'btn__content'}>
        {children}
      </span>
    </button>
  );
}

export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const buttonClasses = [
    'btn',
    'btn--icon',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}