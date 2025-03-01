import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input', () => {
  test('renders input with default props', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass('ui-input');
    expect(input).toHaveClass('ui-input--md');
    expect(input).toHaveClass('ui-input--default');
  });

  test('renders input with custom type', () => {
    render(<Input type="password" placeholder="Enter password" />);
    
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('renders input with custom size', () => {
    render(<Input size="lg" placeholder="Large input" />);
    
    const input = screen.getByPlaceholderText('Large input');
    expect(input).toHaveClass('ui-input--lg');
  });

  test('renders input with custom variant', () => {
    render(<Input variant="outline" placeholder="Outline input" />);
    
    const input = screen.getByPlaceholderText('Outline input');
    expect(input).toHaveClass('ui-input--outline');
  });

  test('applies additional className when provided', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    
    const input = screen.getByPlaceholderText('Custom input');
    expect(input).toHaveClass('custom-class');
  });

  test('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);
    
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onFocus handler when focused', () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} placeholder="Test input" />);
    
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur handler when blurred', () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} placeholder="Test input" />);
    
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('disables input when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  test('renders input as required when required prop is true', () => {
    render(<Input required placeholder="Required input" />);
    
    const input = screen.getByPlaceholderText('Required input');
    expect(input).toHaveAttribute('required');
  });

  test('renders input as readonly when readOnly prop is true', () => {
    render(<Input readOnly placeholder="ReadOnly input" />);
    
    const input = screen.getByPlaceholderText('ReadOnly input');
    expect(input).toHaveAttribute('readonly');
  });

  test('renders error message when error and errorMessage are provided', () => {
    render(
      <Input
        error
        errorMessage="This field is required"
        placeholder="Error input"
      />
    );
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('ui-input__error-message');
  });

  test('renders helper text when helperText is provided', () => {
    render(
      <Input
        helperText="Enter a valid email"
        placeholder="Helper input"
      />
    );
    
    const helperText = screen.getByText('Enter a valid email');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('ui-input__helper-text');
  });

  test('does not render helper text when error is true', () => {
    render(
      <Input
        error
        errorMessage="This field is required"
        helperText="Enter a valid email"
        placeholder="Input with error"
      />
    );
    
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
}); 