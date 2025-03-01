import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'flushed'],
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
} as Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

// Default state story
export const Default: Story = {
  args: {
    placeholder: 'Enter text',
    size: 'md',
    variant: 'default',
  },
};

// Different types
export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="password" placeholder="Password input" />
      <Input type="email" placeholder="Email input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Tel input" />
      <Input type="url" placeholder="URL input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input variant="default" placeholder="Default input" />
      <Input variant="outline" placeholder="Outline input" />
      <Input variant="flushed" placeholder="Flushed input" />
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

// With error
export const WithError: Story = {
  args: {
    placeholder: 'Input with error',
    error: true,
    errorMessage: 'This field is required',
  },
};

// With helper text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Input with helper text',
    helperText: 'Enter a valid email address',
  },
}; 