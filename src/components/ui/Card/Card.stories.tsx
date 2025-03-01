import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    hoverable: {
      control: { type: 'boolean' },
    },
    clickable: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

// Default state story
export const Default: Story = {
  args: {
    children: <div>Basic Card Content</div>,
    variant: 'default',
    size: 'md',
    padding: 'md',
    radius: 'md',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="default" padding="md">
        <h3>Default Card</h3>
        <p>This is a default card with no border or shadow.</p>
      </Card>
      <Card variant="outlined" padding="md">
        <h3>Outlined Card</h3>
        <p>This card has a border but no shadow.</p>
      </Card>
      <Card variant="elevated" padding="md">
        <h3>Elevated Card</h3>
        <p>This card has a shadow but no border.</p>
      </Card>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card size="sm" variant="outlined" padding="md">
        <h3>Small Card</h3>
        <p>This is a small card (300px max-width).</p>
      </Card>
      <Card size="md" variant="outlined" padding="md">
        <h3>Medium Card</h3>
        <p>This is a medium card (400px max-width).</p>
      </Card>
      <Card size="lg" variant="outlined" padding="md">
        <h3>Large Card</h3>
        <p>This is a large card (500px max-width).</p>
      </Card>
    </div>
  ),
};

// Padding
export const Padding: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="outlined" padding="none">
        <div style={{ backgroundColor: '#f3f4f6', padding: '0.5rem' }}>
          <h3>No Padding</h3>
          <p>This card has no padding.</p>
        </div>
      </Card>
      <Card variant="outlined" padding="sm">
        <h3>Small Padding</h3>
        <p>This card has small padding (0.5rem).</p>
      </Card>
      <Card variant="outlined" padding="md">
        <h3>Medium Padding</h3>
        <p>This card has medium padding (1rem).</p>
      </Card>
      <Card variant="outlined" padding="lg">
        <h3>Large Padding</h3>
        <p>This card has large padding (1.5rem).</p>
      </Card>
    </div>
  ),
};

// Radius
export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="outlined" padding="md" radius="none">
        <h3>No Radius</h3>
        <p>This card has no border radius.</p>
      </Card>
      <Card variant="outlined" padding="md" radius="sm">
        <h3>Small Radius</h3>
        <p>This card has small border radius (0.125rem).</p>
      </Card>
      <Card variant="outlined" padding="md" radius="md">
        <h3>Medium Radius</h3>
        <p>This card has medium border radius (0.375rem).</p>
      </Card>
      <Card variant="outlined" padding="md" radius="lg">
        <h3>Large Radius</h3>
        <p>This card has large border radius (0.5rem).</p>
      </Card>
    </div>
  ),
};

// Interactive
export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="outlined" padding="md" hoverable>
        <h3>Hoverable Card</h3>
        <p>This card has a hover effect. Try hovering over it.</p>
      </Card>
      <Card 
        variant="elevated" 
        padding="md" 
        hoverable 
        clickable 
        onClick={() => alert('Card clicked!')}
      >
        <h3>Clickable Card</h3>
        <p>This card is clickable. Try clicking on it.</p>
      </Card>
    </div>
  ),
};

// Custom Colors
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card 
        variant="outlined" 
        padding="md" 
        borderColor="#4f46e5"
        backgroundColor="#eef2ff"
      >
        <h3>Custom Border & Background</h3>
        <p>This card has a custom border and background color.</p>
      </Card>
      <Card 
        variant="elevated" 
        padding="md" 
        backgroundColor="#ecfdf5"
      >
        <h3>Custom Background</h3>
        <p>This card has a custom background color.</p>
      </Card>
    </div>
  ),
}; 