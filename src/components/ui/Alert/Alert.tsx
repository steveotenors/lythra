import React from 'react';
import { cn } from '@/lib/utils';
import './Alert.css';

export interface AlertProps {
  /**
   * Alert variant
   */
  variant?: 'default' | 'destructive';
  /**
   * Alert contents
   */
  children: React.ReactNode;
  /**
   * Optional additional className
   */
  className?: string;
}

/**
 * Alert component for displaying important messages to the user
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'ui-alert',
        `ui-alert--${variant}`,
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
};

/**
 * Alert title component
 */
export interface AlertTitleProps {
  /**
   * Alert title contents
   */
  children: React.ReactNode;
  /**
   * Optional additional className
   */
  className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className,
}) => {
  return (
    <h5 className={cn('ui-alert__title', className)}>
      {children}
    </h5>
  );
};

/**
 * Alert description component
 */
export interface AlertDescriptionProps {
  /**
   * Alert description contents
   */
  children: React.ReactNode;
  /**
   * Optional additional className
   */
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('ui-alert__description', className)}>
      {children}
    </div>
  );
};

export default Alert; 