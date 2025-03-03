import { atom } from 'jotai';

/**
 * Type for atom creator functions
 */
type ModuleAtomCreator<T> = (moduleId: string) => T;

/**
 * Registry to manage Jotai atoms for different module types
 * 
 * This registry ensures that:
 * - Atoms are created only once per module instance
 * - Atoms are properly isolated between module instances
 * - Module types can register their atom creators
 */
class ModuleAtomsRegistry {
  private atomCreators: Map<string, ModuleAtomCreator<any>> = new Map();
  private moduleAtoms: Map<string, any> = new Map();
  
  /**
   * Register an atom creator for a module type
   * 
   * @param {string} moduleType - The type of module to register atoms for
   * @param {ModuleAtomCreator<T>} creator - Function that creates atoms for this module type
   */
  registerAtomCreator<T>(moduleType: string, creator: ModuleAtomCreator<T>): void {
    if (this.atomCreators.has(moduleType)) {
      console.warn(`Atom creator for module type ${moduleType} is already registered. Overwriting...`);
    }
    
    this.atomCreators.set(moduleType, creator);
  }
  
  /**
   * Get or create atoms for a specific module instance
   * 
   * @param {string} moduleType - The type of module to get atoms for
   * @param {string} moduleId - The unique ID of the module instance
   * @returns {T} The atoms for this module instance
   * @throws {Error} If no atom creator is registered for this module type
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
   * 
   * @param {string} moduleType - The type of module to check
   * @param {string} moduleId - The unique ID of the module instance
   * @returns {boolean} True if atoms exist for this module
   */
  hasModuleAtoms(moduleType: string, moduleId: string): boolean {
    return this.moduleAtoms.has(`${moduleType}:${moduleId}`);
  }
  
  /**
   * Remove atoms for a module (cleanup)
   * 
   * @param {string} moduleType - The type of module to remove atoms for
   * @param {string} moduleId - The unique ID of the module instance to remove atoms for
   */
  removeModuleAtoms(moduleType: string, moduleId: string): void {
    this.moduleAtoms.delete(`${moduleType}:${moduleId}`);
  }
  
  /**
   * Get all registered module types
   * 
   * @returns {string[]} Array of registered module types
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
 * Base atoms interface that all modules should extend
 */
export interface BaseModuleAtoms {
  isActiveAtom: ReturnType<typeof atom<boolean>>;
  errorAtom: ReturnType<typeof atom<string | null>>;
  isLoadingAtom: ReturnType<typeof atom<boolean>>;
  lastUpdatedAtom: ReturnType<typeof atom<number | null>>;
}

/**
 * Create base atoms that all modules can use
 * 
 * @param {string} moduleId - The unique ID of the module instance
 * @returns {BaseModuleAtoms} The base atoms for this module instance
 */
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