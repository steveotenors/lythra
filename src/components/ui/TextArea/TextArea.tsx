import React from 'react';
import './TextArea.css';

export interface TextAreaProps {
  /**
   * TextArea value
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
   * TextArea name
   */
  name?: string;
  /**
   * TextArea id
   */
  id?: string;
  /**
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  /**
   * Whether the textarea is required
   */
  required?: boolean;
  /**
   * Whether the textarea is read-only
   */
  readOnly?: boolean;
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Maximum number of characters
   */
  maxLength?: number;
  /**
   * Minimum number of characters
   */
  minLength?: number;
  /**
   * Whether to auto-resize based on content
   */
  autoResize?: boolean;
  /**
   * TextArea variant
   */
  variant?: 'default' | 'outline' | 'flushed';
  /**
   * TextArea size
   */
  size?: 'sm' | 'md' | 'lg';
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
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /**
   * onFocus handler
   */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * onBlur handler
   */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * onKeyDown handler
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  /**
   * onKeyUp handler
   */
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  defaultValue,
  placeholder,
  name,
  id,
  disabled = false,
  required = false,
  readOnly = false,
  rows = 3,
  maxLength,
  minLength,
  autoResize = false,
  variant = 'default',
  size = 'md',
  error = false,
  errorMessage,
  helperText,
  className = '',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  // Set initial height when component mounts
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [autoResize, value, defaultValue]);

  const baseClass = 'ui-textarea';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const errorClass = error ? `${baseClass}--error` : '';
  const autoResizeClass = autoResize ? `${baseClass}--auto-resize` : '';
  
  const textareaClasses = [
    baseClass,
    variantClass,
    sizeClass,
    errorClass,
    autoResizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-textarea-container">
      <textarea
        ref={textareaRef}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        className={textareaClasses}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      {errorMessage && error && (
        <div className="ui-textarea__error-message">{errorMessage}</div>
      )}
      {helperText && !error && (
        <div className="ui-textarea__helper-text">{helperText}</div>
      )}
    </div>
  );
};

export default TextArea; 