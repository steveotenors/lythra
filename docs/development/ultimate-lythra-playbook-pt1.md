# Ultimate Lythra Implementation Playbook

This comprehensive playbook will guide you through implementing Lythra's modular dashboard system with robust security, accessibility, and performance. Each step includes detailed explanations, complete code examples, and best practices.

## Phase 1: Project Configuration & Foundation

### Step 1: Install Core Dependencies

Let's start by installing all necessary packages:

```bash
# Core state management
npm install zustand jotai

# Persistence and storage
npm install @supabase/supabase-js idb-keyval

# UI components and layout
npm install react-grid-layout framer-motion

# Utilities
npm install nanoid zod date-fns lodash

# Encryption (for sensitive module data)
npm install crypto-js

# Development tools
npm install -D @types/react-grid-layout @types/lodash @types/crypto-js eslint-plugin-jsx-a11y
```

**Explanation**:
- **zustand & jotai**: For our hybrid state management approach
- **idb-keyval**: For efficient client-side storage beyond localStorage
- **framer-motion**: For accessible animations and transitions
- **zod**: For runtime data validation
- **crypto-js**: For client-side encryption of sensitive module data
- **eslint-plugin-jsx-a11y**: To enforce accessibility best practices

### Step 2: TypeScript Configuration

Create a robust `tsconfig.json` in the root directory with strict typing enforcement:

```json
{
  "compilerOptions": {
    "target": "es2015",
    "lib": ["dom", "dom.iterable", "esnext", "webworker"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@features/*": ["./src/app/(dashboard)/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@utils/*": ["./src/lib/utils/*"],
      "@styles/*": ["./src/styles/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Explanation**:
- **noImplicitAny**: Prevents using variables without type declarations
- **strictNullChecks**: Forces you to handle potential null/undefined values
- **noUncheckedIndexedAccess**: Prevents assuming array/object access always succeeds
- **WebWorker lib**: Added for potential future module isolation in web workers

### Step 3: ESLint & Prettier Configuration

Create `.eslintrc.json` in the root directory:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn"
  }
}
```

Create `.prettierrc` in the root directory:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

**Explanation**:
- The ESLint configuration enforces accessibility practices and React hooks rules
- Prettier ensures consistent code formatting

### Step 4: Content Security Policy

Create `middleware.ts` in the root directory to implement CSP:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response to modify headers
  const response = NextResponse.next();
  
  // Set Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self';
    object-src 'none';
    connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL};
    frame-src 'none';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Set other security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Explanation**:
- Implements strict Content Security Policy to prevent XSS attacks
- Adds additional security headers to protect against various attack vectors
- The connect-src directive allows communication with your Supabase backend

## Phase 2: Core Types & Utilities

### Step 1: Define Base Types

Create `types/common.ts` for shared type definitions:

```typescript
// types/common.ts
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  created_at: string;
}

export type Theme = 'light' | 'dark' | 'system';

// Type-guard utilities
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};
```

**Explanation**:
- Defines common types used throughout the application
- Includes type-guard utilities for runtime type checking
- The Json type accurately represents what can be stored in JSON format

### Step 2: Define Module System Types

Create `types/module.ts` for the module system types:

```typescript
// types/module.ts
import { ReactNode } from 'react';
import { z } from 'zod';
import { Json } from './common';

// Module position and size
export interface ModulePosition {
  x: number;
  y: number;
}

export interface ModuleSize {
  width: number;
  height: number;
}

// Module permissions
export type ModulePermission = 
  | 'storage:read' 
  | 'storage:write' 
  | 'network:read' 
  | 'network:write' 
  | 'audio:play'
  | 'notifications:create';

// Base module configuration
export interface ModuleConfig {
  id: string;
  type: string;
  version: string;
  position: ModulePosition;
  size: ModuleSize;
  settings: Record<string, Json>;
  createdAt: string;
  updatedAt: string;
}

// Definition of a module type in the registry
export interface ModuleDefinition {
  // Core identification
  type: string;
  name: string;
  description: string;
  version: string;
  compatibleWith: string[];
  category: string;
  
  // UI elements
  icon: ReactNode;
  previewImage?: string;
  
  // Default configuration
  defaultSize: ModuleSize;
  defaultSettings: Record<string, Json>;
  
  // Security
  permissions: ModulePermission[];
  settingsSchema: z.ZodSchema;
  
  // Implementation
  Component: React.ComponentType<ModuleProps>;
  
  // Lifecycle functions
  migrationStrategy?: (
    oldSettings: Record<string, Json>,
    oldVersion: string,
    newVersion: string
  ) => Record<string, Json>;
}

// Props passed to each module component
export interface ModuleProps {
  id: string;
  settings: Record<string, Json>;
  isEditing: boolean;
  onSettingsChange: (newSettings: Record<string, Json>) => void;
  containerWidth: number;
  containerHeight: number;
}

// Dashboard state
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  modules: ModuleConfig[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
}

// Module event types for the event bus
export type ModuleEventType = 
  | 'module:initialized'
  | 'module:settings-changed'
  | 'module:state-changed'
  | 'module:error'
  | 'dashboard:layout-changed'
  | 'dashboard:edit-mode-changed';

export interface ModuleEvent {
  type: ModuleEventType;
  moduleId?: string;
  moduleType?: string;
  payload?: unknown;
  timestamp: number;
}
```

**Explanation**:
- Comprehensive type definitions for the module system
- Includes versioning and compatibility information
- Uses Zod schema validation for runtime settings validation
- Defines a clear permission system for security
- Includes event types for module communication

### Step 3: Create Utility Functions

Create `lib/utils/moduleUtils.ts` for module-related utilities:

