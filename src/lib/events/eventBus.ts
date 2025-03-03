import { ModuleEvent, ModuleEventType } from '@/types/module';

/**
 * Event callback type definition
 */
type EventCallback = (event: ModuleEvent) => void;

/**
 * EventBus for module communication
 * 
 * Provides a centralized event bus for modules to communicate
 * without directly depending on each other.
 */
class EventBus {
  private events: Map<ModuleEventType, Set<EventCallback>> = new Map();
  private eventLog: ModuleEvent[] = [];
  private maxLogSize: number = 100;
  
  /**
   * Subscribe to an event type
   * 
   * @param {ModuleEventType} eventType - The type of event to subscribe to
   * @param {EventCallback} callback - The callback function to execute when event occurs
   * @returns {Function} Unsubscribe function to clean up the subscription
   */
  public on(eventType: ModuleEventType, callback: EventCallback): () => void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Set());
    }
    
    // Safely get the callbacks set (TypeScript needs this assertion)
    const callbacks = this.events.get(eventType)!;
    callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(eventType);
      if (callbacks?.has(callback)) {
        callbacks.delete(callback);
        
        // Clean up empty callback sets
        if (callbacks.size === 0) {
          this.events.delete(eventType);
        }
      }
    };
  }
  
  /**
   * Subscribe to events for a specific module
   * 
   * @param {ModuleEventType} eventType - The type of event to subscribe to
   * @param {string} moduleId - The module ID to filter events for
   * @param {EventCallback} callback - The callback function to execute when event occurs
   * @returns {Function} Unsubscribe function to clean up the subscription
   */
  public onForModule(
    eventType: ModuleEventType, 
    moduleId: string, 
    callback: EventCallback
  ): () => void {
    return this.on(eventType, (event) => {
      if (event.moduleId === moduleId) {
        callback(event);
      }
    });
  }
  
  /**
   * Subscribe to all events (use carefully)
   * 
   * @param {EventCallback} callback - The callback function to execute for any event
   * @returns {Function} Unsubscribe function to clean up all subscriptions
   */
  public onAll(callback: EventCallback): () => void {
    const unsubscribers: Array<() => void> = [];
    
    // Subscribe to each event type
    const eventTypes: ModuleEventType[] = [
      'module:initialized',
      'module:settings-changed',
      'module:state-changed',
      'module:error',
      'dashboard:layout-changed',
      'dashboard:edit-mode-changed'
    ];
    
    // Subscribe to each event type
    eventTypes.forEach((eventType) => {
      unsubscribers.push(this.on(eventType, callback));
    });
    
    // Return function to unsubscribe from all
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }
  
  /**
   * Emit an event to all subscribers
   * 
   * @param {ModuleEventType} eventType - The type of event to emit
   * @param {unknown} payload - Optional data to include with the event
   * @param {string} moduleId - Optional module ID that emitted the event
   * @param {string} moduleType - Optional module type that emitted the event
   */
  public emit(
    eventType: ModuleEventType, 
    payload?: unknown, 
    moduleId?: string, 
    moduleType?: string
  ): void {
    const event: ModuleEvent = {
      type: eventType,
      moduleId,
      moduleType,
      payload,
      timestamp: Date.now(),
    };
    
    // Log the event
    this.logEvent(event);
    
    // Notify subscribers
    const callbacks = this.events.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }
  
  /**
   * Log an event for debugging and auditing
   * 
   * @param {ModuleEvent} event - The event to log
   * @private
   */
  private logEvent(event: ModuleEvent): void {
    this.eventLog.push(event);
    
    // Truncate log to max size
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(this.eventLog.length - this.maxLogSize);
    }
  }
  
  /**
   * Get the event log (for debugging)
   * 
   * @returns {ModuleEvent[]} Copy of the event log
   */
  public getEventLog(): ModuleEvent[] {
    return [...this.eventLog];
  }
  
  /**
   * Clear all subscriptions
   */
  public clearAllSubscriptions(): void {
    this.events.clear();
  }
  
  /**
   * Clear the event log
   */
  public clearEventLog(): void {
    this.eventLog = [];
  }
  
  /**
   * Get the count of subscribers for an event type
   * 
   * @param {ModuleEventType} eventType - The event type to count subscribers for
   * @returns {number} Number of subscribers
   */
  public getSubscriberCount(eventType: ModuleEventType): number {
    return this.events.get(eventType)?.size || 0;
  }
}

// Create and export a singleton instance
export const eventBus = new EventBus(); 