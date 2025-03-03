import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DashboardGrid } from './DashboardGrid';

// Mock data and components
const mockDashboards = {
  'dashboard-1': {
    id: 'dashboard-1',
    name: 'Test Dashboard',
    modules: [
      {
        id: 'module-1',
        type: 'timer',
        position: { x: 0, y: 0 },
        size: { width: 3, height: 2 },
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
      {
        id: 'module-2',
        type: 'unknown-type',
        position: { x: 3, y: 0 },
        size: { width: 3, height: 2 },
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    ],
    description: 'A test dashboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    tags: ['test'],
  },
  'empty-dashboard': {
    id: 'empty-dashboard',
    name: 'Empty Dashboard',
    modules: [],
    description: 'An empty dashboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    tags: ['test'],
  },
};

// Mock components and hooks for stories
const mockFn = () => {/* Empty mock function */};

// Mock useDashboardStore
const mockUseDashboardStore = {
  dashboards: mockDashboards,
  isEditing: false,
  updateModule: mockFn,
  removeModule: mockFn,
  updateModuleSettings: mockFn,
};

// Edit mode version of the store
const mockEditModeStore = {
  ...mockUseDashboardStore,
  isEditing: true,
};

// Mock moduleRegistry
const mockModuleRegistry = {
  getDefinition: (type: string) => {
    if (type === 'timer') {
      return {
        name: 'Timer',
        Component: () => <div>Timer Module</div>,
      };
    }
    return undefined;
  },
};

// Mock eventBus
const mockEventBus = {
  emit: mockFn,
};

// Note: These mocks will be applied in the Storybook preview.js
// For a real implementation, we would use MSW or other mocking tools
// This is just for demonstration purposes

const meta: Meta<typeof DashboardGrid> = {
  title: 'Components/Dashboard/DashboardGrid',
  component: DashboardGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A grid layout component for displaying dashboard modules. Supports drag-and-drop rearrangement, resizing, and keyboard navigation.',
      },
    },
    // Mock context for all stories
    mockData: {
      useDashboardStore: mockUseDashboardStore,
      moduleRegistry: mockModuleRegistry,
      eventBus: mockEventBus,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dashboardId: {
      control: 'text',
      description: 'ID of the dashboard to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardGrid>;

// Default story with modules
export const Default: Story = {
  args: {
    dashboardId: 'dashboard-1',
  },
};

// Empty dashboard story
export const EmptyDashboard: Story = {
  args: {
    dashboardId: 'empty-dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows an empty state message when no modules are present.',
      },
    },
  },
};

// Edit mode story
export const EditMode: Story = {
  args: {
    dashboardId: 'dashboard-1',
  },
  parameters: {
    mockData: {
      useDashboardStore: mockEditModeStore,
    },
    docs: {
      description: {
        story: 'Shows the dashboard in edit mode with draggable and resizable modules.',
      },
    },
  },
}; 