```typescript
// lib/utils/moduleUtils.ts
import { nanoid } from 'nanoid';
import { ModuleConfig, ModuleDefinition, ModuleSize, ModulePosition } from '@/types/module';

/**
 * Creates a new module configuration
 */
export function createModuleConfig(
  moduleType: string,
  moduleDefinition: ModuleDefinition,
  position: ModulePosition = { x: 0, y: 0 }
): ModuleConfig {
  const now = new Date().toISOString();
  
  return {
    id: nanoid(),
    type: moduleType,
    version: moduleDefinition.version,
    position,
    size: moduleDefinition.defaultSize,
    settings: { ...moduleDefinition.defaultSettings },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Calculates the next available position on the grid
 */
export function findAvailablePosition(
  existingModules: ModuleConfig[],
  newSize: ModuleSize,
  gridCols: number = 12
): ModulePosition {
  // Start with position 0,0
  let position: ModulePosition = { x: 0, y: 0 };
  
  // Simple algorithm to find first non-overlapping position
  // In a real implementation, this would be more sophisticated
  let placed = false;
  let maxAttempts = 100; // Prevent infinite loops
  
  // Try different y positions until we find a spot
  while (!placed && maxAttempts > 0) {
    maxAttempts--;
    
    // Check all x positions for current y
    for (let x = 0; x <= gridCols - newSize.width; x++) {
      position = { x, y: position.y };
      
      // Check if this position overlaps with any existing module
      const overlaps = existingModules.some(module => {
        return !(
          position.x + newSize.width <= module.position.x ||
          position.x >= module.position.x + module.size.width ||
          position.y + newSize.height <= module.position.y ||
          position.y >= module.position.y + module.size.height
        );
      });
      
      if (!overlaps) {
        placed = true;
        break;
      }
    }
    
    // If we couldn't place at this y, try the next row
    if (!placed) {
      position.y++;
    }
  }
  
  return position;
}

/**
 * Validates if a module's settings conform to its schema
 */
export function validateModuleSettings(
  settings: Record<string, any>,
  moduleDefinition: ModuleDefinition
): { valid: boolean; errors?: string[] } {
  try {
    moduleDefinition.settingsSchema.parse(settings);
    return { valid: true };
  } catch (error) {
    if (error instanceof Error) {
      return { 
        valid: false, 
        errors: [error.message] 
      };
    }
    return { 
      valid: false, 
      errors: ['Unknown validation error'] 
    };
  }
}

/**
 * Checks if two module versions are compatible
 */
export function areVersionsCompatible(
  currentVersion: string,
  compatibleWith: string[]
): boolean {
  // Simple implementation - in reality, would use semver
  return compatibleWith.includes(currentVersion) || compatibleWith.includes('*');
}
```

**Explanation**:
- Utility functions for common module operations
- Includes position calculation algorithm for new modules
- Provides validation functions for module settings
- Has version compatibility checking

Create `lib/utils/securityUtils.ts` for security-related utilities:

```typescript
// lib/utils/securityUtils.ts
import CryptoJS from 'crypto-js';

// Secret key should come from environment variable in production
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-dev-key-change-in-production';

/**
 * Encrypt sensitive data before storing
 */
export function encryptData(data: unknown): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

/**
 * Decrypt data after retrieving from storage
 */
export function decryptData(encryptedData: string): unknown {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Create a secure random ID
 */
export function secureRandomId(length: number = 20): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if a module has the required permission
 */
export function hasPermission(
  modulePermissions: string[],
  requiredPermission: string
): boolean {
  return modulePermissions.includes(requiredPermission);
}
```

**Explanation**:
- Provides functions for encryption/decryption of sensitive data
- Includes input sanitization to prevent XSS attacks
- Uses cryptographically secure random ID generation
- Implements permission checking for module capabilities

## Phase 3: State Management Setup

### Step 1: Create Global App Store

Create `lib/stores/appStore.ts` for global application state:

```typescript
// lib/stores/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, User } from '@/types/common';

interface AppState {
  // User and auth state
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  
  // UI state
  theme: Theme;
  sidebarOpen: boolean;
  
  // App state
  isOnline: boolean;
  lastSyncTime: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  setAuthInitialized: (initialized: boolean) => void;
  logout: () => void;
  setLastSyncTime: (time: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isAuthInitialized: false,
      theme: 'system',
      sidebarOpen: true,
      isOnline: true,
      lastSyncTime: null,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setOnlineStatus: (online) => set({ isOnline: online }),
      
      setAuthInitialized: (initialized) => set({ 
        isAuthInitialized: initialized 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'lythra-app-storage',
      partialize: (state) => ({
        // Only persist these fields
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        // Don't store auth info in localStorage
      }),
      version: 1, // For migration purposes
    }
  )
);

// Add listener for online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false);
  });
}
```

**Explanation**:
- Global store for application-wide state using Zustand
- Includes user authentication, UI preferences, and connection status
- Uses the persist middleware for selective client-side persistence
- Sets up event listeners for online/offline status
- Only persists non-sensitive information to localStorage

### Step 2: Create Dashboard Store

Create `lib/stores/dashboardStore.ts` for dashboard and module state:

```typescript
// lib/stores/dashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Dashboard, ModuleConfig } from '@/types/module';
import { createModuleConfig, findAvailablePosition } from '@/lib/utils/moduleUtils';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';

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
  updateModuleSettings: (dashboardId: string, moduleId: string, settings: Record<string, any>) => void;
  
  // Edit mode actions
  setEditMode: (editing: boolean) => void;
  
  // Status actions
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

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
```

**Explanation**:
- Comprehensive dashboard store with full CRUD operations for dashboards and modules
- Includes error handling and loading states
- Provides import/export functionality for user portability
- Uses persist middleware for local storage
- Implements duplicate functionality for better UX
- Updates timestamps consistently for proper syncing

### Step 3: Create Advanced Event Bus

Create `lib/events/eventBus.ts` for module communication:

