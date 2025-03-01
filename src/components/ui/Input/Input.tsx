import React from 'react';
import './Input.css';

export interface InputProps {
  /**
   * Input type
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  /**
   * Input value
   */
  value?: string;
  /**
   * Default value
   */
  defaultValue?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Input name
   */
  name?: string;
  /**
   * Input id
   */
  id?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Input variant
   */
  variant?: 'default' | 'outline' | 'flushed';
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * onChange handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /**
   * onFocus handler
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * onBlur handler
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  placeholder,
  name,
  id,
  disabled = false,
  required = false,
  readOnly = false,
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  helperText,
  className = '',
  onChange,
  onFocus,
  onBlur,
}) => {
  const baseClass = 'ui-input';
  const sizeClass = `${baseClass}--${size}`;
  const variantClass = `${baseClass}--${variant}`;
  const errorClass = error ? `${baseClass}--error` : '';
  
  const inputClasses = [
    baseClass,
    sizeClass,
    variantClass,
    errorClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-input-container">
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        className={inputClasses}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {errorMessage && error && (
        <div className="ui-input__error-message">{errorMessage}</div>
      )}
      {helperText && !error && (
        <div className="ui-input__helper-text">{helperText}</div>
      )}
    </div>
  );
};

export default Input; 