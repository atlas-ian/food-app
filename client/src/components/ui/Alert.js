import React from 'react';
import './Alert.css';

export default function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
  ...props
}) {
  const alertClasses = [
    'alert',
    `alert--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="alert__icon">
        {getIcon()}
      </div>
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        }
        <div className="alert__message">{children}</div>
      </div>
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}