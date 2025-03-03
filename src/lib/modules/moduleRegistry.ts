import { ModuleDefinition } from '@/types/module';

/**
 * Registry for module definitions
 * 
 * This is a temporary placeholder that will be fully implemented
 * in a later step of the playbook.
 */
class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();
  
  /**
   * Get a module definition by type
   * 
   * @param {string} type - The module type to retrieve
   * @returns {ModuleDefinition | undefined} The module definition or undefined if not found
   */
  getDefinition(type: string): ModuleDefinition | undefined {
    return this.modules.get(type);
  }
}

// Create and export a singleton instance
export const moduleRegistry = new ModuleRegistry(); 