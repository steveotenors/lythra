import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { 
  TextArea, 
  TextAreaContainer, 
  TextAreaLabel, 
  TextAreaHelperText, 
  TextAreaError 
} from './TextArea';

describe('TextArea Component', () => {
  it('renders the TextArea with default props', () => {
    render(<TextArea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('ui-textarea');
    expect(textarea).toHaveClass('ui-textarea--md');
    expect(textarea).toHaveClass('ui-textarea--default');
  });

  it('renders with the correct rows attribute', () => {
    render(<TextArea rows={5} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('renders with size classes', () => {
    const { rerender } = render(<TextArea size="sm" data-testid="textarea" />);
    let textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveClass('ui-textarea--sm');
    
    rerender(<TextArea size="md" data-testid="textarea" />);
    textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('ui-textarea--md');
    
    rerender(<TextArea size="lg" data-testid="textarea" />);
    textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('ui-textarea--lg');
  });

  it('renders with variant classes', () => {
    const { rerender } = render(<TextArea variant="default" data-testid="textarea" />);
    let textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveClass('ui-textarea--default');
    
    rerender(<TextArea variant="outline" data-testid="textarea" />);
    textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('ui-textarea--outline');
    
    rerender(<TextArea variant="flushed" data-testid="textarea" />);
    textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('ui-textarea--flushed');
  });

  it('applies error class when error prop is true', () => {
    render(<TextArea error data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveClass('ui-textarea--error');
  });

  it('applies custom className', () => {
    render(<TextArea className="custom-class" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveClass('custom-class');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<TextArea onChange={handleChange} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.change(textarea, { target: { value: 'test input' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus event', () => {
    const handleFocus = vi.fn();
    render(<TextArea onFocus={handleFocus} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', () => {
    const handleBlur = vi.fn();
    render(<TextArea onBlur={handleBlur} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles onKeyDown event', () => {
    const handleKeyDown = vi.fn();
    render(<TextArea onKeyDown={handleKeyDown} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('handles onKeyUp event', () => {
    const handleKeyUp = vi.fn();
    render(<TextArea onKeyUp={handleKeyUp} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.keyUp(textarea, { key: 'Enter' });
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<TextArea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toBeDisabled();
  });

  it('is required when required prop is true', () => {
    render(<TextArea required data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('required');
  });

  it('is readonly when readOnly prop is true', () => {
    render(<TextArea readOnly data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('readonly');
  });

  it('sets value when provided', () => {
    render(<TextArea value="Test value" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveValue('Test value');
  });

  it('sets defaultValue when provided', () => {
    render(<TextArea defaultValue="Default test value" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveValue('Default test value');
  });

  it('sets placeholder when provided', () => {
    render(<TextArea placeholder="Test placeholder" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('placeholder', 'Test placeholder');
  });

  it('applies maxLength when provided', () => {
    render(<TextArea maxLength={50} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('maxlength', '50');
  });

  it('applies minLength when provided', () => {
    render(<TextArea minLength={10} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    
    expect(textarea).toHaveAttribute('minlength', '10');
  });

  it('renders TextAreaContainer correctly', () => {
    render(
      <TextAreaContainer data-testid="container">
        <TextArea />
      </TextAreaContainer>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('ui-textarea-container');
  });

  it('renders TextAreaLabel correctly', () => {
    render(
      <TextAreaContainer>
        <TextAreaLabel htmlFor="test-id" data-testid="label">Label Text</TextAreaLabel>
        <TextArea id="test-id" />
      </TextAreaContainer>
    );
    
    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('ui-textarea-label');
    expect(label).toHaveAttribute('for', 'test-id');
    expect(label).toHaveTextContent('Label Text');
  });

  it('renders TextAreaHelperText correctly', () => {
    render(
      <TextAreaContainer>
        <TextArea />
        <TextAreaHelperText data-testid="helper">Helper text</TextAreaHelperText>
      </TextAreaContainer>
    );
    
    const helperText = screen.getByTestId('helper');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('ui-textarea-helper-text');
    expect(helperText).toHaveTextContent('Helper text');
  });

  it('renders TextAreaError correctly', () => {
    render(
      <TextAreaContainer>
        <TextArea error />
        <TextAreaError data-testid="error">Error message</TextAreaError>
      </TextAreaContainer>
    );
    
    const errorMessage = screen.getByTestId('error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('ui-textarea-error');
    expect(errorMessage).toHaveTextContent('Error message');
  });

  it('composes a complete form with all subcomponents', () => {
    render(
      <TextAreaContainer data-testid="container">
        <TextAreaLabel htmlFor="complete-form" data-testid="label">Message</TextAreaLabel>
        <TextArea 
          id="complete-form" 
          data-testid="textarea"
          placeholder="Enter your message" 
          required
        />
        <TextAreaHelperText data-testid="helper">Please be specific with your message</TextAreaHelperText>
      </TextAreaContainer>
    );
    
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
    expect(screen.getByTestId('helper')).toBeInTheDocument();
    
    expect(screen.getByTestId('label')).toHaveAttribute('for', 'complete-form');
    expect(screen.getByTestId('textarea')).toHaveAttribute('id', 'complete-form');
    expect(screen.getByTestId('textarea')).toHaveAttribute('required');
  });

  it('composes a form with error state', () => {
    render(
      <TextAreaContainer data-testid="container">
        <TextAreaLabel htmlFor="error-form" data-testid="label">Message</TextAreaLabel>
        <TextArea 
          id="error-form" 
          data-testid="textarea"
          placeholder="Enter your message" 
          error
        />
        <TextAreaError data-testid="error">Message is required</TextAreaError>
      </TextAreaContainer>
    );
    
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toBeInTheDocument();
    
    expect(screen.getByTestId('textarea')).toHaveClass('ui-textarea--error');
    expect(screen.getByTestId('error')).toHaveTextContent('Message is required');
  });
}); 