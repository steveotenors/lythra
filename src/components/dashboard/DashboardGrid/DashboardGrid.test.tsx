import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { DashboardGrid } from './DashboardGrid';

// Mock the required dependencies
vi.mock('@/lib/stores/dashboardStore', () => ({
  useDashboardStore: () => ({
    dashboards: {
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
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            version: '1.0.0',
          },
        ],
        description: 'A test dashboard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        isPublic: false,
        tags: ['test'],
      },
      'empty-dashboard': {
        id: 'empty-dashboard',
        name: 'Empty Dashboard',
        modules: [],
        description: 'An empty dashboard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        isPublic: false,
        tags: ['test'],
      },
    },
    isEditing: false,
    updateModule: vi.fn(),
    removeModule: vi.fn(),
    updateModuleSettings: vi.fn(),
  }),
}));

vi.mock('@/lib/modules/moduleRegistry', () => ({
  moduleRegistry: {
    getDefinition: (type: string) => {
      if (type === 'timer') {
        return {
          name: 'Timer Module',
          Component: () => <div data-testid="timer-module">Timer Module</div>,
        };
      }
      return undefined;
    },
  },
}));

vi.mock('@/lib/events/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
  },
}));

// Type for component props
interface MockWrapperProps {
  children: React.ReactNode;
  title?: string;
}

// Type for higher-order component props
interface HOCProps<T> {
  Component: React.ComponentType<T>;
  props: T;
}

// Helper function that uses HOCProps to create HOCs
function createHOC<T extends React.JSX.IntrinsicAttributes>(options: HOCProps<T>): React.ReactElement {
  const { Component, props } = options;
  return <Component {...props} />;
}

// Mock the ModuleWrapper component
vi.mock('@/components/modules/ModuleWrapper', () => {
  const MockWrapper = ({ children, title }: MockWrapperProps) => (
    <div data-testid="module-wrapper" title={title || ''}>
      {children}
    </div>
  );
  MockWrapper.displayName = 'MockModuleWrapper';
  return { ModuleWrapper: MockWrapper };
});

// Mock the ModuleProvider component
vi.mock('@/lib/modules/moduleContext', () => {
  const MockProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="module-provider">{children}</div>
  );
  MockProvider.displayName = 'MockModuleProvider';
  return { 
    ModuleProvider: MockProvider,
    useModuleSandbox: vi.fn() 
  };
});

// Mock react-grid-layout
vi.mock('react-grid-layout', () => {
  const MockResponsive = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-grid">{children}</div>
  );
  MockResponsive.displayName = 'MockResponsiveGrid';
  
  // Using the HOCProps interface for the WidthProvider
  const WidthProvider = <T extends object>(Component: React.ComponentType<T>) => {
    // Return a function that uses our createHOC helper with HOCProps
    const WrappedComponent = (props: T) => {
      const hocProps: HOCProps<T> = { 
        Component, 
        props 
      };
      return createHOC(hocProps);
    };
    WrappedComponent.displayName = `WidthProvider(${Component.displayName || 'Component'})`;
    return WrappedComponent;
  };
  
  return { Responsive: MockResponsive, WidthProvider };
});

describe('DashboardGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a dashboard with modules', () => {
    render(<DashboardGrid dashboardId="dashboard-1" />);
    
    // Check that the grid is rendered
    expect(screen.getByTestId('responsive-grid')).toBeInTheDocument();
    
    // Check that the module wrapper is rendered
    expect(screen.getByTestId('module-wrapper')).toBeInTheDocument();
    
    // Check that the module component is rendered
    expect(screen.getByTestId('timer-module')).toBeInTheDocument();
  });

  it('renders an empty state when no modules are present', () => {
    render(<DashboardGrid dashboardId="empty-dashboard" />);
    
    // Check that the empty message is displayed
    expect(screen.getByText('This dashboard is empty')).toBeInTheDocument();
    expect(screen.getByText('Click "Edit Dashboard" to start adding modules.')).toBeInTheDocument();
  });

  it('renders an error message when dashboard is not found', () => {
    render(<DashboardGrid dashboardId="non-existent" />);
    
    // Check that the error message is displayed
    expect(screen.getByText('Dashboard not found')).toBeInTheDocument();
  });

  // Add more tests as needed for keyboard navigation, module removal, etc.
}); 