```typescript
// lib/events/eventBus.ts
import { ModuleEvent, ModuleEventType } from '@/types/module';

type EventCallback = (event: ModuleEvent) => void;

class EventBus {
  private events: Map<ModuleEventType, Set<EventCallback>> = new Map();
  private eventLog: ModuleEvent[] = [];
  private maxLogSize: number = 100;
  
  /**
   * Subscribe to an event type
   */
  on(eventType: ModuleEventType, callback: EventCallback): () => void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Set());
    }
    
    this.events.get(eventType)?.add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(eventType);
      if (callbacks?.has(callback)) {
        callbacks.delete(callback);
        
        // Clean up empty callback sets
        if (callbacks.size === 0) {
          this.events.delete(eventType);
        }
      }
    };
  }
  
  /**
   * Subscribe to events for a specific module
   */
  onForModule(eventType: ModuleEventType, moduleId: string, callback: EventCallback): () => void {
    return this.on(eventType, (event) => {
      if (event.moduleId === moduleId) {
        callback(event);
      }
    });
  }
  
  /**
   * Subscribe to all events (use carefully)
   */
  onAll(callback: EventCallback): () => void {
    const unsubscribers: Array<() => void> = [];
    
    // Get all possible event types from the ModuleEventType type
    const allEventTypes = Object.values(ModuleEventType) as ModuleEventType[];
    
    // Subscribe to each event type
    allEventTypes.forEach((eventType) => {
      unsubscribers.push(this.on(eventType, callback));
    });
    
    // Return function to unsubscribe from all
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }
  
  /**
   * Emit an event to all subscribers
   */
  emit(eventType: ModuleEventType, payload?: any, moduleId?: string, moduleType?: string): void {
    const event: ModuleEvent = {
      type: eventType,
      moduleId,
      moduleType,
      payload,
      timestamp: Date.now(),
    };
    
    // Log the event
    this.logEvent(event);
    
    // Notify subscribers
    const callbacks = this.events.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }
  
  /**
   * Log an event for debugging and auditing
   */
  private logEvent(event: ModuleEvent): void {
    this.eventLog.push(event);
    
    // Truncate log to max size
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(this.eventLog.length - this.maxLogSize);
    }
  }
  
  /**
   * Get the event log (for debugging)
   */
  getEventLog(): ModuleEvent[] {
    return [...this.eventLog];
  }
  
  /**
   * Clear all subscriptions
   */
  clearAllSubscriptions(): void {
    this.events.clear();
  }
}

// Create and export a singleton instance
export const eventBus = new EventBus();
```

**Explanation**:
- Robust event bus implementation for module communication
- Includes module-specific subscriptions
- Maintains an event log for debugging and audit trails
- Provides comprehensive error handling
- Uses a Map/Set combination for better performance
- Implements proper cleanup methods

### Step 4: Create Module Atom Registry

Create `lib/modules/moduleAtomsRegistry.ts` for Jotai atoms:

```typescript
// lib/modules/moduleAtomsRegistry.ts
import { atom } from 'jotai';

// Type for atom creator functions
type ModuleAtomCreator<T> = (moduleId: string) => T;

/**
 * Registry to manage Jotai atoms for different module types
 */
class ModuleAtomsRegistry {
  private atomCreators: Map<string, ModuleAtomCreator<any>> = new Map();
  private moduleAtoms: Map<string, any> = new Map();
  
  /**
   * Register an atom creator for a module type
   */
  registerAtomCreator<T>(moduleType: string, creator: ModuleAtomCreator<T>): void {
    if (this.atomCreators.has(moduleType)) {
      console.warn(`Atom creator for module type ${moduleType} is already registered. Overwriting...`);
    }
    
    this.atomCreators.set(moduleType, creator);
  }
  
  /**
   * Get or create atoms for a specific module instance
   */
  getModuleAtoms<T>(moduleType: string, moduleId: string): T {
    const key = `${moduleType}:${moduleId}`;
    
    if (!this.moduleAtoms.has(key)) {
      const creator = this.atomCreators.get(moduleType);
      
      if (!creator) {
        throw new Error(`No atom creator registered for module type: ${moduleType}`);
      }
      
      this.moduleAtoms.set(key, creator(moduleId));
    }
    
    return this.moduleAtoms.get(key) as T;
  }
  
  /**
   * Check if atoms exist for a module
   */
  hasModuleAtoms(moduleType: string, moduleId: string): boolean {
    return this.moduleAtoms.has(`${moduleType}:${moduleId}`);
  }
  
  /**
   * Remove atoms for a module (cleanup)
   */
  removeModuleAtoms(moduleType: string, moduleId: string): void {
    this.moduleAtoms.delete(`${moduleType}:${moduleId}`);
  }
  
  /**
   * Get all registered module types
   */
  getRegisteredModuleTypes(): string[] {
    return Array.from(this.atomCreators.keys());
  }
  
  /**
   * Clear all atoms (useful for testing)
   */
  clearAllAtoms(): void {
    this.moduleAtoms.clear();
  }
}

/**
 * Create base atoms that all modules can use
 */
export interface BaseModuleAtoms {
  isActiveAtom: ReturnType<typeof atom<boolean>>;
  errorAtom: ReturnType<typeof atom<string | null>>;
  isLoadingAtom: ReturnType<typeof atom<boolean>>;
  lastUpdatedAtom: ReturnType<typeof atom<number | null>>;
}

export function createBaseModuleAtoms(moduleId: string): BaseModuleAtoms {
  return {
    isActiveAtom: atom(true),
    errorAtom: atom<string | null>(null),
    isLoadingAtom: atom(false),
    lastUpdatedAtom: atom<number | null>(null),
  };
}

// Create and export a singleton instance
export const moduleAtomsRegistry = new ModuleAtomsRegistry();
```

**Explanation**:
- Registry for managing Jotai atoms for different module types
- Uses unique keys combining module type and ID
- Provides utility functions for managing atom lifecycles
- Includes base atoms that all modules can use
- Implements proper error handling and logging

### Step 5: Create Module Registry

Create `lib/modules/moduleRegistry.ts` for module definitions:

