import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

export default {
  title: 'Components/TextArea',
  component: TextArea,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'flushed'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    rows: {
      control: { type: 'number' },
    },
    autoResize: {
      control: { type: 'boolean' },
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onKeyDown: { action: 'keyDown' },
    onKeyUp: { action: 'keyUp' },
  },
} as Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

// Default state story
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    rows: 3,
    size: 'md',
    variant: 'default',
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea
        size="sm"
        placeholder="Small textarea"
        rows={2}
      />
      <TextArea
        size="md"
        placeholder="Medium textarea"
        rows={3}
      />
      <TextArea
        size="lg"
        placeholder="Large textarea"
        rows={4}
      />
    </div>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea
        variant="default"
        placeholder="Default variant"
      />
      <TextArea
        variant="outline"
        placeholder="Outline variant"
      />
      <TextArea
        variant="flushed"
        placeholder="Flushed variant"
      />
    </div>
  ),
};

// With auto-resize
export const AutoResize: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea
        autoResize
        placeholder="Type here to see auto-resizing..."
        defaultValue="This textarea will automatically resize as you type more content. Try adding more lines to see how it expands."
      />
      <TextArea
        placeholder="Standard textarea without auto-resize"
        defaultValue="This textarea has a fixed height and will not resize as you type. It will show scrollbars when the content exceeds the height."
      />
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

// With error
export const WithError: Story = {
  args: {
    value: 'Invalid input',
    error: true,
    errorMessage: 'Please provide a valid input',
  },
};

// With helper text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your comments',
    helperText: 'Your feedback will be reviewed by our team',
  },
};

// With maximum and minimum length
export const WithConstraints: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea
        placeholder="Max 100 characters"
        maxLength={100}
        helperText="Maximum 100 characters allowed"
      />
      <TextArea
        placeholder="Min 10 characters"
        minLength={10}
        helperText="Minimum 10 characters required"
      />
    </div>
  ),
}; 