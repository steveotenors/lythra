// src/components/dashboard/ModulePalette/ModulePalette.tsx
import React, { useState, useMemo } from 'react';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { ModuleDefinition } from '@/types/module';
import './ModulePalette.css';

/**
 * ModulePalette component for selecting and adding modules to the dashboard.
 * 
 * Provides a searchable, categorized interface to add modules to dashboards.
 * 
 * @param {ModulePaletteProps} props - The component props
 * @returns {React.ReactElement | null} The ModulePalette component or null if not in edit mode
 */
interface ModulePaletteProps {
  /**
   * ID of the dashboard to add modules to
   */
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
    const result: Record<string, ModuleDefinition[]> = {};
    
    Object.entries(modulesByCategory).forEach(([category, modules]) => {
      // Skip if category doesn't match selected category (unless no category is selected)
      if (selectedCategory !== null && category !== selectedCategory) {
        return;
      }
      
      // Filter by search query
      const filteredModulesInCategory = modules.filter((module: ModuleDefinition) =>
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
          aria-pressed={selectedCategory === null}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="module-palette-content">
        {Object.keys(filteredModules).length === 0 ? (
          <div className="no-modules-message" aria-live="polite">
            <p>No modules found matching your search.</p>
          </div>
        ) : (
          Object.entries(filteredModules).map(([category, modules]) => (
            <div key={category} className="module-category">
              <h4 className="category-title" id={`category-${category}`}>{category}</h4>
              
              <div 
                className="module-list" 
                role="list" 
                aria-labelledby={`category-${category}`}
              >
                {modules.map((moduleDefinition: ModuleDefinition) => (
                  <button
                    key={moduleDefinition.type}
                    className="module-item"
                    onClick={() => handleAddModule(moduleDefinition.type)}
                    aria-label={`Add ${moduleDefinition.name} module`}
                    role="listitem"
                  >
                    <div className="module-icon" aria-hidden="true">
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