```typescript
// lib/modules/moduleRegistry.ts
import { ModuleDefinition } from '@/types/module';

/**
 * Registry for module definitions
 */
class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();
  
  /**
   * Register a new module definition
   */
  register(moduleDefinition: ModuleDefinition): void {
    const { type } = moduleDefinition;
    
    if (this.modules.has(type)) {
      console.warn(`Module type ${type} is already registered. Overwriting...`);
    }
    
    this.modules.set(type, moduleDefinition);
  }
  
  /**
   * Get a module definition by type
   */
  getDefinition(type: string): ModuleDefinition | undefined {
    return this.modules.get(type);
  }
  
  /**
   * Get all registered module definitions
   */
  getAllDefinitions(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get module definitions grouped by category
   */
  getModulesByCategory(): Record<string, ModuleDefinition[]> {
    const result: Record<string, ModuleDefinition[]> = {};
    
    this.getAllDefinitions().forEach((module) => {
      if (!result[module.category]) {
        result[module.category] = [];
      }
      
      result[module.category].push(module);
    });
    
    // Sort modules within each category by name
    Object.values(result).forEach((modules) => {
      modules.sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return result;
  }
  
  /**
   * Check if a module type is registered
   */
  hasModule(type: string): boolean {
    return this.modules.has(type);
  }
  
  /**
   * Get all registered module types
   */
  getAllModuleTypes(): string[] {
    return Array.from(this.modules.keys());
  }
  
  /**
   * Get all module categories
   */
  getAllCategories(): string[] {
    const categories = new Set<string>();
    
    this.getAllDefinitions().forEach((module) => {
      categories.add(module.category);
    });
    
    return Array.from(categories).sort();
  }
}

// Create and export a singleton instance
export const moduleRegistry = new ModuleRegistry();
```

**Explanation**:
- Registry for module type definitions
- Uses Map for better performance and type safety
- Provides utility functions for categorization and sorting
- Implements consistent error handling and logging
- Includes helper methods for retrieving modules by category

## Phase 4: Module System Implementation

### Step 1: Create Module Sandbox

Create `lib/modules/moduleSandbox.ts` for module isolation:

```typescript
// lib/modules/moduleSandbox.ts
import { ModulePermission } from '@/types/module';
import { get, set, del } from 'idb-keyval';

/**
 * Creates a sandboxed storage API for a module
 */
function createSandboxedStorage(moduleId: string) {
  const storageKeyPrefix = `module:${moduleId}:`;
  
  return {
    // Get a value from module's storage
    async getItem(key: string): Promise<any> {
      try {
        return await get(`${storageKeyPrefix}${key}`);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
        return null;
      }
    },
    
    // Set a value in module's storage
    async setItem(key: string, value: any): Promise<void> {
      try {
        await set(`${storageKeyPrefix}${key}`, value);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    },
    
    // Remove a value from module's storage
    async removeItem(key: string): Promise<void> {
      try {
        await del(`${storageKeyPrefix}${key}`);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    },
    
    // Get all keys in module's storage
    async keys(): Promise<string[]> {
      try {
        const allKeys = await get('__all_keys__') || [];
        return allKeys.filter((key: string) => 
          key.startsWith(storageKeyPrefix)
        ).map((key: string) => 
          key.replace(storageKeyPrefix, '')
        );
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
        return [];
      }
    },
    
    // Clear all module's storage
    async clear(): Promise<void> {
      try {
        const keys = await this.keys();
        for (const key of keys) {
          await this.removeItem(key);
        }
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    }
  };
}

/**
 * Creates a sandboxed fetch API for a module
 */
function createSandboxedFetch(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasNetworkReadPermission = permissions.includes('network:read');
  const hasNetworkWritePermission = permissions.includes('network:write');
  
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Check permissions based on HTTP method
    const method = options.method?.toUpperCase() || 'GET';
    
    if (['GET', 'HEAD'].includes(method)) {
      if (!hasNetworkReadPermission) {
        throw new Error(`Module ${moduleId} does not have network:read permission`);
      }
    } else {
      if (!hasNetworkWritePermission) {
        throw new Error(`Module ${moduleId} does not have network:write permission`);
      }
    }
    
    // Prevent access to internal endpoints
    const urlObj = new URL(url, window.location.origin);
    
    // Block requests to sensitive domains
    const blockedDomains = [
      'localhost',
      '127.0.0.1',
      'internal.lythra.com'
    ];
    
    if (blockedDomains.includes(urlObj.hostname)) {
      throw new Error(`Access to ${urlObj.hostname} is not allowed`);
    }
    
    // Block requests to sensitive endpoints
    const blockedPaths = [
      '/api/auth',
      '/api/admin',
      '/api/internal'
    ];
    
    if (blockedPaths.some(path => urlObj.pathname.startsWith(path))) {
      throw new Error(`Access to ${urlObj.pathname} is not allowed`);
    }
    
    // Add a custom header to identify the module
    const headers = new Headers(options.headers);
    headers.append('X-Lythra-Module-ID', moduleId);
    
    // Make the actual fetch request
    try {
      return await fetch(url, {
        ...options,
        headers
      });
    } catch (error) {
      console.error(`Network error in module ${moduleId}:`, error);
      throw error;
    }
  };
}

/**
 * Creates a sandboxed audio API for a module
 */
function createSandboxedAudio(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasAudioPermission = permissions.includes('audio:play');
  
  // Map to track audio elements created by this module
  const audioElements = new Map<string, HTMLAudioElement>();
  
  return {
    // Create and play a sound
    async playSound(
      source: string, 
      options: { volume?: number; loop?: boolean; id?: string } = {}
    ): Promise<string> {
      if (!hasAudioPermission) {
        throw new Error(`Module ${moduleId} does not have audio:play permission`);
      }
      
      const id = options.id || `${moduleId}-audio-${Date.now()}`;
      
      // Check for existing audio element with this ID
      if (audioElements.has(id)) {
        // Stop existing audio before creating a new one
        const existing = audioElements.get(id)!;
        existing.pause();
        existing.remove();
      }
      
      // Create a new audio element
      const audio = new Audio(source);
      audio.volume = options.volume ?? 1.0;
      audio.loop = options.loop ?? false;
      
      // Store in our map
      audioElements.set(id, audio);
      
      // Set up cleanup when audio finishes
      audio.addEventListener('ended', () => {
        if (!options.loop) {
          audioElements.delete(id);
          audio.remove();
        }
      });
      
      try {
        await audio.play();
        return id;
      } catch (error) {
        console.error(`Audio error in module ${moduleId}:`, error);
        audioElements.delete(id);
        throw error;
      }
    },
    
    // Stop a sound by ID
    stopSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audioElements.delete(id);
        audio.remove();
      }
    },
    
    // Pause a sound by ID
    pauseSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.pause();
      }
    },
    
    // Resume a sound by ID
    resumeSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.play().catch(error => {
          console.error(`Audio resume error in module ${moduleId}:`, error);
        });
      }
    },
    
    // Set volume for a sound
    setVolume(id: string, volume: number): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    },
    
    // Stop all sounds created by this module
    stopAllSounds(): void {
      audioElements.forEach((audio, id) => {
        audio.pause();
        audio.remove();
      });
      audioElements.clear();
    }
  };
}

/**
 * Creates a sandboxed notification API for a module
 */
function createSandboxedNotifications(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasNotificationPermission = permissions.includes('notifications:create');
  
  return {
    // Request notification permission
    async requestPermission(): Promise<boolean> {
      if (!hasNotificationPermission) {
        throw new Error(`Module ${moduleId} does not have notifications:create permission`);
      }
      
      if (!('Notification' in window)) {
        return false;
      }
      
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error(`Notification permission error in module ${moduleId}:`, error);
        return false;
      }
    },
    
    // Show a notification
    async showNotification(
      title: string, 
      options: NotificationOptions = {}
    ): Promise<string | null> {
      if (!hasNotificationPermission) {
        throw new Error(`Module ${moduleId} does not have notifications:create permission`);
      }
      
      if (!('Notification' in window)) {
        return null;
      }
      
      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) return null;
      }
      
      try {
        // Add module info to notification
        const moduleOptions = {
          ...options,
          tag: options.tag || `lythra-${moduleId}-${Date.now()}`,
          data: {
            ...options.data,
            moduleId,
          },
        };
        
        const notification = new Notification(title, moduleOptions);
        return moduleOptions.tag;
      } catch (error) {
        console.error(`Notification error in module ${moduleId}:`, error);
        return null;
      }
    },
    
    // Close a notification
    closeNotification(tag: string): void {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'close-notification',
          tag,
          moduleId,
        });
      }
    }
  };
}

/**
 * Creates a complete sandbox environment for a module
 */
export function createModuleSandbox(
  moduleId: string, 
  permissions: ModulePermission[] = []
) {
  return {
    storage: createSandboxedStorage(moduleId),
    fetch: createSandboxedFetch(moduleId, permissions),
    audio: createSandboxedAudio(moduleId, permissions),
    notifications: createSandboxedNotifications(moduleId, permissions),
    permissions,
    moduleId,
  };
}

// Export the sandbox types
export type ModuleStorage = ReturnType<typeof createSandboxedStorage>;
export type ModuleFetch = ReturnType<typeof createSandboxedFetch>;
export type ModuleAudio = ReturnType<typeof createSandboxedAudio>;
export type ModuleNotifications = ReturnType<typeof createSandboxedNotifications>;
export type ModuleSandbox = ReturnType<typeof createModuleSandbox>;
```

