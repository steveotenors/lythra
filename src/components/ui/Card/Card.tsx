import React from 'react';
import './Card.css';

// Main Card component
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
}): React.ReactElement => {
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

  const style = {
    ...(borderColor ? { borderColor } : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  const cardProps = {
    className: cardClasses,
    style: Object.keys(style).length > 0 ? style : undefined,
    ...htmlAttributes,
  };

  if (clickable) {
    return (
      <div
        {...cardProps}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed="false"
      >
        {children}
      </div>
    );
  }

  return <div {...cardProps}>{children}</div>;
};

// CardHeader component
export interface CardHeaderProps {
  /**
   * CardHeader content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLDivElement>;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const cardHeaderClasses = [
    'ui-card-header',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardHeaderClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

// CardTitle component
export interface CardTitleProps {
  /**
   * CardTitle content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLHeadingElement>;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const cardTitleClasses = [
    'ui-card-title',
    className
  ].filter(Boolean).join(' ');

  return (
    <h3 className={cardTitleClasses} {...htmlAttributes}>
      {children}
    </h3>
  );
};

// CardDescription component
export interface CardDescriptionProps {
  /**
   * CardDescription content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLParagraphElement>;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const cardDescriptionClasses = [
    'ui-card-description',
    className
  ].filter(Boolean).join(' ');

  return (
    <p className={cardDescriptionClasses} {...htmlAttributes}>
      {children}
    </p>
  );
};

// CardContent component
export interface CardContentProps {
  /**
   * CardContent content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLDivElement>;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const cardContentClasses = [
    'ui-card-content',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardContentClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

// CardFooter component
export interface CardFooterProps {
  /**
   * CardFooter content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLDivElement>;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const cardFooterClasses = [
    'ui-card-footer',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardFooterClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

export default Card; 