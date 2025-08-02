import React from 'react';
import './Loader.css';

export default function Loader({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  ...props 
}) {
  const loaderClasses = [
    'loader',
    `loader--${size}`,
    `loader--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={loaderClasses} {...props}>
      <div className="loader__spinner"></div>
    </div>
  );
}

export function LoaderPage({ message = 'Loading...' }) {
  return (
    <div className="loader-page">
      <Loader size="lg" />
      <p className="loader-page__message">{message}</p>
    </div>
  );
}

export function LoaderInline({ className = '', ...props }) {
  return (
    <div className={`loader-inline ${className}`}>
      <Loader size="sm" {...props} />
    </div>
  );
}