**Explanation**:
- Creates a sandboxed environment for each module
- Implements permission-based API restrictions
- Provides isolated storage using IndexedDB
- Includes controlled network access with security checks
- Adds audio API with proper resource management
- Implements notification API with permissions
- Properly handles errors and resource cleanup

### Step 2: Create Module Context

Create `lib/modules/moduleContext.tsx` for React context:

```tsx
// lib/modules/moduleContext.tsx
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { ModuleProps } from '@/types/module';
import { createModuleSandbox, ModuleSandbox } from './moduleSandbox';
import { moduleRegistry } from './moduleRegistry';
import { eventBus } from '@/lib/events/eventBus';

// Context for providing sandbox to modules
interface ModuleContextValue {
  sandbox: ModuleSandbox;
}

const ModuleContext = createContext<ModuleContextValue | null>(null);

/**
 * Provider component that creates a sandboxed environment for a module
 */
export const ModuleProvider: React.FC<{
  moduleId: string;
  moduleType: string;
  children: React.ReactNode;
}> = ({ moduleId, moduleType, children }) => {
  const moduleDefinition = moduleRegistry.getDefinition(moduleType);
  
  // Create sandbox based on module permissions
  const sandbox = useMemo(() => {
    return createModuleSandbox(
      moduleId,
      moduleDefinition?.permissions || []
    );
  }, [moduleId, moduleDefinition]);
  
  // Emit module initialized event when mounted
  useEffect(() => {
    eventBus.emit(
      'module:initialized',
      { moduleId, moduleType },
      moduleId,
      moduleType
    );
    
    // Cleanup when unmounted
    return () => {
      // Stop all audio played by this module
      sandbox.audio.stopAllSounds();
    };
  }, [moduleId, moduleType, sandbox]);
  
  const contextValue: ModuleContextValue = { sandbox };
  
  return (
    <ModuleContext.Provider value={contextValue}>
      {children}
    </ModuleContext.Provider>
  );
};

/**
 * Hook to access module sandbox from within a module component
 */
export function useModuleSandbox(): ModuleSandbox {
  const context = useContext(ModuleContext);
  
  if (!context) {
    throw new Error('useModuleSandbox must be used within a ModuleProvider');
  }
  
  return context.sandbox;
}

/**
 * Higher-order component that wraps a module with its context provider
 */
export function withModuleContext<P extends ModuleProps>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => (
    <ModuleProvider moduleId={props.id} moduleType={props.id.split(':')[0]}>
      <Component {...props} />
    </ModuleProvider>
  );
}
```

**Explanation**:
- Creates a React context for module sandboxing
- Provides a provider component that initializes the sandbox
- Includes a custom hook for accessing the sandbox
- Implements a higher-order component for easy wrapping
- Handles module initialization and cleanup
- Emits events for module lifecycle management

### Step 3: Create Module Wrapper Component

Create `components/modules/ModuleWrapper.tsx` for the module UI container:

