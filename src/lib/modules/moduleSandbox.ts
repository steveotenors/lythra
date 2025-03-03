import { ModulePermission } from '@/types/module';
import { get, set, del } from 'idb-keyval';

/**
 * Creates a sandboxed storage API for a module
 */
function createSandboxedStorage(moduleId: string) {
  const storageKeyPrefix = `module:${moduleId}:`;
  
  return {
    // Get a value from module's storage
    async getItem(key: string): Promise<unknown> {
      try {
        return await get(`${storageKeyPrefix}${key}`);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
        return null;
      }
    },
    
    // Set a value in module's storage
    async setItem(key: string, value: unknown): Promise<void> {
      try {
        await set(`${storageKeyPrefix}${key}`, value);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    },
    
    // Remove a value from module's storage
    async removeItem(key: string): Promise<void> {
      try {
        await del(`${storageKeyPrefix}${key}`);
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    },
    
    // Get all keys in module's storage
    async keys(): Promise<string[]> {
      try {
        const allKeys = await get('__all_keys__') || [];
        return allKeys.filter((key: string) => 
          key.startsWith(storageKeyPrefix)
        ).map((key: string) => 
          key.replace(storageKeyPrefix, '')
        );
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
        return [];
      }
    },
    
    // Clear all module's storage
    async clear(): Promise<void> {
      try {
        const keys = await this.keys();
        for (const key of keys) {
          await this.removeItem(key);
        }
      } catch (error) {
        console.error(`Storage error in module ${moduleId}:`, error);
      }
    }
  };
}

/**
 * Creates a sandboxed fetch API for a module
 */
function createSandboxedFetch(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasNetworkReadPermission = permissions.includes('network:read');
  const hasNetworkWritePermission = permissions.includes('network:write');
  
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Check permissions based on HTTP method
    const method = options.method?.toUpperCase() || 'GET';
    
    if (['GET', 'HEAD'].includes(method)) {
      if (!hasNetworkReadPermission) {
        throw new Error(`Module ${moduleId} does not have network:read permission`);
      }
    } else {
      if (!hasNetworkWritePermission) {
        throw new Error(`Module ${moduleId} does not have network:write permission`);
      }
    }
    
    // Prevent access to internal endpoints
    const urlObj = new URL(url, window.location.origin);
    
    // Block requests to sensitive domains
    const blockedDomains = [
      'localhost',
      '127.0.0.1',
      'internal.lythra.com'
    ];
    
    if (blockedDomains.includes(urlObj.hostname)) {
      throw new Error(`Access to ${urlObj.hostname} is not allowed`);
    }
    
    // Block requests to sensitive endpoints
    const blockedPaths = [
      '/api/auth',
      '/api/admin',
      '/api/internal'
    ];
    
    if (blockedPaths.some(path => urlObj.pathname.startsWith(path))) {
      throw new Error(`Access to ${urlObj.pathname} is not allowed`);
    }
    
    // Add a custom header to identify the module
    const headers = new Headers(options.headers);
    headers.append('X-Lythra-Module-ID', moduleId);
    
    // Make the actual fetch request
    try {
      return await fetch(url, {
        ...options,
        headers
      });
    } catch (error) {
      console.error(`Network error in module ${moduleId}:`, error);
      throw error;
    }
  };
}

/**
 * Creates a sandboxed audio API for a module
 */
function createSandboxedAudio(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasAudioPermission = permissions.includes('audio:play');
  
  // Map to track audio elements created by this module
  const audioElements = new Map<string, HTMLAudioElement>();
  
  return {
    // Create and play a sound
    async playSound(
      source: string, 
      options: { volume?: number; loop?: boolean; id?: string } = {}
    ): Promise<string> {
      if (!hasAudioPermission) {
        throw new Error(`Module ${moduleId} does not have audio:play permission`);
      }
      
      const id = options.id || `${moduleId}-audio-${Date.now()}`;
      
      // Check for existing audio element with this ID
      if (audioElements.has(id)) {
        // Stop existing audio before creating a new one
        const existing = audioElements.get(id)!;
        existing.pause();
        existing.remove();
      }
      
      // Create a new audio element
      const audio = new Audio(source);
      audio.volume = options.volume ?? 1.0;
      audio.loop = options.loop ?? false;
      
      // Store in our map
      audioElements.set(id, audio);
      
      // Set up cleanup when audio finishes
      audio.addEventListener('ended', () => {
        if (!options.loop) {
          audioElements.delete(id);
          audio.remove();
        }
      });
      
      try {
        await audio.play();
        return id;
      } catch (error) {
        console.error(`Audio error in module ${moduleId}:`, error);
        audioElements.delete(id);
        throw error;
      }
    },
    
    // Stop a sound by ID
    stopSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audioElements.delete(id);
        audio.remove();
      }
    },
    
    // Pause a sound by ID
    pauseSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.pause();
      }
    },
    
    // Resume a sound by ID
    resumeSound(id: string): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.play().catch(error => {
          console.error(`Audio resume error in module ${moduleId}:`, error);
        });
      }
    },
    
    // Set volume for a sound
    setVolume(id: string, volume: number): void {
      const audio = audioElements.get(id);
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    },
    
    // Stop all sounds created by this module
    stopAllSounds(): void {
      audioElements.forEach(audio => {
        audio.pause();
        audio.remove();
      });
      audioElements.clear();
    }
  };
}

