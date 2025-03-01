import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Card } from './Card';

describe('Card', () => {
  test('renders card with default props', () => {
    render(<Card>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('ui-card');
    expect(card).toHaveClass('ui-card--default');
    expect(card).toHaveClass('ui-card--md');
    expect(card).toHaveClass('ui-card--padding-md');
    expect(card).toHaveClass('ui-card--radius-md');
  });

  test('renders card with custom variant', () => {
    render(<Card variant="outlined">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--outlined');
  });

  test('renders card with custom size', () => {
    render(<Card size="lg">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--lg');
  });

  test('renders card with custom padding', () => {
    render(<Card padding="lg">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--padding-lg');
  });

  test('renders card with no padding', () => {
    render(<Card padding="none">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).not.toHaveClass('ui-card--padding-none');
  });

  test('renders card with custom radius', () => {
    render(<Card radius="lg">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--radius-lg');
  });

  test('renders card with no radius', () => {
    render(<Card radius="none">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).not.toHaveClass('ui-card--radius-none');
  });

  test('applies additional className when provided', () => {
    render(<Card className="custom-class">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  test('applies hoverable class when hoverable is true', () => {
    render(<Card hoverable>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--hoverable');
  });

  test('applies clickable class when clickable is true', () => {
    render(<Card clickable>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('ui-card--clickable');
  });

  test('calls onClick handler when clicked and clickable is true', () => {
    const handleClick = vi.fn();
    render(<Card clickable onClick={handleClick}>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    fireEvent.click(card!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick handler when clicked but clickable is false', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    fireEvent.click(card!);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies custom border color', () => {
    render(<Card borderColor="#ff0000">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveStyle('border-color: #ff0000');
  });

  test('applies custom background color', () => {
    render(<Card backgroundColor="#f0f0f0">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveStyle('background-color: #f0f0f0');
  });

  test('applies html attributes', () => {
    render(
      <Card htmlAttributes={{ role: 'article' }}>
        Card Content
      </Card>
    );
    
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card Content');
  });
}); 