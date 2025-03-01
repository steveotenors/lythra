import React from 'react';
import './Button.css';

export interface ButtonProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
}) => {
  const baseClass = 'ui-button';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const loadingClass = isLoading ? `${baseClass}--loading` : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && <span className="ui-button__loader" />}
      <span className={isLoading ? 'ui-button__text--hidden' : 'ui-button__text'}>
        {children}
      </span>
    </button>
  );
};

export default Button; 