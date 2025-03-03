import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModulePalette } from './ModulePalette';

// Set up the testing framework
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

// Mock the modulesRegistry
vi.mock('@/lib/modules/moduleRegistry', () => ({
  moduleRegistry: {
    getModulesByCategory: vi.fn(() => ({
      'Analytics': [
        {
          type: 'analytics',
          name: 'Analytics Dashboard',
          description: 'Display analytics data',
          icon: 'chart'
        }
      ],
      'Productivity': [
        {
          type: 'timer',
          name: 'Timer',
          description: 'Track time spent on tasks',
          icon: 'timer'
        },
        {
          type: 'todo',
          name: 'Todo List',
          description: 'Manage your tasks',
          icon: 'checklist'
        }
      ]
    }))
  }
}));

// Create a mock implementation for useDashboardStore
const mockIsEditing = vi.fn().mockReturnValue(true);
const mockAddModule = vi.fn().mockReturnValue('module-1');

// Mock the dashboardStore hook
vi.mock('@/lib/stores/dashboardStore', () => ({
  useDashboardStore: () => ({
    isEditing: mockIsEditing(),
    addModule: mockAddModule
  })
}));

describe('ModulePalette Component', () => {
  // Default props
  const defaultProps = {
    dashboardId: 'dashboard-1'
  };
  
  // Setup mock before each test
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Set default values
    mockIsEditing.mockReturnValue(true);
  });
  
  // Reset mocks after each test
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders correctly in edit mode', () => {
    render(<ModulePalette {...defaultProps} />);
    
    // Check if title is rendered
    expect(screen.getByText('Add Modules')).toBeInTheDocument();
    
    // Check if search input is rendered
    expect(screen.getByPlaceholderText('Search modules...')).toBeInTheDocument();
    
    // Check if categories are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Productivity' })).toBeInTheDocument();
    
    // Check if modules are rendered
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });
  
  it('does not render when not in edit mode', () => {
    // Override isEditing to false
    mockIsEditing.mockReturnValue(false);
    
    const { container } = render(<ModulePalette {...defaultProps} />);
    
    // Component should not render anything
    expect(container).toBeEmptyDOMElement();
  });
  
  it('filters modules by search query', () => {
    render(<ModulePalette {...defaultProps} />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search modules...');
    
    // Type 'tim' in the search input
    fireEvent.change(searchInput, { target: { value: 'tim' } });
    
    // Timer should be visible
    expect(screen.getByText('Timer')).toBeInTheDocument();
    
    // Todo List should not be visible (filtered out)
    expect(screen.queryByText('Todo List')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics Dashboard')).not.toBeInTheDocument();
  });
  
  it('filters modules by category', () => {
    render(<ModulePalette {...defaultProps} />);
    
    // Click on the Analytics category
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    
    // Analytics modules should be visible
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    
    // Productivity modules should not be visible
    expect(screen.queryByText('Timer')).not.toBeInTheDocument();
    expect(screen.queryByText('Todo List')).not.toBeInTheDocument();
  });
  
  it('calls addModule when a module is clicked', () => {
    // Clear previous mock calls
    mockAddModule.mockClear();
    
    render(<ModulePalette {...defaultProps} />);
    
    // Click on the Timer module
    fireEvent.click(screen.getByText('Timer'));
    
    // Verify that addModule was called with the correct arguments
    expect(mockAddModule).toHaveBeenCalledWith('dashboard-1', 'timer');
  });
  
  it('shows empty state when no modules match search', () => {
    render(<ModulePalette {...defaultProps} />);
    
    // Search for a non-existent module
    const searchInput = screen.getByPlaceholderText('Search modules...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Check if the empty state message is displayed
    expect(screen.getByText('No modules found matching your search.')).toBeInTheDocument();
  });
}); 