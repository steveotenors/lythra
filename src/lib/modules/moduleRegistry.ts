import { ModuleConfig, ModuleDefinition, ModuleSize } from '@/types/module';
import { eventBus } from '../events/eventBus';
import { moduleAtomsRegistry } from './moduleAtomsRegistry';

/**
 * Registry for module definitions and instances
 * 
 * This registry is responsible for:
 * - Storing and retrieving module definitions
 * - Creating module instances with proper configuration
 * - Managing module lifecycle events
 * - Providing utilities for working with modules
 */
class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();
  private instances: Map<string, ModuleConfig> = new Map();
  
  /**
   * Register a module definition
   * 
   * @param {ModuleDefinition} definition - The module definition to register
   * @throws {Error} If a module with the same type is already registered
   */
  registerModule(definition: ModuleDefinition): void {
    if (this.modules.has(definition.type)) {
      throw new Error(`Module type '${definition.type}' is already registered`);
    }
    
    this.modules.set(definition.type, definition);
    
    // Log registration for debugging
    console.log(`Module registered: ${definition.type} (v${definition.version})`);
    
    // Emit module registration event
    eventBus.emit(
      'module:initialized',
      { version: definition.version },
      undefined,
      definition.type
    );
  }
  
  /**
   * Get a module definition by type
   * 
   * @param {string} type - The module type to retrieve
   * @returns {ModuleDefinition | undefined} The module definition or undefined if not found
   */
  getDefinition(type: string): ModuleDefinition | undefined {
    return this.modules.get(type);
  }
  
  /**
   * Get all registered module definitions
   * 
   * @returns {ModuleDefinition[]} Array of all registered module definitions
   */
  getAllDefinitions(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get definitions by category
   * 
   * @param {string} category - The category to filter by
   * @returns {ModuleDefinition[]} Array of module definitions in the specified category
   */
  getDefinitionsByCategory(category: string): ModuleDefinition[] {
    return this.getAllDefinitions().filter(def => def.category === category);
  }

  /**
   * Check if a module type is registered
   * 
   * @param {string} type - The module type to check
   * @returns {boolean} True if the module type is registered
   */
  hasModule(type: string): boolean {
    return this.modules.has(type);
  }
  
  /**
   * Create a new module configuration based on a module definition
   * 
   * @param {string} type - The type of module to create
   * @param {Partial<ModuleConfig>} [overrides] - Optional overrides for the default configuration
   * @returns {ModuleConfig} The new module configuration
   * @throws {Error} If the module type is not registered
   */
  createModuleConfig(type: string, overrides?: Partial<ModuleConfig>): ModuleConfig {
    const definition = this.getDefinition(type);
    
    if (!definition) {
      throw new Error(`Module type '${type}' is not registered`);
    }
    
    const now = new Date().toISOString();
    const id = overrides?.id || `${type}-${Date.now()}`;
    
    const config: ModuleConfig = {
      id,
      type,
      version: definition.version,
      position: overrides?.position || { x: 0, y: 0 },
      size: overrides?.size || definition.defaultSize,
      settings: overrides?.settings || { ...definition.defaultSettings },
      createdAt: overrides?.createdAt || now,
      updatedAt: overrides?.updatedAt || now
    };
    
    // Store the instance
    this.instances.set(id, config);
    
    return config;
  }
  
  /**
   * Update an existing module configuration
   * 
   * @param {string} id - The ID of the module to update
   * @param {Partial<ModuleConfig>} updates - The updates to apply
   * @returns {ModuleConfig | undefined} The updated configuration or undefined if not found
   */
  updateModuleConfig(id: string, updates: Partial<ModuleConfig>): ModuleConfig | undefined {
    const existing = this.instances.get(id);
    
    if (!existing) {
      return undefined;
    }
    
    const updated: ModuleConfig = {
      ...existing,
      ...updates,
      // Always update the timestamp
      updatedAt: new Date().toISOString()
    };
    
    // Preserve the original ID, type, and creation date
    updated.id = existing.id;
    updated.type = existing.type;
    updated.createdAt = existing.createdAt;
    
    // Store the updated instance
    this.instances.set(id, updated);
    
    // If there's a version change, handle migration
    if (updates.version && updates.version !== existing.version) {
      this.migrateModuleSettings(id, existing.version, updates.version);
    }
    
    // Emit update event
    eventBus.emit(
      'module:settings-changed',
      updated,
      id,
      existing.type
    );
    
    return updated;
  }
  
  /**
   * Get an instance by ID
   * 
   * @param {string} id - The ID of the module instance
   * @returns {ModuleConfig | undefined} The module configuration or undefined if not found
   */
  getInstance(id: string): ModuleConfig | undefined {
    return this.instances.get(id);
  }
  
  /**
   * Remove a module instance
   * 
   * @param {string} id - The ID of the module to remove
   * @returns {boolean} True if the module was removed, false if it wasn't found
   */
  removeInstance(id: string): boolean {
    const instance = this.instances.get(id);
    
    if (!instance) {
      return false;
    }
    
    // Clean up any atoms associated with this module
    moduleAtomsRegistry.removeModuleAtoms(instance.type, id);
    
    // Remove the instance
    return this.instances.delete(id);
  }
  
  /**
   * Migrate module settings when upgrading to a new version
   * 
   * @param {string} id - The ID of the module to migrate
   * @param {string} oldVersion - The old version
   * @param {string} newVersion - The new version
   * @returns {boolean} True if migration was performed, false if not needed
   */
  private migrateModuleSettings(id: string, oldVersion: string, newVersion: string): boolean {
    const instance = this.instances.get(id);
    
    if (!instance) {
      return false;
    }
    
    const definition = this.getDefinition(instance.type);
    
    if (!definition || !definition.migrationStrategy) {
      return false;
    }
    
    try {
      // Apply the migration strategy
      const migratedSettings = definition.migrationStrategy(
        instance.settings,
        oldVersion,
        newVersion
      );
      
      // Update the instance with the migrated settings
      instance.settings = migratedSettings;
      instance.version = newVersion;
      
      // Store the updated instance
      this.instances.set(id, instance);
      
      return true;
    } catch (error) {
      console.error(`Failed to migrate module ${id} from v${oldVersion} to v${newVersion}:`, error);
      return false;
    }
  }
  
  /**
   * Calculate the recommended size for a module based on available space
   * 
   * @param {string} type - The module type
   * @param {number} availableWidth - Available width in grid units
   * @param {number} availableHeight - Available height in grid units
   * @returns {ModuleSize} The recommended size
   */
  getRecommendedSize(type: string, availableWidth: number, availableHeight: number): ModuleSize {
    const definition = this.getDefinition(type);
    
    if (!definition) {
      return { width: 2, height: 2 }; // Default fallback
    }
    
    const { width, height } = definition.defaultSize;
    
    return {
      width: Math.min(width, availableWidth),
      height: Math.min(height, availableHeight)
    };
  }
  
  /**
   * Get category distribution of registered modules
   * 
   * @returns {Record<string, number>} Map of category names to counts
   */
  getCategoryDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    this.getAllDefinitions().forEach(def => {
      distribution[def.category] = (distribution[def.category] || 0) + 1;
    });
    
    return distribution;
  }
  
  /**
   * Clear all registered modules (useful for testing)
   */
  clearAllModules(): void {
    this.modules.clear();
    this.instances.clear();
  }
}

// Create and export a singleton instance
export const moduleRegistry = new ModuleRegistry(); 