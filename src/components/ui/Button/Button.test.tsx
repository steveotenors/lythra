import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  test('renders button with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ui-button');
    expect(button).toHaveClass('ui-button--primary');
    expect(button).toHaveClass('ui-button--md');
  });

  test('renders button with custom variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('ui-button--secondary');
  });

  test('renders button with custom size', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('ui-button--lg');
  });

  test('applies additional className when provided', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  test('shows loading state when isLoading prop is true', () => {
    render(<Button isLoading>Loading Button</Button>);
    
    const button = screen.getByRole('button');
    const loader = button.querySelector('.ui-button__loader');
    
    expect(button).toHaveClass('ui-button--loading');
    expect(loader).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
}); 