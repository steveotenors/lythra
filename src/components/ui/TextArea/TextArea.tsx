import React from 'react';
import './TextArea.css';

// Main TextArea root component
export interface TextAreaProps {
  /**
   * TextArea content
   */
  children?: React.ReactNode;
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
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.HTMLAttributes<HTMLTextAreaElement>;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    children,
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
    className = '',
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    htmlAttributes,
    ...props
  }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergedRef(ref, textareaRef);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
      <textarea
        ref={mergedRef}
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
        {...htmlAttributes}
        {...props}
      >
        {children}
      </textarea>
    );
  }
);

TextArea.displayName = 'TextArea';

// TextArea Container component
export interface TextAreaContainerProps {
  /**
   * Container content
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

export const TextAreaContainer: React.FC<TextAreaContainerProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const containerClasses = [
    'ui-textarea-container',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

// TextArea Label component
export interface TextAreaLabelProps {
  /**
   * Label content
   */
  children: React.ReactNode;
  /**
   * For attribute to link with textarea id
   */
  htmlFor?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Optional HTML attributes
   */
  htmlAttributes?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const TextAreaLabel: React.FC<TextAreaLabelProps> = ({
  children,
  htmlFor,
  className = '',
  htmlAttributes,
}) => {
  const labelClasses = [
    'ui-textarea-label',
    className
  ].filter(Boolean).join(' ');

  return (
    <label className={labelClasses} htmlFor={htmlFor} {...htmlAttributes}>
      {children}
    </label>
  );
};

// TextArea Helper Text component
export interface TextAreaHelperTextProps {
  /**
   * Helper text content
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

export const TextAreaHelperText: React.FC<TextAreaHelperTextProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const helperTextClasses = [
    'ui-textarea__helper-text',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={helperTextClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

// TextArea Error Message component
export interface TextAreaErrorProps {
  /**
   * Error message content
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

export const TextAreaError: React.FC<TextAreaErrorProps> = ({
  children,
  className = '',
  htmlAttributes,
}) => {
  const errorClasses = [
    'ui-textarea__error-message',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={errorClasses} {...htmlAttributes}>
      {children}
    </div>
  );
};

// Helper function to merge refs
function useMergedRef<T>(...refs: React.Ref<T>[]): (element: T) => void {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  }, [refs]);
}

export default TextArea; 