// src/lib/utils/moduleUtils.ts
import { nanoid } from 'nanoid';
import { 
  ModuleConfig, 
  ModuleDefinition, 
  ModuleSize, 
  ModulePosition 
} from '@/types/module';

/**
 * Creates a new module configuration
 * 
 * @param {string} moduleType - The type of module to create
 * @param {ModuleDefinition} moduleDefinition - The module definition from the registry
 * @param {ModulePosition} position - The position on the grid (defaults to 0,0)
 * @returns {ModuleConfig} A complete module configuration
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
 * 
 * @param {ModuleConfig[]} existingModules - Current modules on the dashboard
 * @param {ModuleSize} newSize - Size of the new module
 * @param {number} gridCols - Total columns in the grid
 * @returns {ModulePosition} The next available position
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
 * 
 * @param {Record<string, unknown>} settings - The settings to validate
 * @param {ModuleDefinition} moduleDefinition - The module definition with schema
 * @returns {object} Validation result with success status and optional errors
 */
export function validateModuleSettings(
  settings: Record<string, unknown>,
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
 * 
 * @param {string} currentVersion - The current version to check
 * @param {string[]} compatibleWith - List of compatible versions
 * @returns {boolean} True if the versions are compatible
 */
export function areVersionsCompatible(
  currentVersion: string,
  compatibleWith: string[]
): boolean {
  // Simple implementation - in reality, would use semver
  return compatibleWith.includes(currentVersion) || compatibleWith.includes('*');
} 