/**
 * Creates a sandboxed notification API for a module
 */
function createSandboxedNotifications(
  moduleId: string, 
  permissions: ModulePermission[]
) {
  const hasNotificationPermission = permissions.includes('notifications:create');
  
  return {
    // Request notification permission
    async requestPermission(): Promise<boolean> {
      if (!hasNotificationPermission) {
        throw new Error(`Module ${moduleId} does not have notifications:create permission`);
      }
      
      if (!('Notification' in window)) {
        return false;
      }
      
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error(`Notification permission error in module ${moduleId}:`, error);
        return false;
      }
    },
    
    // Show a notification
    async showNotification(
      title: string, 
      options: NotificationOptions = {}
    ): Promise<string | null> {
      if (!hasNotificationPermission) {
        throw new Error(`Module ${moduleId} does not have notifications:create permission`);
      }
      
      if (!('Notification' in window)) {
        return null;
      }
      
      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) return null;
      }
      
      try {
        // Add module info to notification
        const moduleOptions = {
          ...options,
          tag: options.tag || `lythra-${moduleId}-${Date.now()}`,
          data: {
            ...options.data,
            moduleId,
          },
        };
        
        // Create the notification and return the tag for future reference
        new Notification(title, moduleOptions);
        return moduleOptions.tag;
      } catch (error) {
        console.error(`Notification error in module ${moduleId}:`, error);
        return null;
      }
    },
    
    // Close a notification
    closeNotification(tag: string): void {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'close-notification',
          tag,
          moduleId,
        });
      }
    }
  };
}

/**
 * Creates a complete sandbox environment for a module
 */
export function createModuleSandbox(
  moduleId: string, 
  permissions: ModulePermission[] = []
) {
  return {
    storage: createSandboxedStorage(moduleId),
    fetch: createSandboxedFetch(moduleId, permissions),
    audio: createSandboxedAudio(moduleId, permissions),
    notifications: createSandboxedNotifications(moduleId, permissions),
    permissions,
    moduleId,
  };
}

// Export the sandbox types
export type ModuleStorage = ReturnType<typeof createSandboxedStorage>;
export type ModuleFetch = ReturnType<typeof createSandboxedFetch>;
export type ModuleAudio = ReturnType<typeof createSandboxedAudio>;
export type ModuleNotifications = ReturnType<typeof createSandboxedNotifications>;
export type ModuleSandbox = ReturnType<typeof createModuleSandbox>; 