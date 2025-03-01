import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  test('renders textarea with default props', () => {
    render(<TextArea placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '3');
    expect(textarea).toHaveClass('ui-textarea');
    expect(textarea).toHaveClass('ui-textarea--md');
    expect(textarea).toHaveClass('ui-textarea--default');
  });

  test('renders textarea with custom rows', () => {
    render(<TextArea placeholder="Enter text" rows={5} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  test('renders textarea with custom size', () => {
    render(<TextArea placeholder="Enter text" size="lg" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('ui-textarea--lg');
  });

  test('renders textarea with custom variant', () => {
    render(<TextArea placeholder="Enter text" variant="outline" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('ui-textarea--outline');
  });

  test('applies auto-resize class when autoResize is true', () => {
    render(<TextArea placeholder="Enter text" autoResize />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('ui-textarea--auto-resize');
  });

  test('applies additional className when provided', () => {
    render(<TextArea placeholder="Enter text" className="custom-class" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('custom-class');
  });

  test('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<TextArea placeholder="Enter text" onChange={handleChange} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onFocus handler when focused', () => {
    const handleFocus = vi.fn();
    render(<TextArea placeholder="Enter text" onFocus={handleFocus} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.focus(textarea);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur handler when blurred', () => {
    const handleBlur = vi.fn();
    render(<TextArea placeholder="Enter text" onBlur={handleBlur} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.blur(textarea);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('calls onKeyDown handler when key is pressed', () => {
    const handleKeyDown = vi.fn();
    render(<TextArea placeholder="Enter text" onKeyDown={handleKeyDown} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('calls onKeyUp handler when key is released', () => {
    const handleKeyUp = vi.fn();
    render(<TextArea placeholder="Enter text" onKeyUp={handleKeyUp} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.keyUp(textarea, { key: 'Enter' });
    
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  test('disables textarea when disabled prop is true', () => {
    render(<TextArea placeholder="Enter text" disabled />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeDisabled();
  });

  test('renders textarea as required when required prop is true', () => {
    render(<TextArea placeholder="Enter text" required />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('required');
  });

  test('renders textarea as readonly when readOnly prop is true', () => {
    render(<TextArea placeholder="Enter text" readOnly />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('readonly');
  });

  test('sets maxLength attribute when maxLength prop is provided', () => {
    render(<TextArea placeholder="Enter text" maxLength={100} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });

  test('sets minLength attribute when minLength prop is provided', () => {
    render(<TextArea placeholder="Enter text" minLength={10} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('minlength', '10');
  });

  test('renders error message when error and errorMessage are provided', () => {
    render(
      <TextArea
        placeholder="Enter text"
        error
        errorMessage="This field is required"
      />
    );
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('ui-textarea__error-message');
  });

  test('renders helper text when helperText is provided', () => {
    render(
      <TextArea
        placeholder="Enter text"
        helperText="Enter at least 10 characters"
      />
    );
    
    const helperText = screen.getByText('Enter at least 10 characters');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('ui-textarea__helper-text');
  });

  test('does not render helper text when error is true', () => {
    render(
      <TextArea
        placeholder="Enter text"
        error
        errorMessage="This field is required"
        helperText="Enter at least 10 characters"
      />
    );
    
    expect(screen.queryByText('Enter at least 10 characters')).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
}); 