// src/lib/stores/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, User } from '@/types/common';

/**
 * Global application state interface
 */
interface AppState {
  // User and auth state
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  
  // UI state
  theme: Theme;
  sidebarOpen: boolean;
  
  // App state
  isOnline: boolean;
  lastSyncTime: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  setAuthInitialized: (initialized: boolean) => void;
  logout: () => void;
  setLastSyncTime: (time: string) => void;
}

/**
 * Create the global app store using Zustand
 * 
 * This store handles:
 * - User authentication state
 * - UI preferences
 * - App-wide status and settings
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isAuthInitialized: false,
      theme: 'system',
      sidebarOpen: true,
      isOnline: true,
      lastSyncTime: null,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setOnlineStatus: (online) => set({ isOnline: online }),
      
      setAuthInitialized: (initialized) => set({ 
        isAuthInitialized: initialized 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'lythra-app-storage',
      partialize: (state) => ({
        // Only persist these fields to localStorage
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        // Don't store auth info in localStorage
      }),
      version: 1, // For migration purposes
    }
  )
);

/**
 * Set up listeners for online/offline status
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false);
  });
} 