```tsx
// components/modules/ModuleWrapper.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useModuleSandbox } from '@/lib/modules/moduleContext';
import './ModuleWrapper.css';

interface ModuleWrapperProps {
  id: string;
  title: string;
  isEditing: boolean;
  onRemove: () => void;
  onSettings?: () => void;
  children: React.ReactNode;
  isFocused?: boolean;
  onFocus?: () => void;
}

export const ModuleWrapper: React.FC<ModuleWrapperProps> = ({
  id,
  title,
  isEditing,
  onRemove,
  onSettings,
  children,
  isFocused = false,
  onFocus,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sandbox = useModuleSandbox();
  
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && isEditing) {
      onRemove();
    } else if (e.key === 'Enter' && isEditing && onSettings) {
      onSettings();
    }
  };
  
  // Focus handling
  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };
  
  // Add resize observer to pass container dimensions to module
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const contentEl = wrapperRef.current.querySelector('.module-content');
    if (!contentEl) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Here we could pass dimensions to module if needed
      }
    });
    
    resizeObserver.observe(contentEl);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Use module ID for accessibility and targeting
  return (
    <div 
      ref={wrapperRef}
      className={`module-wrapper ${isEditing ? 'is-editing' : ''} ${isFocused ? 'is-focused' : ''}`}
      data-module-id={id}
      tabIndex={0}
      role="region"
      aria-label={`${title} module`}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <div className="module-header">
        <div className="module-title" id={`module-title-${id}`}>
          {title}
        </div>
        
        {isEditing && (
          <div className="module-actions" role="toolbar" aria-label="Module actions">
            {onSettings && (
              <button
                className="module-action-button"
                onClick={onSettings}
                aria-label="Module settings"
                title="Settings"
              >
                <span className="sr-only">Settings</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
              </button>
            )}
            <button
              className="module-action-button"
              onClick={onRemove}
              aria-label="Remove module"
              title="Remove"
            >
              <span className="sr-only">Remove</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div 
        className="module-content"
        aria-labelledby={`module-title-${id}`}
      >
        {children}
      </div>
      
      {isEditing && (
        <>
          <div 
            className="module-resize-handle"
            onMouseDown={() => setIsResizing(true)}
            onMouseUp={() => setIsResizing(false)}
            aria-hidden="true"
          />
          <div className="module-drag-handle" aria-hidden="true" />
        </>
      )}
    </div>
  );
};
```

Create the CSS file at `components/modules/ModuleWrapper.css`:

```css
/* components/modules/ModuleWrapper.css */
.module-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--module-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  position: relative;
  outline: none;
}

.module-wrapper:focus-visible {
  box-shadow: 0 0 0 2px #4299e1;
}

.module-wrapper.is-focused {
  box-shadow: 0 0 0 2px #4299e1, 0 4px 6px rgba(0, 0, 0, 0.1);
}

.module-wrapper.is-editing {
  cursor: move;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--module-header-bg-color, #f8f9fa);
  border-bottom: 1px solid var(--module-border-color, #e9ecef);
  user-select: none;
}

.module-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--module-title-color, #343a40);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-actions {
  display: flex;
  gap: 4px;
}

.module-action-button {
  background: none;
  border: none;
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--module-action-color, #6c757d);
  transition: background-color 0.2s, color 0.2s;
}

.module-action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--module-action-hover-color, #343a40);
}

.module-action-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.module-content {
  flex: 1;
  padding: 12px;
  overflow: auto;
  position: relative;
}

.module-resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%);
  border-radius: 0 0 8px 0;
}

.module-drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  cursor: move;
}

/* Screen reader only class for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .module-wrapper {
    --module-bg-color: #2d3748;
    --module-header-bg-color: #1a202c;
    --module-border-color: #4a5568;
    --module-title-color: #e2e8f0;
    --module-action-color: #a0aec0;
    --module-action-hover-color: #e2e8f0;
  }
}
```

**Explanation**:
- Accessible module container with ARIA attributes
- Support for keyboard navigation and focus management
- Includes handles for dragging and resizing when in edit mode
- Dark mode support with CSS variables
- SVG icons for better performance and scaling
- Screen reader support with hidden text

### Step 4: Create Dashboard Grid Component

Create `components/dashboard/DashboardGrid.tsx` for the layout system:

