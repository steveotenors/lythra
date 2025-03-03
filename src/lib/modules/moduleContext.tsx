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
  // Create a named function with descriptive displayName
  const WithModuleContext: React.FC<P> = (props) => {
    // Extract module type from ID (format is typically "type:instance")
    let moduleType = props.id;
    const idParts = props.id.split(':');
    if (idParts.length > 0 && idParts[0]) {
      moduleType = idParts[0];
    }
    
    return (
      <ModuleProvider moduleId={props.id} moduleType={moduleType}>
        <Component {...props} />
      </ModuleProvider>
    );
  };
  
  // Set displayName for better debugging
  WithModuleContext.displayName = `WithModuleContext(${getDisplayName(Component)})`;
  
  return WithModuleContext;
}

/**
 * Helper function to get a component's display name
 */
function getDisplayName<P>(Component: React.ComponentType<P>): string {
  return Component.displayName || Component.name || 'Component';
} 