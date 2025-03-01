import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './Card';

describe('Card', () => {
  test('renders card with default props', () => {
    render(<Card>Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('.ui-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('ui-card');
    expect(card).toHaveClass('ui-card--default');
    expect(card).toHaveClass('ui-card--md');
    expect(card).toHaveClass('ui-card--padding-md');
    expect(card).toHaveClass('ui-card--radius-md');
  });

  test('renders card with custom variant', () => {
    render(<Card variant="outlined">Card Content</Card>);
    
    const card = screen.getByText('Card Content').closest('.ui-card');
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
    
    const card = screen.getByText('Card Content').closest('.ui-card');
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

  test('spreads htmlAttributes to card element', () => {
    render(
      <Card htmlAttributes={{ 'data-testid': 'test-card', 'aria-label': 'Test Card' } as React.HTMLAttributes<HTMLDivElement>}>
        Card Content
      </Card>
    );
    
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
  });
});

describe('CardHeader', () => {
  test('renders header with default props', () => {
    render(<CardHeader>Header Content</CardHeader>);
    
    const header = screen.getByText('Header Content').closest('.ui-card-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('ui-card-header');
  });

  test('applies additional className when provided', () => {
    render(<CardHeader className="custom-header">Header Content</CardHeader>);
    
    const header = screen.getByText('Header Content').closest('.ui-card-header');
    expect(header).toHaveClass('custom-header');
  });

  test('spreads htmlAttributes to header element', () => {
    render(
      <CardHeader htmlAttributes={{ 'data-testid': 'test-header', 'aria-label': 'Test Header' } as React.HTMLAttributes<HTMLDivElement>}>
        Header Content
      </CardHeader>
    );
    
    const header = screen.getByTestId('test-header');
    expect(header).toHaveAttribute('aria-label', 'Test Header');
  });
});

describe('CardTitle', () => {
  test('renders title with default props', () => {
    render(<CardTitle>Card Title</CardTitle>);
    
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('ui-card-title');
    expect(title.tagName).toBe('H3');
  });

  test('applies additional className when provided', () => {
    render(<CardTitle className="custom-title">Card Title</CardTitle>);
    
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass('custom-title');
  });

  test('spreads htmlAttributes to title element', () => {
    render(
      <CardTitle htmlAttributes={{ 'data-testid': 'test-title', 'aria-level': 2 } as React.HTMLAttributes<HTMLHeadingElement>}>
        Card Title
      </CardTitle>
    );
    
    const title = screen.getByTestId('test-title');
    expect(title).toHaveAttribute('aria-level', '2');
  });
});

describe('CardDescription', () => {
  test('renders description with default props', () => {
    render(<CardDescription>Card Description</CardDescription>);
    
    const description = screen.getByText('Card Description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('ui-card-description');
    expect(description.tagName).toBe('P');
  });

  test('applies additional className when provided', () => {
    render(<CardDescription className="custom-description">Card Description</CardDescription>);
    
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('custom-description');
  });

  test('spreads htmlAttributes to description element', () => {
    render(
      <CardDescription htmlAttributes={{ 'data-testid': 'test-description', 'aria-hidden': true } as React.HTMLAttributes<HTMLParagraphElement>}>
        Card Description
      </CardDescription>
    );
    
    const description = screen.getByTestId('test-description');
    expect(description).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('CardContent', () => {
  test('renders content with default props', () => {
    render(<CardContent>Content Area</CardContent>);
    
    const content = screen.getByText('Content Area').closest('.ui-card-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('ui-card-content');
  });

  test('applies additional className when provided', () => {
    render(<CardContent className="custom-content">Content Area</CardContent>);
    
    const content = screen.getByText('Content Area').closest('.ui-card-content');
    expect(content).toHaveClass('custom-content');
  });

  test('spreads htmlAttributes to content element', () => {
    render(
      <CardContent htmlAttributes={{ 'data-testid': 'test-content', 'aria-label': 'Test Content' } as React.HTMLAttributes<HTMLDivElement>}>
        Content Area
      </CardContent>
    );
    
    const content = screen.getByTestId('test-content');
    expect(content).toHaveAttribute('aria-label', 'Test Content');
  });
});

describe('CardFooter', () => {
  test('renders footer with default props', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    
    const footer = screen.getByText('Footer Content').closest('.ui-card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('ui-card-footer');
  });

  test('applies additional className when provided', () => {
    render(<CardFooter className="custom-footer">Footer Content</CardFooter>);
    
    const footer = screen.getByText('Footer Content').closest('.ui-card-footer');
    expect(footer).toHaveClass('custom-footer');
  });

  test('spreads htmlAttributes to footer element', () => {
    render(
      <CardFooter htmlAttributes={{ 'data-testid': 'test-footer', 'aria-label': 'Test Footer' } as React.HTMLAttributes<HTMLDivElement>}>
        Footer Content
      </CardFooter>
    );
    
    const footer = screen.getByTestId('test-footer');
    expect(footer).toHaveAttribute('aria-label', 'Test Footer');
  });
});

describe('Card Composition', () => {
  test('renders a complete card with all subcomponents', () => {
    render(
      <Card htmlAttributes={{ 'data-testid': 'complete-card' } as React.HTMLAttributes<HTMLDivElement>}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );
    
    expect(screen.getByTestId('complete-card')).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
}); 