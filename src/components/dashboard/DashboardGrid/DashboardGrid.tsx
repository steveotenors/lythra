import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ModuleWrapper } from '@/components/modules/ModuleWrapper';
import { ModuleProvider } from '@/lib/modules/moduleContext';
import { moduleRegistry } from '@/lib/modules/moduleRegistry';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { eventBus } from '@/lib/events/eventBus';
import { Json } from '@/types/common';
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
  
  // Initialize all hooks at the top level unconditionally
  // Handle layout changes from dragging/resizing
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    if (!dashboard) return;
    
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
  }, [dashboard, dashboardId, updateModule]);
  
  // Handle module removal
  const handleRemoveModule = useCallback((moduleId: string) => {
    if (!dashboard) return;
    
    if (focusedModuleId === moduleId) {
      setFocusedModuleId(null);
    }
    removeModule(dashboardId, moduleId);
  }, [dashboard, dashboardId, focusedModuleId, removeModule]);
  
  // Handle module settings change
  const handleModuleSettingsChange = useCallback((moduleId: string, newSettings: Record<string, Json>) => {
    if (!dashboard) return;
    
    updateModuleSettings(dashboardId, moduleId, newSettings);
    
    // Emit settings changed event
    eventBus.emit(
      'module:settings-changed', 
      { settings: newSettings }, 
      moduleId
    );
  }, [dashboard, dashboardId, updateModuleSettings]);
  
  // Handle keyboard navigation between modules
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!dashboard || !isEditing || !focusedModuleId) return;
    
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
      default:
        // Do nothing for other keys
        return;
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
  }, [dashboard, focusedModuleId, isEditing]);
  
  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Emit edit mode changed event
  useEffect(() => {
    eventBus.emit('dashboard:edit-mode-changed', { isEditing });
  }, [isEditing]);

  // Handle case where dashboard doesn't exist
  if (!dashboard) {
    return (
      <div 
        className="dashboard-grid-error"
        role="alert"
        aria-live="assertive"
      >
        <h3>Dashboard not found</h3>
        <p>The dashboard you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
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

  return (
    <div 
      ref={gridRef}
      className="dashboard-grid-container"
      role="region"
      aria-label="Dashboard modules grid"
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
                  <div 
                    className="unknown-module-message"
                    role="alert"
                  >
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
        <div 
          className="empty-dashboard-message"
          role="status"
          aria-live="polite"
        >
          <h3>This dashboard is empty</h3>
          {isEditing ? (
            <p>Click &quot;Add Module&quot; in the sidebar to add your first module.</p>
          ) : (
            <p>Click &quot;Edit Dashboard&quot; to start adding modules.</p>
          )}
        </div>
      )}
    </div>
  );
}; 