```tsx
// components/dashboard/DashboardGrid.tsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ModuleWrapper } from '@/components/modules/ModuleWrapper';
import { ModuleProvider } from '@/lib/modules/moduleContext';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { eventBus } from '@/lib/events/eventBus';
import './DashboardGrid.css';

// Enhanced react-grid-layout with width provider
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  dashboardId: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ dashboardId }) => {
  // Get dashboard state from Zustand store
  const { 
    dashboards, 
    isEditing, 
    updateModule, 
    removeModule, 
    updateModuleSettings 
  } = useDashboardStore();
  
  // State for focused module
  const [focusedModuleId, setFocusedModuleId] = useState<string | null>(null);
  
  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null);
  
  const dashboard = dashboards[dashboardId];
  
  // Handle case where dashboard doesn't exist
  if (!dashboard) {
    return (
      <div className="dashboard-grid-error">
        <h3>Dashboard not found</h3>
        <p>The dashboard you're looking for doesn't exist or has been deleted.</p>
      </div>
    );
  }

  // Convert modules to layout format for react-grid-layout
  const layouts = {
    lg: dashboard.modules.map((module) => ({
      i: module.id,
      x: module.position.x,
      y: module.position.y,
      w: module.size.width,
      h: module.size.height,
      minW: 1,
      minH: 1,
    })),
  };

  // Handle layout changes from dragging/resizing
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    layout.forEach((item) => {
      const moduleIndex = dashboard.modules.findIndex(
        (m) => m.id === item.i
      );
      
      if (moduleIndex >= 0) {
        updateModule(dashboardId, item.i, {
          position: { x: item.x, y: item.y },
          size: { width: item.w, height: item.h },
        });
      }
    });
    
    // Emit layout changed event
    eventBus.emit('dashboard:layout-changed', { layout, dashboardId });
  }, [dashboard.modules, dashboardId, updateModule]);
  
  // Handle module removal
  const handleRemoveModule = useCallback((moduleId: string) => {
    if (focusedModuleId === moduleId) {
      setFocusedModuleId(null);
    }
    removeModule(dashboardId, moduleId);
  }, [dashboardId, focusedModuleId, removeModule]);
  
  // Handle module settings change
  const handleModuleSettingsChange = useCallback((moduleId: string, newSettings: Record<string, any>) => {
    updateModuleSettings(dashboardId, moduleId, newSettings);
    
    // Emit settings changed event
    eventBus.emit(
      'module:settings-changed', 
      { settings: newSettings }, 
      moduleId
    );
  }, [dashboardId, updateModuleSettings]);
  
  // Handle keyboard navigation between modules
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEditing || !focusedModuleId) return;
    
    const focusedModule = dashboard.modules.find(m => m.id === focusedModuleId);
    if (!focusedModule) return;
    
    const { x, y } = focusedModule.position;
    let nextModuleId: string | null = null;
    
    switch (e.key) {
      case 'ArrowUp':
        // Find module above
        nextModuleId = dashboard.modules.find(
          m => m.position.y < y && 
               m.position.x <= x + focusedModule.size.width &&
               m.position.x + m.size.width > x
        )?.id || null;
        break;
      case 'ArrowDown':
        // Find module below
        nextModuleId = dashboard.modules.find(
          m => m.position.y > y && 
               m.position.x <= x + focusedModule.size.width &&
               m.position.x + m.size.width > x
        )?.id || null;
        break;
      case 'ArrowLeft':
        // Find module to the left
        nextModuleId = dashboard.modules.find(
          m => m.position.x < x && 
               m.position.y <= y + focusedModule.size.height &&
               m.position.y + m.size.height > y
        )?.id || null;
        break;
      case 'ArrowRight':
        // Find module to the right
        nextModuleId = dashboard.modules.find(
          m => m.position.x > x && 
               m.position.y <= y + focusedModule.size.height &&
               m.position.y + m.size.height > y
        )?.id || null;
        break;
    }
    
    if (nextModuleId) {
      e.preventDefault();
      setFocusedModuleId(nextModuleId);
      
      // Focus the module
      const moduleElement = document.querySelector(`[data-module-id="${nextModuleId}"]`);
      if (moduleElement instanceof HTMLElement) {
        moduleElement.focus();
      }
    }
  }, [dashboard.modules, focusedModuleId, isEditing]);
  
  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Emit edit mode changed event
  useEffect(() => {
    eventBus.emit('dashboard:edit-mode-changed', { isEditing });
  }, [isEditing]);

  return (
    <div 
      ref={gridRef}
      className="dashboard-grid-container"
      role="region"
      aria-label="Dashboard modules"
    >
      <ResponsiveGridLayout
        className={`dashboard-grid ${isEditing ? 'is-editing' : ''}`}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        compactType="vertical"
        useCSSTransforms={true}
      >
        {dashboard.modules.map((module) => {
          const moduleDefinition = moduleRegistry.getDefinition(module.type);
          
          if (!moduleDefinition) {
            // Fallback for unknown module types
            return (
              <div key={module.id} className="module-container">
                <ModuleWrapper
                  id={module.id}
                  title="Unknown Module"
                  isEditing={isEditing}
                  onRemove={() => handleRemoveModule(module.id)}
                  isFocused={focusedModuleId === module.id}
                  onFocus={() => setFocusedModuleId(module.id)}
                >
                  <div className="unknown-module-message">
                    <p>Unknown module type: {module.type}</p>
                    <p>This module may have been removed or is from a newer version.</p>
                  </div>
                </ModuleWrapper>
              </div>
            );
          }
          
          const ModuleComponent = moduleDefinition.Component;
          
          return (
            <div key={module.id} className="module-container">
              <ModuleProvider moduleId={module.id} moduleType={module.type}>
                <ModuleWrapper
                  id={module.id}
                  title={moduleDefinition.name}
                  isEditing={isEditing}
                  onRemove={() => handleRemoveModule(module.id)}
                  isFocused={focusedModuleId === module.id}
                  onFocus={() => setFocusedModuleId(module.id)}
                >
                  <ModuleComponent
                    id={module.id}
                    settings={module.settings}
                    onSettingsChange={(newSettings) => 
                      handleModuleSettingsChange(module.id, newSettings)
                    }
                    isEditing={isEditing}
                    containerWidth={0} /* Will be measured by ModuleWrapper */
                    containerHeight={0} /* Will be measured by ModuleWrapper */
                  />
                </ModuleWrapper>
              </ModuleProvider>
            </div>
          );
        })}
      </ResponsiveGridLayout>
      
      {dashboard.modules.length === 0 && (
        <div className="empty-dashboard-message">
          <h3>This dashboard is empty</h3>
          {isEditing ? (
            <p>Click "Add Module" in the sidebar to add your first module.</p>
          ) : (
            <p>Click "Edit Dashboard" to start adding modules.</p>
          )}
        </div>
      )}
    </div>
  );
};
```

Create the CSS file at `components/dashboard/DashboardGrid.css`:

```css
/* components/dashboard/DashboardGrid.css */
.dashboard-grid-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--dashboard-bg-color, #f8f9fa);
  transition: background-color 0.2s;
}

.dashboard-grid {
  min-height: 600px;
}

.dashboard-grid.is-editing .react-grid-item {
  transition: left 0.2s, top 0.2s, width 0.2s, height 0.2s;
}

.react-grid-item {
  transition: transform 0.2s;
}

.react-grid-item.react-grid-placeholder {
  background: rgba(63, 81, 181, 0.2);
  border: 1px dashed #3f51b5;
  border-radius: 8px;
  z-index: 2;
}

.react-grid-item.react-draggable-dragging {
  z-index: 3;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.react-grid-item.resizing {
  z-index: 3;
}

.module-container {
  width: 100%;
  height: 100%;
}

.unknown-module-message {
  padding: 16px;
  text-align: center;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.dashboard-grid-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
  text-align: center;
}

.empty-dashboard-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  color: var(--text-muted-color, #6c757d);
}

.empty-dashboard-message h3 {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color, #343a40);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .dashboard-grid-container {
    --dashboard-bg-color: #1a202c;
    --text-color: #e2e8f0;
    --text-muted-color: #a0aec0;
  }
  
  .unknown-module-message {
    color: #f8d7da;
    background-color: #582a30;
    border-color: #75373e;
  }
}
```

