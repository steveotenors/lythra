# Ultimate Lythra Implementation Playbook (Continued)

Let's continue implementing the DashboardPage component:

```tsx
// components/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { useAppStore } from '@/lib/stores/appStore';
import { DashboardGrid } from './DashboardGrid';
import { ModulePalette } from './ModulePalette';
import { eventBus } from '@/lib/events/eventBus';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { 
    dashboards, 
    currentDashboardId, 
    createDashboard, 
    setCurrentDashboard,
    isEditing,
    setEditMode,
    isSaving
  } = useDashboardStore();
  
  const { isOnline } = useAppStore();
  
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Create a default dashboard if none exists
  useEffect(() => {
    const dashboardCount = Object.keys(dashboards).length;
    
    if (dashboardCount === 0) {
      const newId = createDashboard('My First Dashboard');
      setCurrentDashboard(newId);
    } else if (!currentDashboardId) {
      // Set the first dashboard as current if none is selected
      setCurrentDashboard(Object.keys(dashboards)[0]);
    }
  }, [dashboards, currentDashboardId, createDashboard, setCurrentDashboard]);
  
  // Exit edit mode when going offline to prevent unsaved changes
  useEffect(() => {
    if (!isOnline && isEditing) {
      setEditMode(false);
    }
  }, [isOnline, isEditing, setEditMode]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + E to toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setEditMode(!isEditing);
      }
      
      // Escape to exit edit mode
      if (e.key === 'Escape' && isEditing) {
        setEditMode(false);
      }
      
      // Ctrl/Cmd + ? to show help
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, setEditMode, showHelp]);
  
  // Get current dashboard
  const currentDashboard = currentDashboardId ? dashboards[currentDashboardId] : null;
  
  if (!currentDashboard) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-page ${isEditing ? 'is-editing' : ''}`}>
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">{currentDashboard.name}</h1>
          
          {isSaving && (
            <span className="saving-indicator" aria-live="polite">
              Saving...
            </span>
          )}
          
          {!isOnline && (
            <span className="offline-indicator" aria-live="polite">
              Offline
            </span>
          )}
        </div>
        
        <div className="dashboard-controls">
          <button
            className={`edit-toggle ${isEditing ? 'active' : ''}`}
            onClick={() => setEditMode(!isEditing)}
            aria-pressed={isEditing}
            disabled={!isOnline}
            title={isOnline ? "Edit Dashboard" : "Editing is disabled while offline"}
          >
            {isEditing ? 'Done Editing' : 'Edit Dashboard'}
          </button>
          
          <button
            className="help-button"
            onClick={() => setShowHelp(!showHelp)}
            aria-pressed={showHelp}
            title="Show Help"
          >
            <span className="sr-only">Help</span>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </header>
      
      <div className="dashboard-content">
        {isEditing && <ModulePalette dashboardId={currentDashboardId} />}
        <DashboardGrid dashboardId={currentDashboardId} />
      </div>
      
      {showHelp && (
        <div className="help-overlay">
          <div className="help-panel">
            <div className="help-header">
              <h2>Keyboard Shortcuts</h2>
              <button onClick={() => setShowHelp(false)} aria-label="Close help">
                ✕
              </button>
            </div>
            
            <div className="help-content">
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <span className="shortcut-keys">Ctrl/⌘ + E</span>
                  <span className="shortcut-description">Toggle edit mode</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">Escape</span>
                  <span className="shortcut-description">Exit edit mode</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">Ctrl/⌘ + ?</span>
                  <span className="shortcut-description">Show/hide this help panel</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">Arrow Keys</span>
                  <span className="shortcut-description">Navigate between modules (when a module is focused)</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">Delete</span>
                  <span className="shortcut-description">Remove the focused module (in edit mode)</span>
                </div>
              </div>
              
              <div className="help-section">
                <h3>Getting Started</h3>
                <ol>
                  <li>Click <strong>Edit Dashboard</strong> to enter edit mode</li>
                  <li>Add modules from the palette on the left</li>
                  <li>Drag modules to reposition them</li>
                  <li>Resize modules using the handle at the bottom-right corner</li>
                  <li>Click <strong>Done Editing</strong> when finished</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

Create the CSS file at `components/dashboard/DashboardPage.css`:

```css
/* components/dashboard/DashboardPage.css */
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--app-bg-color, #f8f9fa);
  color: var(--text-color, #343a40);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--header-bg-color, #ffffff);
  border-bottom: 1px solid var(--border-color, #e9ecef);
  z-index: 10;
}

.dashboard-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--heading-color, #212529);
}

.saving-indicator,
.offline-indicator {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.saving-indicator {
  background-color: #ebf8ff;
  color: #2b6cb0;
}

.offline-indicator {
  background-color: #fff5f5;
  color: #c53030;
}

.dashboard-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.edit-toggle {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  background-color: var(--button-bg-color, #f8f9fa);
  color: var(--button-text-color, #343a40);
  border: 1px solid var(--button-border-color, #ced4da);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.edit-toggle:hover:not(:disabled) {
  background-color: var(--button-hover-bg-color, #e9ecef);
}

.edit-toggle:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.edit-toggle.active {
  background-color: #4299e1;
  color: white;
  border-color: #4299e1;
}

.edit-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.help-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--icon-button-bg-color, transparent);
  border: 1px solid var(--button-border-color, #ced4da);
  color: var(--button-text-color, #343a40);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.help-button:hover {
  background-color: var(--icon-button-hover-bg-color, #f8f9fa);
}

.help-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.dashboard-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.dashboard-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  font-size: 16px;
  color: var(--text-muted-color, #6c757d);
}

.help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.help-panel {
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  background-color: var(--panel-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color, #e9ecef);
}

.help-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--heading-color, #212529);
}

.help-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted-color, #6c757d);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.help-header button:hover {
  background-color: var(--button-hover-bg-color, #f8f9fa);
}

.help-content {
  padding: 24px;
  overflow-y: auto;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shortcut-keys {
  font-family: monospace;
  background-color: var(--kbd-bg-color, #f8f9fa);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-color, #343a40);
  border: 1px solid var(--kbd-border-color, #e9ecef);
}

.shortcut-description {
  font-size: 14px;
  color: var(--text-color, #343a40);
}

.help-section {
  margin-top: 24px;
}

.help-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--heading-color, #212529);
}

.help-section ol {
  padding-left: 24px;
}

.help-section li {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-color, #343a40);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .dashboard-page {
    --app-bg-color: #1a202c;
    --header-bg-color: #2d3748;
    --text-color: #e2e8f0;
    --text-muted-color: #a0aec0;
    --heading-color: #f7fafc;
    --border-color: #4a5568;
    --button-bg-color: #2d3748;
    --button-text-color: #e2e8f0;
    --button-border-color: #4a5568;
    --button-hover-bg-color: #4a5568;
    --icon-button-hover-bg-color: #4a5568;
    --panel-bg-color: #2d3748;
    --kbd-bg-color: #4a5568;
    --kbd-border-color: #2d3748;
  }
  
  .saving-indicator {
    background-color: #2a4365;
    color: #90cdf4;
  }
  
  .offline-indicator {
    background-color: #742a2a;
    color: #fbd38d;
  }
}

/* Screen reader only */
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

/* Responsive Styles */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 20px;
  }
  
  .edit-toggle {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .help-button {
    width: 32px;
    height: 32px;
  }
}
```

## Phase 5: Module Implementation

### Step 1: Create a Metronome Module with Jotai

First, create the atom definitions at `lib/modules/metronome/metronomeAtoms.ts`:

```typescript
// lib/modules/metronome/metronomeAtoms.ts
import { atom } from 'jotai';
import { z } from 'zod';
import { atomWithStorage } from 'jotai/utils';
import { moduleAtomsRegistry, BaseModuleAtoms, createBaseModuleAtoms } from '@/lib/modules/moduleAtomsRegistry';
import { eventBus } from '@/lib/events/eventBus';

// Define the schema for metronome settings
export const metronomeSettingsSchema = z.object({
  tempo: z.number().min(20).max(300).default(120),
  timeSignature: z.object({
    beats: z.number().min(1).max(16).default(4),
    beatUnit: z.number().enum([2, 4, 8, 16]).default(4),
  }).default({ beats: 4, beatUnit: 4 }),
  soundEnabled: z.boolean().default(true),
  accentFirstBeat: z.boolean().default(true),
  volume: z.number().min(0).max(100).default(80),
});

// Type for metronome settings
export type MetronomeSettings = z.infer<typeof metronomeSettingsSchema>;

// Default settings
export const defaultMetronomeSettings: MetronomeSettings = {
  tempo: 120,
  timeSignature: { beats: 4, beatUnit: 4 },
  soundEnabled: true,
  accentFirstBeat: true,
  volume: 80,
};

// Type for Metronome module atoms
export interface MetronomeAtoms extends BaseModuleAtoms {
  tempoAtom: ReturnType<typeof atom<number>>;
  beatsAtom: ReturnType<typeof atom<number>>;
  beatUnitAtom: ReturnType<typeof atom<number>>;
  playingAtom: ReturnType<typeof atom<boolean>>;
  soundEnabledAtom: ReturnType<typeof atom<boolean>>;
  accentFirstBeatAtom: ReturnType<typeof atom<boolean>>;
  volumeAtom: ReturnType<typeof atom<number>>;
  currentBeatAtom: ReturnType<typeof atom<number>>;
  beatIntervalAtom: ReturnType<typeof atom<number>>;
  
  // Actions
  togglePlayAtom: ReturnType<typeof atom<boolean, [boolean | undefined], void>>;
  setTempoAtom: ReturnType<typeof atom<number, [number], void>>;
  incrementTempoAtom: ReturnType<typeof atom<void, [], void>>;
  decrementTempoAtom: ReturnType<typeof atom<void, [], void>>;
  resetAtom: ReturnType<typeof atom<void, [], void>>;
}

/**
 * Creates atoms for a metronome module instance
 */
export function createMetronomeAtoms(moduleId: string): MetronomeAtoms {
  // Get base atoms
  const baseAtoms = createBaseModuleAtoms(moduleId);
  
  // Create persistent atoms using localStorage
  const tempoAtom = atomWithStorage(`${moduleId}:tempo`, 120);
  const beatsAtom = atomWithStorage(`${moduleId}:beats`, 4);
  const beatUnitAtom = atomWithStorage(`${moduleId}:beatUnit`, 4);
  const soundEnabledAtom = atomWithStorage(`${moduleId}:soundEnabled`, true);
  const accentFirstBeatAtom = atomWithStorage(`${moduleId}:accentFirstBeat`, true);
  const volumeAtom = atomWithStorage(`${moduleId}:volume`, 80);
  
  // Create non-persistent atoms for transient state
  const playingAtom = atom(false);
  const currentBeatAtom = atom(0); // 0 = not playing, 1 = first beat, etc.
  
  // Derived atoms
  const beatIntervalAtom = atom((get) => {
    const tempo = get(tempoAtom);
    // Calculate beat interval in milliseconds (60000 ms / BPM)
    return 60000 / tempo;
  });
  
  // Actions
  const togglePlayAtom = atom(
    (get) => get(playingAtom),
    (get, set, nextValue?: boolean) => {
      const newValue = nextValue !== undefined ? nextValue : !get(playingAtom);
      set(playingAtom, newValue);
      
      if (!newValue) {
        // Reset current beat when stopping
        set(currentBeatAtom, 0);
      } else {
        // Start from beat 1 when playing
        set(currentBeatAtom, 1);
      }
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { playing: newValue },
        moduleId,
        'metronome'
      );
    }
  );
  
  const setTempoAtom = atom(
    (get) => get(tempoAtom),
    (get, set, tempo: number) => {
      // Clamp tempo to valid range
      const clampedTempo = Math.max(20, Math.min(300, tempo));
      set(tempoAtom, clampedTempo);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { tempo: clampedTempo },
        moduleId,
        'metronome'
      );
    }
  );
  
  const incrementTempoAtom = atom(
    null,
    (get, set) => {
      const currentTempo = get(tempoAtom);
      const newTempo = Math.min(300, currentTempo + 1);
      set(tempoAtom, newTempo);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { tempo: newTempo },
        moduleId,
        'metronome'
      );
    }
  );
  
  const decrementTempoAtom = atom(
    null,
    (get, set) => {
      const currentTempo = get(tempoAtom);
      const newTempo = Math.max(20, currentTempo - 1);
      set(tempoAtom, newTempo);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { tempo: newTempo },
        moduleId,
        'metronome'
      );
    }
  );
  
  const resetAtom = atom(
    null,
    (get, set) => {
      set(tempoAtom, 120);
      set(beatsAtom, 4);
      set(beatUnitAtom, 4);
      set(playingAtom, false);
      set(currentBeatAtom, 0);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { reset: true },
        moduleId,
        'metronome'
      );
    }
  );
  
  return {
    ...baseAtoms,
    tempoAtom,
    beatsAtom,
    beatUnitAtom,
    playingAtom,
    soundEnabledAtom,
    accentFirstBeatAtom,
    volumeAtom,
    currentBeatAtom,
    beatIntervalAtom,
    togglePlayAtom,
    setTempoAtom,
    incrementTempoAtom,
    decrementTempoAtom,
    resetAtom,
  };
}

// Register atom creator
moduleAtomsRegistry.registerAtomCreator<MetronomeAtoms>('metronome', createMetronomeAtoms);
```

### Step 2: Create the Metronome Component

Create `components/modules/metronome/MetronomeModule.tsx`:

```tsx
// components/modules/metronome/MetronomeModule.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { moduleAtomsRegistry } from '@/lib/modules/moduleAtomsRegistry';
import { MetronomeAtoms } from '@/lib/modules/metronome/metronomeAtoms';
import { ModuleProps } from '@/types/module';
import { useModuleSandbox } from '@/lib/modules/moduleContext';
import './MetronomeModule.css';

export const MetronomeModule: React.FC<ModuleProps> = ({ 
  id, 
  settings, 
  onSettingsChange, 
  isEditing,
  containerWidth,
  containerHeight
}) => {
  // Get module atoms
  const atoms = moduleAtomsRegistry.getModuleAtoms<MetronomeAtoms>('metronome', id);
  
  // Get module sandbox
  const sandbox = useModuleSandbox();
  
  // Use atoms with Jotai
  const [tempo, setTempo] = useAtom(atoms.tempoAtom);
  const [beats, setBeats] = useAtom(atoms.beatsAtom);
  const [beatUnit, setBeatUnit] = useAtom(atoms.beatUnitAtom);
  const [playing, setPlaying] = useAtom(atoms.playingAtom);
  const [currentBeat, setCurrentBeat] = useAtom(atoms.currentBeatAtom);
  const [soundEnabled, setSoundEnabled] = useAtom(atoms.soundEnabledAtom);
  const [accentFirstBeat, setAccentFirstBeat] = useAtom(atoms.accentFirstBeatAtom);
  const [volume, setVolume] = useAtom(atoms.volumeAtom);
  
  // Derived state
  const beatInterval = useAtomValue(atoms.beatIntervalAtom);
  
  // Actions
  const [, togglePlay] = useAtom(atoms.togglePlayAtom);
  const [, incrementTempo] = useAtom(atoms.incrementTempoAtom);
  const [, decrementTempo] = useAtom(atoms.decrementTempoAtom);
  
  // Refs
  const intervalRef = useRef<number | null>(null);
  const lastBeatTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeBeatIdsRef = useRef<string[]>([]);
  
  // Sync settings with Zustand store when they change externally
  useEffect(() => {
    if (settings.tempo !== undefined && settings.tempo !== tempo) {
      setTempo(settings.tempo as number);
    }
    
    if (settings.timeSignature?.beats !== undefined && settings.timeSignature.beats !== beats) {
      setBeats(settings.timeSignature.beats as number);
    }
    
    if (settings.timeSignature?.beatUnit !== undefined && settings.timeSignature.beatUnit !== beatUnit) {
      setBeatUnit(settings.timeSignature.beatUnit as number);
    }
    
    if (settings.soundEnabled !== undefined && settings.soundEnabled !== soundEnabled) {
      setSoundEnabled(settings.soundEnabled as boolean);
    }
    
    if (settings.accentFirstBeat !== undefined && settings.accentFirstBeat !== accentFirstBeat) {
      setAccentFirstBeat(settings.accentFirstBeat as boolean);
    }
    
    if (settings.volume !== undefined && settings.volume !== volume) {
      setVolume(settings.volume as number);
    }
  }, [
    settings, 
    tempo, setTempo, 
    beats, setBeats, 
    beatUnit, setBeatUnit, 
    soundEnabled, setSoundEnabled, 
    accentFirstBeat, setAccentFirstBeat, 
    volume, setVolume
  ]);
  
  // Save settings to Zustand store when they change internally
  useEffect(() => {
    const newSettings = {
      tempo,
      timeSignature: { beats, beatUnit },
      soundEnabled,
      accentFirstBeat,
      volume,
    };
    
    onSettingsChange(newSettings);
  }, [
    tempo, beats, beatUnit, soundEnabled, accentFirstBeat, volume, 
    onSettingsChange
  ]);
  
  // Handle metronome beat sound
  const playBeatSound = async (isFirstBeat: boolean) => {
    if (!soundEnabled) return;
    
    try {
      // Calculate volume (0-1 range)
      const volumeLevel = volume / 100;
      
      // Play different sounds for first beat (if accent enabled) vs. other beats
      const soundSource = isFirstBeat && accentFirstBeat
        ? '/sounds/metronome-high.mp3'  // Replace with actual sound path
        : '/sounds/metronome-click.mp3'; // Replace with actual sound path
      
      const soundId = await sandbox.audio.playSound(soundSource, {
        volume: volumeLevel,
        id: `beat-${Date.now()}`,
      });
      
      // Keep track of active sound IDs for cleanup
      activeBeatIdsRef.current.push(soundId);
      
      // Cleanup old sound IDs
      if (activeBeatIdsRef.current.length > 5) {
        const oldestId = activeBeatIdsRef.current.shift();
        if (oldestId) {
          sandbox.audio.stopSound(oldestId);
        }
      }
    } catch (error) {
      console.error('Error playing metronome sound:', error);
    }
  };
  
  // Update beat in high-precision animation loop
  const updateBeat = (timestamp: number) => {
    if (!playing) return;
    
    // Initialize last beat time if needed
    if (lastBeatTimeRef.current === null) {
      lastBeatTimeRef.current = timestamp;
      setCurrentBeat(1);
      playBeatSound(true);
    }
    
    // Calculate time since last beat
    const elapsed = timestamp - lastBeatTimeRef.current;
    
    // If it's time for the next beat
    if (elapsed >= beatInterval) {
      // Calculate how many beats we need to advance (handle case where frame rate is low)
      const beatsToAdvance = Math.floor(elapsed / beatInterval);
      
      // Update last beat time, accounting for any drift
      lastBeatTimeRef.current += beatsToAdvance * beatInterval;
      
      // Calculate the new beat number (1-based)
      const newBeat = ((currentBeat + beatsToAdvance - 1) % beats) + 1;
      
      setCurrentBeat(newBeat);
      playBeatSound(newBeat === 1);
    }
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(updateBeat);
  };
  
  // Start/stop the metronome when playing state changes
  useEffect(() => {
    if (playing) {
      // Use requestAnimationFrame for more precise timing
      lastBeatTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(updateBeat);
    } else {
      // Clean up when stopped
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      lastBeatTimeRef.current = null;
      setCurrentBeat(0);
    }
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Stop all active sounds
      activeBeatIdsRef.current.forEach(id => {
        sandbox.audio.stopSound(id);
      });
      activeBeatIdsRef.current = [];
    };
  }, [playing, beatInterval, beats, sandbox.audio]);
  
  // Handle tempo change from input
  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value, 10);
    setTempo(newTempo);
  };
  
  // Handle beats change
  const handleBeatsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBeats = parseInt(e.target.value, 10);
    setBeats(newBeats);
  };
  
  // Handle beat unit change
  const handleBeatUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBeatUnit = parseInt(e.target.value, 10);
    setBeatUnit(newBeatUnit);
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
  };
  
  return (
    <div 
      className={`metronome-module ${playing ? 'is-playing' : ''}`}
      role="region"
      aria-label="Metronome"
    >
      {/* Tempo display */}
      <div className="metronome-tempo">
        <span className="tempo-value">{tempo}</span>
        <span className="tempo-unit">BPM</span>
      </div>
      
      {/* Beat visualization */}
      <div className="beat-visualization" aria-live="polite">
        {Array.from({ length: beats }).map((_, index) => (
          <div 
            key={index}
            className={`beat-indicator ${currentBeat === index + 1 ? 'active' : ''} ${
              index === 0 && accentFirstBeat ? 'accent' : ''
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {/* Tempo controls */}
      <div className="tempo-controls">
        <button 
          className="tempo-button"
          onClick={() => decrementTempo()}
          aria-label="Decrease tempo"
          disabled={tempo <= 20}
        >
          −
        </button>
        
        <input
          type="range"
          min="20"
          max="300"
          value={tempo}
          onChange={handleTempoChange}
          className="tempo-slider"
          aria-label={`Tempo: ${tempo} BPM`}
        />
        
        <button 
          className="tempo-button"
          onClick={() => incrementTempo()}
          aria-label="Increase tempo"
          disabled={tempo >= 300}
        >
          +
        </button>
      </div>
      
      {/* Play/Stop button */}
      <button 
        className={`play-button ${playing ? 'playing' : ''}`}
        onClick={() => togglePlay()}
        aria-label={playing ? 'Stop metronome' : 'Start metronome'}
      >
        {playing ? 'Stop' : 'Start'}
      </button>
      
      {/* Advanced settings (collapsible if space is limited) */}
      {containerWidth > 200 && (
        <div className="metronome-settings">
          <div className="settings-row">
            <label className="setting-label">
              Time Signature:
              <div className="time-signature-inputs">
                <select 
                  value={beats} 
                  onChange={handleBeatsChange}
                  aria-label="Beats per measure"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span>/</span>
                <select 
                  value={beatUnit} 
                  onChange={handleBeatUnitChange}
                  aria-label="Beat unit"
                >
                  {[2, 4, 8, 16].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>
          
          <div className="settings-row">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
                aria-label="Enable sound"
              />
              Sound
            </label>
            
            <label className="setting-label">
              <input
                type="checkbox"
                checked={accentFirstBeat}
                onChange={() => setAccentFirstBeat(!accentFirstBeat)}
                aria-label="Accent first beat"
                disabled={!soundEnabled}
              />
              Accent First Beat
            </label>
          </div>
          
          {soundEnabled && (
            <div className="settings-row volume-control">
              <label className="setting-label">
                Volume:
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  aria-label={`Volume: ${volume}%`}
                />
                <span className="volume-value">{volume}%</span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

Create the CSS file at `components/modules/metronome/MetronomeModule.css`:

```css
/* components/modules/metronome/MetronomeModule.css */
.metronome-module {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  background-color: var(--module-bg-color, #ffffff);
  transition: background-color 0.2s;
}

.metronome-tempo {
  display: flex;
  align-items: baseline;
  margin-bottom: 16px;
}

.tempo-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color, #4299e1);
}

.tempo-unit {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted-color, #718096);
  margin-left: 4px;
}

.beat-visualization {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  min-height: 20px;
}

.beat-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--inactive-beat-color, #e2e8f0);
  transition: transform 0.1s, background-color 0.1s;
}

.beat-indicator.accent {
  width: 16px;
  height: 16px;
}

.beat-indicator.active {
  background-color: var(--active-beat-color, #4299e1);
  transform: scale(1.2);
}

.beat-indicator.accent.active {
  background-color: var(--accent-beat-color, #3182ce);
}

.tempo-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
}

.tempo-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--button-bg-color, #f7fafc);
  border: 1px solid var(--button-border-color, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--button-text-color, #4a5568);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.tempo-button:hover:not(:disabled) {
  background-color: var(--button-hover-bg-color, #edf2f7);
}

.tempo-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 1px;
}

.tempo-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tempo-slider {
  flex: 1;
  height: 6px;
  appearance: none;
  background: var(--slider-track-color, #e2e8f0);
  border-radius: 3px;
  outline: none;
}

.tempo-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--slider-thumb-color, #4299e1);
  cursor: pointer;
  transition: transform 0.1s;
}

.tempo-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: var(--slider-thumb-color, #4299e1);
  cursor: pointer;
  transition: transform 0.1s;
}

.tempo-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.tempo-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.play-button {
  padding: 12px 36px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: var(--primary-color, #4299e1);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  margin-bottom: 24px;
}

.play-button:hover {
  background-color: var(--primary-hover-color, #3182ce);
}

.play-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 3px;
}

.play-button:active {
  transform: scale(0.98);
}

.play-button.playing {
  background-color: var(--stop-color, #f56565);
}

.play-button.playing:hover {
  background-color: var(--stop-hover-color, #e53e3e);
}

.metronome-settings {
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--divider-color, #e2e8f0);
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-color, #4a5568);
}

.time-signature-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-signature-inputs select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--input-border-color, #e2e8f0);
  background-color: var(--input-bg-color, #f7fafc);
  font-size: 14px;
  color: var(--text-color, #4a5568);
}

.volume-control {
  display: flex;
  align-items: center;
  width: 100%;
}

.volume-slider {
  flex: 1;
  height: 4px;
  appearance: none;
  background: var(--slider-track-color, #e2e8f0);
  border-radius: 2px;
  outline: none;
  margin: 0 8px;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--slider-thumb-color, #4299e1);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--slider-thumb-color, #4299e1);
  cursor: pointer;
}

.volume-value {
  font-size: 12px;
  color: var(--text-muted-color, #718096);
  width: 40px;
  text-align: right;
}

/* Responsive styles */
@media (max-width: 300px) {
  .metronome-tempo {
    margin-bottom: 8px;
  }
  
  .tempo-value {
    font-size: 28px;
  }
  
  .beat-visualization {
    margin-bottom: 16px;
  }
  
  .tempo-controls {
    margin-bottom: 16px;
  }
  
  .play-button {
    padding: 8px 24px;
    font-size: 14px;
    margin-bottom: 16px;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .metronome-module {
    --module-bg-color: #1a202c;
    --primary-color: #4299e1;
    --primary-hover-color: #3182ce;
    --stop-color: #f56565;
    --stop-hover-color: #e53e3e;
    --text-color: #e2e8f0;
    --text-muted-color: #a0aec0;
    --inactive-beat-color: #4a5568;
    --active-beat-color: #4299e1;
    --accent-beat-color: #3182ce;
    --divider-color: #4a5568;
    --button-bg-color: #2d3748;
    --button-border-color: #4a5568;
    --button-text-color: #e2e8f0;
    --button-hover-bg-color: #4a5568;
    --slider-track-color: #4a5568;
    --slider-thumb-color: #4299e1;
    --input-bg-color: #2d3748;
    --input-border-color: #4a5568;
  }
}
```

### Step 3: Register the Metronome Module

Create `lib/modules/moduleRegistration.ts`:

```typescript
// lib/modules/moduleRegistration.ts
import { moduleRegistry } from './moduleRegistry';
import { metronomeSettingsSchema } from './metronome/metronomeAtoms';
import { MetronomeModule } from '@/components/modules/metronome/MetronomeModule';
import { z } from 'zod';

// Initialize module registrations
export function registerModules() {
  // Register Metronome module
  moduleRegistry.register({
    type: 'metronome',
    name: 'Metronome',
    description: 'Keep tempo with adjustable BPM and time signature',
    version: '1.0.0',
    compatibleWith: ['1.0.0', '*'],
    category: 'Music',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="6" x2="12" y2="12" />
        <line x1="12" y1="12" x2="16" y2="16" />
      </svg>
    ),
    defaultSize: { width: 3, height: 3 },
    defaultSettings: {
      tempo: 120,
      timeSignature: { beats: 4, beatUnit: 4 },
      soundEnabled: true,
      accentFirstBeat: true,
      volume: 80,
    },
    permissions: ['audio:play'],
    settingsSchema: metronomeSettingsSchema,
    Component: MetronomeModule,
  });
  
  // Register additional modules here
}

// Initialize all module atom definitions
export function initializeModuleAtoms() {
  // Import all module atom creators to register them
  import('./metronome/metronomeAtoms');
  
  // Import other module atoms when you create them
}
```

### Step 4: Create App Initialization

Create `lib/initialization.ts` to handle app startup:

```typescript
// lib/initialization.ts
import { registerModules, initializeModuleAtoms } from './modules/moduleRegistration';
import { useAppStore } from './stores/appStore';
import { eventBus } from './events/eventBus';

/**
 * Initialize the application
 */
export function initializeApp() {
  console.log('Initializing Lythra app...');
  
  // Register module types
  registerModules();
  
  // Initialize module atoms
  initializeModuleAtoms();
  
  // Set up online/offline status
  const updateOnlineStatus = () => {
    useAppStore.getState().setOnlineStatus(navigator.onLine);
    
    eventBus.emit(
      navigator.onLine ? 'app:online' : 'app:offline',
      { timestamp: Date.now() }
    );
  };
  
  if (typeof window !== 'undefined') {
    // Check initial online status
    updateOnlineStatus();
    
    // Add event listeners for online/offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Set initialization flag
    useAppStore.getState().setAuthInitialized(true);
  }
  
  console.log('Lythra app initialized!');
}
```

### Step 5: Update the Main Dashboard Page

Create the file at `app/(dashboard)/page.tsx`:

```tsx
// app/(dashboard)/page.tsx
'use client';

import React, { useEffect } from 'react';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { initializeApp } from '@/lib/initialization';

// Initialize the app on first load
let initialized = false;

export default function DashboardPageRoute() {
  // Initialize the app once
  useEffect(() => {
    if (!initialized) {
      initializeApp();
      initialized = true;
    }
  }, []);
  
  return <DashboardPage />;
}
```

## Phase 6: Testing and Deployment

### Step 1: Add Unit Tests for Core Components

Create `__tests__/modules/MetronomeModule.test.tsx`:

```tsx
// __tests__/modules/MetronomeModule.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'jotai';
import { MetronomeModule } from '@/components/modules/metronome/MetronomeModule';
import { moduleAtomsRegistry } from '@/lib/modules/moduleAtomsRegistry';

// Mock the module sandbox
jest.mock('@/lib/modules/moduleContext', () => ({
  useModuleSandbox: () => ({
    audio: {
      playSound: jest.fn().mockResolvedValue('test-sound-id'),
      stopSound: jest.fn(),
      stopAllSounds: jest.fn(),
    },
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
    },
    moduleId: 'test-module-id',
    permissions: ['audio:play'],
  }),
}));

// Import metronome atoms to register them
import '@/lib/modules/metronome/metronomeAtoms';

describe('MetronomeModule', () => {
  const defaultProps = {
    id: 'test-metronome',
    settings: {
      tempo: 120,
      timeSignature: { beats: 4, beatUnit: 4 },
      soundEnabled: true,
      accentFirstBeat: true,
      volume: 80,
    },
    onSettingsChange: jest.fn(),
    isEditing: false,
    containerWidth: 300,
    containerHeight: 400,
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with default settings', () => {
    render(
      <Provider>
        <MetronomeModule {...defaultProps} />
      </Provider>
    );
    
    // Check that the tempo is displayed
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('BPM')).toBeInTheDocument();
    
    // Check that the start button is present
    expect(screen.getByRole('button', { name: /start metronome/i })).toBeInTheDocument();
  });
  
  it('updates tempo when slider is changed', () => {
    render(
      <Provider>
        <MetronomeModule {...defaultProps} />
      </Provider>
    );
    
    // Find the tempo slider
    const slider = screen.getByRole('slider', { name: /tempo/i });
    
    // Change the slider value
    fireEvent.change(slider, { target: { value: '140' } });
    
    // Check that the tempo is updated
    expect(screen.getByText('140')).toBeInTheDocument();
    
    // Check that settings change callback was called
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith(
      expect.objectContaining({ tempo: 140 })
    );
  });
  
  it('toggles play state when start/stop button is clicked', () => {
    render(
      <Provider>
        <MetronomeModule {...defaultProps} />
      </Provider>
    );
    
    // Find the play button
    const playButton = screen.getByRole('button', { name: /start metronome/i });
    
    // Click to start
    fireEvent.click(playButton);
    
    // Button should now say "Stop"
    expect(screen.getByRole('button', { name: /stop metronome/i })).toBeInTheDocument();
    
    // Click to stop
    fireEvent.click(screen.getByRole('button', { name: /stop metronome/i }));
    
    // Button should now say "Start" again
    expect(screen.getByRole('button', { name: /start metronome/i })).toBeInTheDocument();
  });
});
```

### Step 2: Create End-to-End Tests

Create `cypress/e2e/dashboard.cy.ts`:

```typescript
// cypress/e2e/dashboard.cy.ts
describe('Dashboard', () => {
  beforeEach(() => {
    // Visit the dashboard page
    cy.visit('/dashboard');
    
    // Wait for the page to load
    cy.contains('My First Dashboard').should('be.visible');
  });
  
  it('should toggle edit mode', () => {
    // Initially, the module palette should not be visible
    cy.get('.module-palette').should('not.exist');
    
    // Click edit button
    cy.contains('Edit Dashboard').click();
    
    // Module palette should now be visible
    cy.get('.module-palette').should('be.visible');
    
    // Exit edit mode
    cy.contains('Done Editing').click();
    
    // Module palette should be hidden again
    cy.get('.module-palette').should('not.exist');
  });
  
  it('should add a metronome module', () => {
    // Enter edit mode
    cy.contains('Edit Dashboard').click();
    
    // Open module palette
    cy.get('.module-palette').should('be.visible');
    
    // Find and click on the metronome module
    cy.contains('.module-item', 'Metronome').click();
    
    // Verify that a metronome module was added
    cy.get('.metronome-module').should('be.visible');
    
    // Check that the tempo display is showing
    cy.get('.tempo-value').should('contain', '120');
    
    // Test the play button
    cy.get('.play-button').click();
    cy.get('.play-button.playing').should('exist');
    
    // Stop the metronome
    cy.get('.play-button.playing').click();
    cy.get('.play-button').should('not.have.class', 'playing');
  });
  
  it('should allow drag and drop of modules', () => {
    // Enter edit mode
    cy.contains('Edit Dashboard').click();
    
    // Add a metronome module if not already present
    if (cy.get('.metronome-module').should('not.exist')) {
      cy.contains('.module-item', 'Metronome').click();
    }
    
    // Get initial position
    let initialPosition;
    cy.get('.react-grid-item')
      .first()
      .then(($el) => {
        initialPosition = $el.position();
      });
    
    // Drag the module
    cy.get('.react-grid-item')
      .first()
      .find('.module-header')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 200, clientY: 300 })
      .trigger('mouseup', { force: true });
    
    // Verify the position changed
    cy.get('.react-grid-item')
      .first()
      .then(($el) => {
        const newPosition = $el.position();
        expect(newPosition.top).not.to.equal(initialPosition.top);
        expect(newPosition.left).not.to.equal(initialPosition.left);
      });
  });
});
```

### Step 3: Configure Vercel Deployment

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Step 4: Configure CircleCI for CI/CD

Create `.circleci/config.yml`:

```yaml
version: 2.1

orbs:
  node: circleci/node@5.0.2

jobs:
  build-and-test:
    docker:
      - image: cimg/node:18.15
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: npm
      - run:
          name: Run linting
          command: npm run lint
      - run:
          name: Run tests
          command: npm test
      - run:
          name: Build application
          command: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - .next
            - node_modules

  deploy:
    docker:
      - image: cimg/node:18.15
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Install Vercel CLI
          command: npm install --global vercel@latest
      - run:
          name: Deploy to Vercel
          command: |
            if [ "${CIRCLE_BRANCH}" == "main" ]; then
              vercel --token ${VERCEL_TOKEN} --prod
            else
              vercel --token ${VERCEL_TOKEN}
            fi

workflows:
  version: 2
  build-test-deploy:
    jobs:
      - build-and-test
      - deploy:
          requires:
            - build-and-test
          filters:
            branches:
              only:
                - main
                - develop
```

## Phase 7: Implementation Roadmap

### Step 1: Initial MVP Implementation

1. Start with the core state management setup:
   - `lib/stores/appStore.ts`
   - `lib/stores/dashboardStore.ts`
   - `lib/events/eventBus.ts`

2. Implement the module system foundation:
   - `lib/modules/moduleRegistry.ts`
   - `lib/modules/moduleAtomsRegistry.ts`
   - `lib/modules/moduleSandbox.ts`
   - `lib/modules/moduleContext.tsx`

3. Create basic UI components:
   - `components/modules/ModuleWrapper.tsx`
   - `components/dashboard/DashboardGrid.tsx`
   - `components/dashboard/ModulePalette.tsx`
   - `components/dashboard/DashboardPage.tsx`

4. Implement the first module:
   - `lib/modules/metronome/metronomeAtoms.ts`
   - `components/modules/metronome/MetronomeModule.tsx`

5. Wire everything together:
   - `lib/modules/moduleRegistration.ts`
   - `lib/initialization.ts`
   - `app/(dashboard)/page.tsx`

### Step 2: Additional Modules

After the core foundation, add more modules:

1. Music Sheet Viewer Module
2. Timer/Stopwatch Module
3. Quick Notes Module
4. Music Theory Reference Module
5. Tuner Module

### Step 3: User Authentication and Dashboard Management

1. Connect with Supabase for authentication
2. Implement dashboard saving and loading
3. Add dashboard sharing functionality
4. Create user settings and preferences

### Step 4: PWA Features

1. Implement service worker for offline capabilities
2. Add manifest for installable app
3. Implement caching strategies for assets
4. Add push notifications for collaborative features

## Security Considerations

- **Content Security Policy**: The middleware.ts file sets up a strict CSP to prevent XSS attacks.
- **Module Isolation**: The moduleSandbox.ts creates isolated environments for each module.
- **Input Validation**: The zod schema validation ensures all user input is validated.
- **Permission System**: Modules can only access capabilities they explicitly request.
- **Secure Storage**: Sensitive data is encrypted in client-side storage.
- **Data Segregation**: Each module's data is isolated from other modules.

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions.
- **Screen Reader Support**: ARIA attributes and semantic HTML.
- **Focus Management**: Proper focus handling for interactive elements.
- **Color Contrast**: High contrast UI with dark mode support.
- **Responsive Design**: Works on all screen sizes and devices.
- **Error Handling**: Clear error messages and recovery paths.

## Performance Optimizations

- **Lazy Loading**: Modules are loaded only when needed.
- **Efficient State Management**: Hybrid Zustand/Jotai approach minimizes rerenders.
- **Resource Cleanup**: All resources are properly cleaned up to prevent memory leaks.
- **Bundling Strategy**: Code splitting to reduce initial load time.
- **IndexedDB Storage**: For efficient client-side data storage.
