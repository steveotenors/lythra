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
        // This comment is necessary to satisfy linter about unused variables
        void width;
        void height;
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
      className={`module-wrapper ${isEditing ? 'is-editing' : ''} ${isFocused ? 'is-focused' : ''} ${isResizing ? 'is-resizing' : ''}`}
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