// src/lib/stores/dashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Dashboard, ModuleConfig } from '@/types/module';
import { createModuleConfig, findAvailablePosition } from '@/lib/utils/moduleUtils';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';
import { Json } from '@/types/common';

/**
 * Dashboard store interface for managing dashboards and modules
 */
interface DashboardStore {
  // State
  dashboards: Record<string, Dashboard>;
  currentDashboardId: string | null;
  isEditing: boolean;
  isSaving: boolean;
  lastError: string | null;
  
  // Dashboard actions
  createDashboard: (name: string, description?: string) => string;
  updateDashboard: (dashboardId: string, updates: Partial<Omit<Dashboard, 'id' | 'modules'>>) => void;
  deleteDashboard: (dashboardId: string) => void;
  duplicateDashboard: (dashboardId: string, newName?: string) => string | null;
  setCurrentDashboard: (dashboardId: string | null) => void;
  importDashboard: (dashboard: Dashboard) => string;
  exportDashboard: (dashboardId: string) => Dashboard | null;
  
  // Module actions
  addModule: (dashboardId: string, moduleType: string) => string | null;
  updateModule: (dashboardId: string, moduleId: string, updates: Partial<Omit<ModuleConfig, 'id' | 'type'>>) => void;
  removeModule: (dashboardId: string, moduleId: string) => void;
  updateModuleSettings: (dashboardId: string, moduleId: string, settings: Record<string, Json>) => void;
  
  // Edit mode actions
  setEditMode: (editing: boolean) => void;
  
  // Status actions
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Create dashboard store using Zustand
 * 
 * This store handles:
 * - Dashboard CRUD operations
 * - Module management within dashboards
 * - Dashboard editing state
 * - Dashboard import/export
 */
export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      dashboards: {},
      currentDashboardId: null,
      isEditing: false,
      isSaving: false,
      lastError: null,
      
      // Dashboard actions
      createDashboard: (name, description) => {
        const id = nanoid();
        const now = new Date().toISOString();
        
        const newDashboard: Dashboard = {
          id,
          name,
          description,
          modules: [],
          createdAt: now,
          updatedAt: now,
          isPublic: false,
          tags: [],
        };
        
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: newDashboard,
          },
          currentDashboardId: id,
        }));
        
        return id;
      },
      
      updateDashboard: (dashboardId, updates) => {
        set((state) => {
          const dashboard = state.dashboards[dashboardId];
          if (!dashboard) return state;
          
          return {
            dashboards: {
              ...state.dashboards,
              [dashboardId]: {
                ...dashboard,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      deleteDashboard: (dashboardId) => {
        set((state) => {
          const { [dashboardId]: _, ...remainingDashboards } = state.dashboards;
          
          const newCurrentId = state.currentDashboardId === dashboardId
            ? Object.keys(remainingDashboards)[0] || null
            : state.currentDashboardId;
            
          return {
            dashboards: remainingDashboards,
            currentDashboardId: newCurrentId,
          };
        });
      },
      
      duplicateDashboard: (dashboardId, newName) => {
        const state = get();
        const dashboard = state.dashboards[dashboardId];
        
        if (!dashboard) {
          state.setError(`Dashboard with ID ${dashboardId} not found`);
          return null;
        }
        
        const id = nanoid();
        const now = new Date().toISOString();
        
        // Deep clone modules to avoid reference issues
        const modules = dashboard.modules.map(module => ({
          ...module,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
        }));
        
        const duplicatedDashboard: Dashboard = {
          id,
          name: newName || `${dashboard.name} (Copy)`,
          description: dashboard.description,
          modules,
          createdAt: now,
          updatedAt: now,
          isPublic: false, // Always set copied dashboards to private
          tags: [...dashboard.tags],
        };
        
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: duplicatedDashboard,
          },
        }));
        
        return id;
      },
      
      setCurrentDashboard: (dashboardId) => {
        set({ currentDashboardId: dashboardId });
      },
      
      importDashboard: (dashboard) => {
        const id = nanoid();
        const now = new Date().toISOString();
        
        // Create a new dashboard based on the imported one
        const importedDashboard: Dashboard = {
          ...dashboard,
          id,
          createdAt: now,
          updatedAt: now,
          isPublic: false, // Always set imported dashboards to private
        };
        
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: importedDashboard,
          },
          currentDashboardId: id,
        }));
         
        return id;
      },
      
      exportDashboard: (dashboardId) => {
        const dashboard = get().dashboards[dashboardId];
        return dashboard || null;
      },
      
      // Module actions
      addModule: (dashboardId, moduleType) => {
        const state = get();
        const dashboard = state.dashboards[dashboardId];
        
        if (!dashboard) {
          state.setError(`Dashboard with ID ${dashboardId} not found`);
          return null;
        }
        
        // Get module definition from registry
        const moduleDefinition = moduleRegistry.getDefinition(moduleType);
        
        if (!moduleDefinition) {
          state.setError(`Module type ${moduleType} not found in registry`);
          return null;
        }
        
        // Find an available position for the new module
        const position = findAvailablePosition(
          dashboard.modules,
          moduleDefinition.defaultSize
        );
        
        // Create the module configuration
        const newModule = createModuleConfig(moduleType, moduleDefinition, position);
        
        set((state) => {
          const dashboard = state.dashboards[dashboardId];
          if (!dashboard) return state;
          
          return {
            dashboards: {
              ...state.dashboards,
              [dashboardId]: {
                ...dashboard,
                modules: [...dashboard.modules, newModule],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
        
        return newModule.id;
      },
      
      updateModule: (dashboardId, moduleId, updates) => {
        set((state) => {
          const dashboard = state.dashboards[dashboardId];
          if (!dashboard) return state;
          
          return {
            dashboards: {
              ...state.dashboards,
              [dashboardId]: {
                ...dashboard,
                modules: dashboard.modules.map((module) =>
                  module.id === moduleId
                    ? { 
                        ...module, 
                        ...updates, 
                        updatedAt: new Date().toISOString() 
                      }
                    : module
                ),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      removeModule: (dashboardId, moduleId) => {
        set((state) => {
          const dashboard = state.dashboards[dashboardId];
          if (!dashboard) return state;
          
          return {
            dashboards: {
              ...state.dashboards,
              [dashboardId]: {
                ...dashboard,
                modules: dashboard.modules.filter(
                  (module) => module.id !== moduleId
                ),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      updateModuleSettings: (dashboardId, moduleId, settings) => {
        set((state) => {
          const dashboard = state.dashboards[dashboardId];
          if (!dashboard) return state;
          
          return {
            dashboards: {
              ...state.dashboards,
              [dashboardId]: {
                ...dashboard,
                modules: dashboard.modules.map((module) =>
                  module.id === moduleId
                    ? { 
                        ...module, 
                        settings: { ...module.settings, ...settings },
                        updatedAt: new Date().toISOString() 
                      }
                    : module
                ),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Edit mode actions
      setEditMode: (editing) => {
        set({ isEditing: editing });
      },
      
      // Status actions
      setSaving: (saving) => {
        set({ isSaving: saving });
      },
      
      setError: (error) => {
        set({ lastError: error });
      },
    }),
    {
      name: 'lythra-dashboard-storage',
      version: 1,
    }
  )
);

// Add a placeholder for moduleRegistry if it doesn't exist yet
// This will be properly implemented in a later step
if (typeof moduleRegistry === 'undefined') {
  // @ts-expect-error - Temporary workaround until module registry is implemented
  globalThis.moduleRegistry = {
    getDefinition: () => null
  };
} 