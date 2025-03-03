import type { Meta, StoryObj } from '@storybook/react';
import { ModulePalette } from './ModulePalette';

// Mock the registry for Storybook stories
// In a real implementation, these would be mocked with MSW or similar
const MockedModulePalette = (props: React.ComponentProps<typeof ModulePalette>) => {
  // We're using this wrapper to inject mocked dependencies
  // This approach would need to be refined in a real implementation
  return <div style={{ width: '300px', height: '600px' }}><ModulePalette {...props} /></div>;
};

const meta: Meta<typeof MockedModulePalette> = {
  title: 'Components/Dashboard/ModulePalette',
  component: MockedModulePalette,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ModulePalette component for selecting and adding modules to the dashboard.',
      },
    },
    // We would use MSW to properly mock the API responses
    mockData: {
      info: 'This component uses mocked data for demonstration purposes.',
    }
  },
  argTypes: {
    dashboardId: {
      control: 'text',
      description: 'ID of the dashboard to add modules to',
      defaultValue: 'dashboard-1',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockedModulePalette>;

// Default story - shows all module categories
export const Default: Story = {
  args: {
    dashboardId: 'dashboard-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default ModulePalette with all categories visible.',
      },
    },
  },
};

// Empty state when no modules match search criteria
export const EmptySearch: Story = {
  args: {
    dashboardId: 'dashboard-1',
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const searchInput = canvas.querySelector('.module-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = 'nonexistentmodule';
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state when search query returns no results.',
      },
    },
  },
};

// Filtered by category
export const FilteredByCategory: Story = {
  args: {
    dashboardId: 'dashboard-1',
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const productivityButton = Array.from(canvas.querySelectorAll('.category-button')).find(
      btn => (btn as HTMLElement).innerText === 'Productivity'
    ) as HTMLElement;
    
    if (productivityButton) {
      productivityButton.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'ModulePalette filtered to show only Productivity category modules.',
      },
    },
  },
}; 