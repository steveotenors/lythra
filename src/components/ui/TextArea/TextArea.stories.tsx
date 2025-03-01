import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  TextArea,
  TextAreaContainer,
  TextAreaLabel,
  TextAreaHelperText,
  TextAreaError
} from './TextArea';

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

// Basic TextArea
export const Basic: Story = {
  render: () => (
    <TextArea placeholder="Enter text here..." />
  ),
};

// TextArea with label
export const WithLabel: Story = {
  render: () => (
    <TextAreaContainer>
      <TextAreaLabel htmlFor="textarea-with-label">Message</TextAreaLabel>
      <TextArea 
        id="textarea-with-label"
        placeholder="Enter your message"
      />
    </TextAreaContainer>
  ),
};

// TextArea with helper text
export const WithHelperText: Story = {
  render: () => (
    <TextAreaContainer>
      <TextAreaLabel htmlFor="textarea-with-helper">Your feedback</TextAreaLabel>
      <TextArea 
        id="textarea-with-helper"
        placeholder="Enter your feedback"
      />
      <TextAreaHelperText>Your feedback will help us improve our service</TextAreaHelperText>
    </TextAreaContainer>
  ),
};

// TextArea with error message
export const WithErrorMessage: Story = {
  render: () => (
    <TextAreaContainer>
      <TextAreaLabel htmlFor="textarea-with-error">Your message</TextAreaLabel>
      <TextArea 
        id="textarea-with-error"
        placeholder="Enter your message"
        error={true}
      />
      <TextAreaError>Please enter a valid message</TextAreaError>
    </TextAreaContainer>
  ),
};

// TextArea sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextAreaContainer>
        <TextAreaLabel>Small TextArea</TextAreaLabel>
        <TextArea
          size="sm"
          placeholder="Small textarea"
          rows={2}
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Medium TextArea</TextAreaLabel>
        <TextArea
          size="md"
          placeholder="Medium textarea"
          rows={3}
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Large TextArea</TextAreaLabel>
        <TextArea
          size="lg"
          placeholder="Large textarea"
          rows={4}
        />
      </TextAreaContainer>
    </div>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextAreaContainer>
        <TextAreaLabel>Default Variant</TextAreaLabel>
        <TextArea
          variant="default"
          placeholder="Default variant"
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Outline Variant</TextAreaLabel>
        <TextArea
          variant="outline"
          placeholder="Outline variant"
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Flushed Variant</TextAreaLabel>
        <TextArea
          variant="flushed"
          placeholder="Flushed variant"
        />
      </TextAreaContainer>
    </div>
  ),
};

// With auto-resize
export const AutoResize: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextAreaContainer>
        <TextAreaLabel>Auto-resize TextArea</TextAreaLabel>
        <TextArea
          autoResize
          placeholder="Type here to see auto-resizing..."
          defaultValue="This textarea will automatically resize as you type more content. Try adding more lines to see how it expands."
        />
        <TextAreaHelperText>This textarea will auto-resize as you type</TextAreaHelperText>
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Standard TextArea</TextAreaLabel>
        <TextArea
          placeholder="Standard textarea without auto-resize"
          defaultValue="This textarea has a fixed height and will not resize as you type. It will show scrollbars when the content exceeds the height."
        />
        <TextAreaHelperText>This textarea has a fixed height with scrollbars</TextAreaHelperText>
      </TextAreaContainer>
    </div>
  ),
};

// With states
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextAreaContainer>
        <TextAreaLabel>Disabled TextArea</TextAreaLabel>
        <TextArea
          disabled
          value="This textarea is disabled"
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>ReadOnly TextArea</TextAreaLabel>
        <TextArea
          readOnly
          value="This textarea is read-only"
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>Required TextArea</TextAreaLabel>
        <TextArea
          required
          placeholder="Required field"
        />
        <TextAreaHelperText>This field is required</TextAreaHelperText>
      </TextAreaContainer>
    </div>
  ),
};

// Complete form example
export const ContactForm: Story = {
  render: () => (
    <div style={{
      maxWidth: '500px',
      padding: '1.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        marginTop: 0,
        marginBottom: '1.5rem'
      }}>Contact Us</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextAreaContainer>
          <TextAreaLabel htmlFor="name">Name</TextAreaLabel>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              width: '100%',
            }}
          />
        </TextAreaContainer>
        
        <TextAreaContainer>
          <TextAreaLabel htmlFor="email">Email</TextAreaLabel>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              width: '100%',
            }}
          />
        </TextAreaContainer>
        
        <TextAreaContainer>
          <TextAreaLabel htmlFor="message">Message</TextAreaLabel>
          <TextArea
            id="message"
            placeholder="Enter your message"
            rows={5}
          />
          <TextAreaHelperText>Please provide as much detail as possible</TextAreaHelperText>
        </TextAreaContainer>
        
        <button style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}>
          Send Message
        </button>
      </div>
    </div>
  ),
}; 