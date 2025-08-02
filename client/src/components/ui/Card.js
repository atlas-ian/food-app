import React from 'react';
import './Card.css';

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'default',
  ...props 
}) {
  const cardClasses = [
    'card',
    hover && 'card--hover',
    `card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, aspectRatio = '16/9', className = '', ...props }) {
  return (
    <div className={`card__image-container card__image-container--${aspectRatio.replace('/', '-')} ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="card__image"
        loading="lazy"
        {...props}
      />
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`card__content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as: Component = 'h3', ...props }) {
  return (
    <Component className={`card__title ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function CardMeta({ children, className = '', ...props }) {
  return (
    <div className={`card__meta ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardActions({ children, className = '', ...props }) {
  return (
    <div className={`card__actions ${className}`} {...props}>
      {children}
    </div>
  );
}