**Explanation**:
- Implements responsive grid layout with proper accessibility
- Uses keyboard navigation between modules
- Provides feedback for empty dashboards and errors
- Properly handles unknown module types
- Implements module focus management
- Includes dark mode support
- Emits events for dashboard and module changes

### Step 5: Create Module Palette Component

Create `components/dashboard/ModulePalette.tsx` for module selection:

```tsx
// components/dashboard/ModulePalette.tsx
import React, { useState, useMemo } from 'react';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import './ModulePalette.css';

interface ModulePaletteProps {
  dashboardId: string;
}

export const ModulePalette: React.FC<ModulePaletteProps> = ({ dashboardId }) => {
  const { isEditing, addModule } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get module definitions grouped by category
  const modulesByCategory = useMemo(() => {
    return moduleRegistry.getModulesByCategory();
  }, []);
  
  // Get all categories
  const categories = useMemo(() => {
    return Object.keys(modulesByCategory).sort();
  }, [modulesByCategory]);
  
  // Filter modules based on search query and selected category
  const filteredModules = useMemo(() => {
    const result: Record<string, typeof modulesByCategory[string]> = {};
    
    Object.entries(modulesByCategory).forEach(([category, modules]) => {
      // Skip if category doesn't match selected category (unless no category is selected)
      if (selectedCategory !== null && category !== selectedCategory) {
        return;
      }
      
      // Filter by search query
      const filteredModulesInCategory = modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredModulesInCategory.length > 0) {
        result[category] = filteredModulesInCategory;
      }
    });
    
    return result;
  }, [modulesByCategory, searchQuery, selectedCategory]);
  
  // Handle adding a module to the dashboard
  const handleAddModule = (moduleType: string) => {
    addModule(dashboardId, moduleType);
  };
  
  // Don't render if not in edit mode
  if (!isEditing) {
    return null;
  }

  return (
    <div 
      className="module-palette"
      role="region"
      aria-label="Available modules"
    >
      <div className="module-palette-header">
        <h3 className="module-palette-title">Add Modules</h3>
        
        <div className="module-palette-search">
          <input
            type="search"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search modules"
            className="module-search-input"
          />
        </div>
      </div>
      
      <div className="module-palette-categories">
        <button
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="module-palette-content">
        {Object.keys(filteredModules).length === 0 ? (
          <div className="no-modules-message">
            <p>No modules found matching your search.</p>
          </div>
        ) : (
          Object.entries(filteredModules).map(([category, modules]) => (
            <div key={category} className="module-category">
              <h4 className="category-title">{category}</h4>
              
              <div className="module-list">
                {modules.map((moduleDefinition) => (
                  <button
                    key={moduleDefinition.type}
                    className="module-item"
                    onClick={() => handleAddModule(moduleDefinition.type)}
                    aria-label={`Add ${moduleDefinition.name} module`}
                  >
                    <div className="module-icon">
                      {moduleDefinition.icon || '📦'}
                    </div>
                    
                    <div className="module-info">
                      <div className="module-name">
                        {moduleDefinition.name}
                      </div>
                      
                      <div className="module-description">
                        {moduleDefinition.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

Create the CSS file at `components/dashboard/ModulePalette.css`:

```css
/* components/dashboard/ModulePalette.css */
.module-palette {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--palette-bg-color, #ffffff);
  border-right: 1px solid var(--palette-border-color, #e9ecef);
  overflow: hidden;
}

.module-palette-header {
  padding: 16px;
  border-bottom: 1px solid var(--palette-border-color, #e9ecef);
}

.module-palette-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--heading-color, #212529);
}

.module-palette-search {
  margin-bottom: 8px;
}

.module-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--input-border-color, #ced4da);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--input-bg-color, #ffffff);
  color: var(--text-color, #343a40);
  transition: border-color 0.2s;
}

.module-search-input:focus {
  border-color: #4299e1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.module-palette-categories {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 8px 16px;
  border-bottom: 1px solid var(--palette-border-color, #e9ecef);
  gap: 8px;
}

.category-button {
  flex: 0 0 auto;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  background-color: var(--category-bg-color, #f8f9fa);
  color: var(--text-color, #343a40);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.category-button.active {
  background-color: var(--category-active-bg-color, #4299e1);
  color: white;
}

.category-button:hover:not(.active) {
  background-color: var(--category-hover-bg-color, #e9ecef);
}

.category-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.module-palette-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.module-category {
  margin-bottom: 24px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted-color, #6c757d);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--module-item-border-color, #e9ecef);
  border-radius: 6px;
  background-color: var(--module-item-bg-color, #ffffff);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  text-align: left;
}

.module-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  background-color: var(--module-item-hover-bg-color, #f8f9fa);
}

.module-item:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--module-icon-bg-color, #f8f9fa);
  color: var(--module-icon-color, #4a5568);
}

.module-info {
  flex: 1;
  min-width: 0; /* Needed for text-overflow to work */
}

.module-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-color, #343a40);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.module-description {
  font-size: 12px;
  color: var(--text-muted-color, #6c757d);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.no-modules-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted-color, #6c757d);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .module-palette {
    --palette-bg-color: #2d3748;
    --palette-border-color: #4a5568;
    --heading-color: #e2e8f0;
    --text-color: #e2e8f0;
    --text-muted-color: #a0aec0;
    --input-bg-color: #1a202c;
    --input-border-color: #4a5568;
    --category-bg-color: #1a202c;
    --category-hover-bg-color: #2d3748;
    --category-active-bg-color: #4299e1;
    --module-item-bg-color: #1a202c;
    --module-item-border-color: #4a5568;
    --module-item-hover-bg-color: #2d3748;
    --module-icon-bg-color: #2d3748;
    --module-icon-color: #a0aec0;
  }
}
```

**Explanation**:
- Implements a searchable and filterable module palette
- Supports categorization of modules
- Provides accessible buttons and controls
- Shows empty state for no search results
- Implements keyboard navigation
- Includes dark mode support
- Uses properly structured CSS with variables

### Step 6: Create Dashboard Page Component

Create `components/dashboard/DashboardPage.tsx` for the main dashboard view:

```tsx
// components/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '@/lib/stores/