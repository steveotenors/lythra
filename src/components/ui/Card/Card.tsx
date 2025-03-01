import React from 'react';
import './Card.css';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'outlined' | 'elevated';
  /**
   * Card size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Card padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Card radius
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Card border color
   */
  borderColor?: string;
  /**
   * Card background color
   */
  backgroundColor?: string;
  /**
   * Whether the card is hoverable
   */
  hoverable?: boolean;
  /**
   * Whether the card is clickable
   */
  clickable?: boolean;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  radius = 'md',
  borderColor,
  backgroundColor,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  htmlAttributes,
}) => {
  const baseClass = 'ui-card';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const paddingClass = padding !== 'none' ? `${baseClass}--padding-${padding}` : '';
  const radiusClass = radius !== 'none' ? `${baseClass}--radius-${radius}` : '';
  const hoverableClass = hoverable ? `${baseClass}--hoverable` : '';
  const clickableClass = clickable ? `${baseClass}--clickable` : '';

  const cardClasses = [
    baseClass,
    variantClass,
    sizeClass,
    paddingClass,
    radiusClass,
    hoverableClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    ...(borderColor ? { borderColor } : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
  };

  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      style={Object.keys(style).length > 0 ? style : undefined}
      {...htmlAttributes}
    >
      {children}
    </div>
  );
};

export default Card; 