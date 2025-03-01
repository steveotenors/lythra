import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
    },
  },
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

// Default card story
export const Default: Story = {
  args: {
    children: <div style={{ padding: '1rem' }}>This is a simple card component</div>,
    variant: 'default',
  },
};

// Card variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="default">
        <CardContent>Default variant card</CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>Outlined variant card</CardContent>
      </Card>
      <Card variant="elevated">
        <CardContent>Elevated variant card</CardContent>
      </Card>
    </div>
  ),
};

// Complete card example with all subcomponents
export const CompleteCard: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description for the card</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. It can contain any arbitrary content.</p>
      </CardContent>
      <CardFooter>
        <button style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          Action Button
        </button>
      </CardFooter>
    </Card>
  ),
};

// Login form example
export const LoginFormCard: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              style={{ 
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              style={{ 
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          width: '100%',
          border: 'none',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </CardFooter>
    </Card>
  ),
};

// CardHeader only
export const HeaderOnly: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description for the card</CardDescription>
      </CardHeader>
    </Card>
  ),
};

// CardContent only
export const ContentOnly: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>This is a standalone content section that isn&apos;t preceded by a header.</p>
      </CardContent>
    </Card>
  ),
};

// CardFooter only
export const FooterOnly: Story = {
  render: () => (
    <Card>
      <CardFooter>
        <button style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          Action Button
        </button>
      </CardFooter>
    </Card>
  ),
}; 