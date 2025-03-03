// src/types/module.ts
import { ReactNode } from 'react';
import { z } from 'zod';
import { Json } from './common';

/**
 * Module position in the dashboard grid
 */
export interface ModulePosition {
  x: number;
  y: number;
}

/**
 * Module size in the dashboard grid
 */
export interface ModuleSize {
  width: number;
  height: number;
}

/**
 * Module permissions for security sandboxing
 */
export type ModulePermission = 
  | 'storage:read' 
  | 'storage:write' 
  | 'network:read' 
  | 'network:write' 
  | 'audio:play'
  | 'notifications:create';

/**
 * Base module configuration
 */
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

/**
 * Definition of a module type in the registry
 */
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

/**
 * Props passed to each module component
 */
export interface ModuleProps {
  id: string;
  settings: Record<string, Json>;
  isEditing: boolean;
  onSettingsChange: (newSettings: Record<string, Json>) => void;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Dashboard state
 */
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

/**
 * Module event types for the event bus
 */
export type ModuleEventType = 
  | 'module:initialized'
  | 'module:settings-changed'
  | 'module:state-changed'
  | 'module:error'
  | 'dashboard:layout-changed'
  | 'dashboard:edit-mode-changed';

/**
 * Module event structure
 */
export interface ModuleEvent {
  type: ModuleEventType;
  moduleId?: string;
  moduleType?: string;
  payload?: unknown;
  timestamp: number;
} 