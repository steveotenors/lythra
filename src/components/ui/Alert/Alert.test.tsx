import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from './Alert';

describe('Alert', () => {
  test('renders default alert correctly', () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('ui-alert');
    expect(alertElement).toHaveClass('ui-alert--default');
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders destructive alert correctly', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>Error Description</AlertDescription>
      </Alert>
    );
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('ui-alert');
    expect(alertElement).toHaveClass('ui-alert--destructive');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error Description')).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    render(
      <Alert className="custom-class">
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('custom-class');
  });

  test('renders AlertTitle with custom className', () => {
    render(
      <Alert>
        <AlertTitle className="custom-title-class">Test Title</AlertTitle>
      </Alert>
    );
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('custom-title-class');
  });

  test('renders AlertDescription with custom className', () => {
    render(
      <Alert>
        <AlertDescription className="custom-desc-class">Test Description</AlertDescription>
      </Alert>
    );
    
    const descriptionElement = screen.getByText('Test Description');
    expect(descriptionElement).toHaveClass('custom-desc-class');
  });
}); 