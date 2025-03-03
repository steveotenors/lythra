# STRICT AI Agent Ruleset for Lythra Codebase Management

> **Note**: This is the canonical version for Lythra - a modular dashboard application with focus on security, accessibility, and performance - located at `docs/development/cursor-ai-rules.md`

## MANDATORY COMPLIANCE NOTICE

This ruleset MUST be followed WITHOUT EXCEPTION. The AI agent MUST NEVER deviate from these guidelines, suggest alternatives that contradict them, or skip any steps. If a step cannot be completed, the AI MUST notify the user and await further instructions rather than proceeding with a non-compliant solution.

## General Principles (REQUIRED)

- **Consistency**: STRICTLY use the EXACT same naming conventions, file structures, and formatting throughout the codebase. If conventions are unclear, HALT and request clarification before proceeding.
- **Type Safety**: TypeScript is MANDATORY (.tsx for components, .ts for utilities). NO `any` types allowed. Use explicit union types, generics, or unknown with type guards instead.
- **Modularity**: Code MUST be self-contained by grouping related files. Dependencies MUST be minimized to only what is absolutely necessary.
- **Documentation**: Every component, function, and module REQUIRES proper JSDoc documentation. Complex logic MUST be explained with comments.
- **Security**: Input validation, secure storage, and module isolation MUST be implemented throughout. All user inputs MUST be validated with Zod schemas.
- **Accessibility**: UI components MUST include proper ARIA attributes, support keyboard navigation, and maintain adequate color contrast.
- **Performance**: Resources MUST be properly cleaned up, components optimized with React.memo when appropriate, and useCallback/useMemo used for frequently re-rendered components.
- **Testing**: Every component and module MUST have comprehensive tests including happy path, edge cases, and error states.
- **Git Practices**: ALL commits MUST follow consistent message format, branches MUST follow naming conventions, and PRs MUST include comprehensive descriptions.

## Rule 1: Component Creation (STRICTLY ENFORCED)

**Trigger**: When instructed to create a new UI component.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Create Folder**: Component MUST be placed in `components/[category]/[ComponentName]/` (e.g., `components/ui/Button/`).
2. **Component File**: MUST create `[ComponentName].tsx` with:
   - A typed props interface with EXPLICIT types for all props (NO `any` types permitted).
   - Component MUST be implemented as `React.FC<[ComponentName]Props>`.
   - Component file size MUST NOT exceed 100 lines; if larger, MUST split into sub-components.
   - MUST include proper ARIA attributes for accessibility.
   - MUST implement keyboard interactions where appropriate.
   - MUST include memoization (React.memo) for frequently re-rendered components.
   - MUST properly clean up ALL resources in useEffect cleanup functions.
3. **Storybook Story**: MUST create `[ComponentName].stories.tsx` with:
   - REQUIRED setup: `export default { title: 'Components/[Category]/[ComponentName]', component: [ComponentName] };`.
   - MINIMUM of three stories: default state, one edge case, and one accessibility/error state.
   - Stories MUST include documentation in the parameters section.
4. **Styling**: MUST add `[ComponentName].css` with scoped styles:
   - MUST use CSS variables for theming.
   - MUST include dark mode support with media queries.
   - MUST ensure color contrast meets WCAG AA standards (4.5:1 for normal text).
   - MUST include responsive designs for various screen sizes.
   - INLINE STYLES ARE FORBIDDEN except for dynamically calculated values.
5. **Tests**: MUST create `[ComponentName].test.tsx` with:
   - Tests for rendering with different props.
   - Tests for user interactions (clicks, inputs).
   - Tests for keyboard accessibility.
   - Tests for error states and edge cases.
   - Minimum 80% test coverage.
6. **Index Export**: MUST create `index.ts` to export the component:
   ```typescript
   export * from './[ComponentName]';
   ```
7. **Lint and Clean**:
   - MUST run `eslint components/[category]/[ComponentName] --fix`.
   - MUST remove ALL unused imports, variables, and console.log statements.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 2: Module Creation (STRICTLY ENFORCED)

**Trigger**: When instructed to create a new module for the dashboard.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Create Module Structure**: MUST use this structure:
   ```
   lib/modules/[moduleName]/
     [moduleName]Atoms.ts
     index.ts
   components/modules/[moduleName]/
     [ModuleName]Module.tsx
     [ModuleName]Module.css
     [ModuleName]Module.test.tsx
     index.ts
   ```

2. **Define Module Types and Validation**:
   - MUST create a Zod schema for module settings validation in `[moduleName]Atoms.ts`:
     ```typescript
     export const [moduleName]SettingsSchema = z.object({
       // Settings with validation rules
     });
     
     export type [ModuleName]Settings = z.infer<typeof [moduleName]SettingsSchema>;
     
     export const default[ModuleName]Settings: [ModuleName]Settings = {
       // Default values
     };
     ```
   - MUST define explicit TypeScript interfaces for module state and props.
   - MUST export all types through the index.ts file.

3. **Implement Jotai Atoms**:
   - MUST create atom definitions in `[moduleName]Atoms.ts`:
     ```typescript
     export interface [ModuleName]Atoms extends BaseModuleAtoms {
       // Module-specific atoms
       [stateAtom]: ReturnType<typeof atom<[StateType]>>;
       
       // Action atoms
       [actionAtom]: ReturnType<typeof atom<void, [[ActionParams]], void>>;
     }
     
     export function create[ModuleName]Atoms(moduleId: string): [ModuleName]Atoms {
       // Base atoms from registry
       const baseAtoms = createBaseModuleAtoms(moduleId);
       
       // Module-specific atoms
       const [stateAtom] = atom<[StateType]>([initialValue]);
       
       // Action atoms
       const [actionAtom] = atom(
         null,
         (get, set, [params]) => {
           // Action implementation
         }
       );
       
       return {
         ...baseAtoms,
         [stateAtom],
         [actionAtom],
       };
     }
     
     // Register with the registry
     moduleAtomsRegistry.registerAtomCreator<[ModuleName]Atoms>('[moduleName]', create[ModuleName]Atoms);
     ```
   - MUST include at minimum the base atoms (isActive, error, isLoading).
   - MUST implement proper cleanup for any resources created by atoms.

4. **Implement Module Component**:
   - MUST create `[ModuleName]Module.tsx` implementing `ModuleProps` interface:
     ```typescript
     export const [ModuleName]Module: React.FC<ModuleProps> = ({
       id,
       settings,
       onSettingsChange,
       isEditing,
       containerWidth,
       containerHeight
     }) => {
       // Get module atoms
       const atoms = moduleAtomsRegistry.getModuleAtoms<[ModuleName]Atoms>('[moduleName]', id);
       
       // Get module sandbox
       const sandbox = useModuleSandbox();
       
       // Use atoms with Jotai
       const [[state], set[State]] = useAtom(atoms.[stateAtom]);
       
       // Sync settings with store
       useEffect(() => {
         // Implementation
       }, [settings]);
       
       // Save settings to store when they change internally
       useEffect(() => {
         // Implementation
       }, [[state]]);
       
       // Clean up resources on unmount
       useEffect(() => {
         return () => {
           // Cleanup implementation
         };
       }, []);
       
       return (
         <div 
           className="[module-name]-module"
           role="region"
           aria-label="[Module Name]"
         >
           {/* Module UI */}
         </div>
       );
     };
     ```
   - MUST use the module sandbox for security-sensitive operations.
   - MUST implement proper error handling with try/catch for ALL external operations.
   - MUST handle loading states.
   - MUST support keyboard navigation and include ARIA attributes.
   - MUST clean up resources (intervals, subscriptions) on unmount.

5. **Register Module**:
   - MUST register the module in `lib/modules/moduleRegistration.ts`:
     ```typescript
     moduleRegistry.register({
       type: '[moduleName]',
       name: '[Module Name]',
       description: '[Description]',
       version: '1.0.0',
       compatibleWith: ['1.0.0', '*'],
       category: '[Category]',
       icon: (
         <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
           {/* SVG paths */}
         </svg>
       ),
       defaultSize: { width: 3, height: 3 },
       defaultSettings: default[ModuleName]Settings,
       permissions: [/* Required permissions */],
       settingsSchema: [moduleName]SettingsSchema,
       Component: [ModuleName]Module,
     });
     ```
   - MUST specify required permissions explicitly.
   - MUST set reasonable default settings and size.

6. **Tests**:
   - MUST write tests covering normal operation, error states, and edge cases:
     ```typescript
     import { render, screen, fireEvent, act } from '@testing-library/react';
     import { Provider } from 'jotai';
     import { [ModuleName]Module } from './[ModuleName]Module';
     
     // Mock module sandbox
     jest.mock('@/lib/modules/moduleContext', () => ({
       useModuleSandbox: () => ({
         // Mock sandbox APIs
       }),
     }));
     
     describe('[ModuleName]Module', () => {
       const defaultProps = {
         id: 'test-[moduleName]',
         settings: { /* Default settings */ },
         onSettingsChange: jest.fn(),
         isEditing: false,
         containerWidth: 300,
         containerHeight: 400,
       };
       
       beforeEach(() => {
         jest.clearAllMocks();
       });
       
       it('renders with default settings', () => {
         // Test implementation
       });
       
       // More tests
     });
     ```
   - MUST mock module sandbox APIs for testing.
   - MUST test settings synchronization.
   - MUST test different module states.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 3: State Management (STRICTLY ENFORCED)

**Trigger**: When implementing state management for components or modules.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Global State with Zustand**: MUST use Zustand for application-wide state:
   ```typescript
   // lib/stores/[storeName].ts
   export const use[Store]Store = create<[Store]State>()(
     persist(
       (set, get) => ({
         // State
         [stateName]: [initialValue],
         
         // Actions
         [actionName]: ([params]) => set((state) => ({
           // State updates
         })),
       }),
       {
         name: '[app-name]-[store-name]-storage',
         partialize: (state) => ({
           // Only persist these fields
           [field]: state.[field],
         }),
       }
     )
   );
   ```
   - MUST use for: authentication state, UI preferences, dashboard layouts/configuration, app-wide settings.
   - MUST implement proper partialize function to prevent sensitive data from being persisted.
   - MUST use typed actions for all state updates.
   - MUST use selectors for optimized component updates.

2. **Module State with Jotai**: MUST use Jotai for module-specific state:
   ```typescript
   // lib/modules/[moduleName]/[moduleName]Atoms.ts
   export function create[ModuleName]Atoms(moduleId: string): [ModuleName]Atoms {
     // Atoms implementation
   }
   
   // In a module component
   const atoms = moduleAtomsRegistry.getModuleAtoms<[ModuleName]Atoms>('[moduleName]', id);
   const [[state], set[State]] = useAtom(atoms.[stateAtom]);
   ```
   - MUST use for: internal module operations, module-specific UI state, transient state.
   - MUST register all atom creators with the module registry.
   - MUST implement proper atom dependency relationships.
   - MUST use derived atoms for computed values.

3. **Communication with EventBus**: MUST use eventBus for cross-module communication:
   ```typescript
   // Emitting events
   eventBus.emit('[eventType]', { /* payload */ }, moduleId);
   
   // Subscribing to events
   const unsubscribe = eventBus.on('[eventType]', (event) => {
     // Handle event
   });
   
   // Cleanup
   useEffect(() => {
     return () => {
       unsubscribe();
     };
   }, []);
   ```
   - MUST use typed event payloads.
   - MUST clean up event subscriptions on component unmount.
   - MUST NOT directly access state from other modules.
   - MUST use module-specific events when appropriate.

4. **Persistent Storage**:
   - Sensitive data MUST be encrypted before storage:
     ```typescript
     const encryptedData = encryptData(sensitiveValue);
     await sandbox.storage.setItem('sensitive-key', encryptedData);
     ```
   - Module settings MUST be validated before saving:
     ```typescript
     const validationResult = [moduleName]SettingsSchema.safeParse(newSettings);
     if (!validationResult.success) {
       // Handle validation errors
       return;
     }
     onSettingsChange(validationResult.data);
     ```
   - MUST implement proper error handling for storage operations:
     ```typescript
     try {
       await sandbox.storage.setItem('key', value);
     } catch (error) {
       // Handle storage error
     }
     ```
   - MUST use appropriate storage mechanisms based on data size and requirements.

5. **State Optimization**:
   - MUST use selectors for targeted re-renders:
     ```typescript
     const selectedValue = use[Store]Store((state) => state.[field]);
     ```
   - MUST memoize frequently changing values:
     ```typescript
     const memoizedValue = useMemo(() => {
       // Expensive calculation
     }, [dependencies]);
     ```
   - MUST use useCallback for functions passed to child components:
     ```typescript
     const handleEvent = useCallback(() => {
       // Event handler implementation
     }, [dependencies]);
     ```
   - MUST implement optimized batch updates when possible.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 4: Security Implementation (STRICTLY ENFORCED)

**Trigger**: When implementing any feature that handles user data or external resources.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Input Validation**:
   - ALL user inputs MUST be validated with Zod schemas:
     ```typescript
     const schema = z.object({
       name: z.string().min(1).max(100),
       email: z.string().email(),
       age: z.number().int().min(18),
     });
     
     const validationResult = schema.safeParse(formData);
     if (!validationResult.success) {
       // Handle validation errors
       return;
     }
     // Use validated data
     const validData = validationResult.data;
     ```
   - ALL module settings MUST be validated before use:
     ```typescript
     const validationResult = [moduleName]SettingsSchema.safeParse(settings);
     if (!validationResult.success) {
       // Use default settings instead
       return default[ModuleName]Settings;
     }
     return validationResult.data;
     ```
   - MUST sanitize content that could contain XSS attacks:
     ```typescript
     const sanitizedContent = sanitizeInput(userProvidedContent);
     ```
   - MUST validate data types and ranges for ALL inputs.

2. **Module Sandboxing**:
   - MUST restrict module capabilities based on permissions:
     ```typescript
     const sandbox = useModuleSandbox();
     
     // Only if module has 'audio:play' permission
     if (sandbox.permissions.includes('audio:play')) {
       await sandbox.audio.playSound('/sound.mp3');
     }
     ```
   - MUST isolate module storage to prevent cross-module data access:
     ```typescript
     // Proper isolated storage
     await sandbox.storage.setItem(`${moduleId}:config`, config);
     ```
   - MUST restrict network access based on permissions:
     ```typescript
     // Only if module has 'network:read' permission
     if (sandbox.permissions.includes('network:read')) {
       const response = await sandbox.fetch('https://api.example.com/data');
     }
     ```
   - MUST prevent modules from accessing DOM outside their container.

3. **Content Security Policy**:
   - MUST implement CSP headers for all pages:
     ```typescript
     // In middleware.ts
     const cspHeader = `
       default-src 'self';
       script-src 'self' 'unsafe-eval';
       style-src 'self' 'unsafe-inline';
       connect-src 'self' ${allowedApiDomains};
     `.replace(/\s{2,}/g, ' ').trim();
     
     response.headers.set('Content-Security-Policy', cspHeader);
     ```
   - MUST restrict script sources to trusted domains.
   - MUST prevent inline scripts unless absolutely necessary.
   - MUST implement frame-ancestors restriction to prevent clickjacking.

4. **Sensitive Data Handling**:
   - MUST encrypt sensitive data before storing:
     ```typescript
     const encryptedData = encryptData(sensitiveValue);
     await sandbox.storage.setItem('sensitive-key', encryptedData);
     
     // When retrieving
     const encrypted = await sandbox.storage.getItem('sensitive-key');
     const decrypted = decryptData(encrypted);
     ```
   - MUST NOT store authentication tokens in localStorage:
     ```typescript
     // CORRECT: Store in memory or secure HTTP-only cookies
     // INCORRECT: localStorage.setItem('auth-token', token);
     ```
   - MUST implement proper cleanup of sensitive data:
     ```typescript
     // Clear sensitive data when no longer needed
     const clearSensitiveData = () => {
       setSensitiveData(null);
       // Other cleanup
     };
     ```
   - MUST use secure random values for session IDs and other security-critical values.

5. **Error Handling**:
   - MUST implement try/catch blocks for ALL external operations:
     ```typescript
     try {
       const response = await sandbox.fetch('https://api.example.com/data');
       // Process response
     } catch (error) {
       // Handle error appropriately
       setError('Failed to fetch data. Please try again.');
     }
     ```
   - MUST NOT expose detailed error information to users:
     ```typescript
     // CORRECT
     setError('Failed to process request. Please try again.');
     // Log detailed error for debugging
     console.error('Detailed error:', error);
     
     // INCORRECT
     setError(`SQL Error: ${error.message}`);
     ```
   - MUST log errors securely without exposing sensitive information.
   - MUST implement proper fallbacks for error states.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 5: Accessibility Implementation (STRICTLY ENFORCED)

**Trigger**: When creating any user interface component or module.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Semantic HTML**:
   - MUST use proper HTML elements:
     ```tsx
     // CORRECT
     <button onClick={handleAction}>Perform Action</button>
     
     // INCORRECT
     <div onClick={handleAction}>Perform Action</div>
     ```
   - MUST use heading elements in logical order:
     ```tsx
     <h1>Page Title</h1>
     <section>
       <h2>Section Heading</h2>
       <div>
         <h3>Subsection Heading</h3>
       </div>
     </section>
     ```
   - MUST use lists (ul, ol) for related items:
     ```tsx
     <ul>
       <li>Item 1</li>
       <li>Item 2</li>
     </ul>
     ```
   - MUST use tables only for tabular data, with proper headers.

2. **ARIA Attributes**:
   - MUST add aria-label to elements without visible text:
     ```tsx
     <button aria-label="Close dialog" onClick={onClose}>✕</button>
     ```
   - MUST use aria-live for dynamic content updates:
     ```tsx
     <div aria-live="polite" aria-atomic="true">
       {statusMessage}
     </div>
     ```
   - MUST implement aria-expanded, aria-pressed for interactive elements:
     ```tsx
     <button 
       aria-expanded={isExpanded} 
       onClick={() => setIsExpanded(!isExpanded)}
     >
       Toggle Section
     </button>
     ```
   - MUST add role attributes for non-standard UI patterns:
     ```tsx
     <div role="tablist">
       <button role="tab" aria-selected={activeTab === 0}>Tab 1</button>
       <button role="tab" aria-selected={activeTab === 1}>Tab 2</button>
     </div>
     ```
   - MUST use aria-hidden for decorative elements.

3. **Keyboard Navigation**:
   - ALL interactive elements MUST be focusable:
     ```tsx
     // ALL interactive elements must be naturally focusable
     // or have tabIndex={0}
     ```
   - MUST implement proper tab order:
     ```tsx
     // Natural tab order is preferred
     // Use tabIndex only when necessary
     ```
   - MUST support keyboard shortcuts with proper handling:
     ```tsx
     const handleKeyDown = (e: React.KeyboardEvent) => {
       if (e.key === 'Enter' || e.key === ' ') {
         handleAction();
         e.preventDefault();
       }
     };
     
     <button onKeyDown={handleKeyDown} onClick={handleAction}>
       Perform Action
     </button>
     ```
   - MUST provide visible focus indicators:
     ```css
     button:focus-visible {
       outline: 2px solid #4299e1;
       outline-offset: 2px;
     }
     ```
   - MUST ensure all functionality is available via keyboard.

4. **Color and Contrast**:
   - MUST ensure 4.5:1 contrast ratio for normal text, 3:1 for large text:
     ```css
     /* Good contrast */
     color: var(--text-color, #333333); /* on light background */
     color: var(--text-color-dark, #f0f0f0); /* on dark background */
     ```
   - MUST NOT use color as the only means of conveying information:
     ```tsx
     // CORRECT
     <div className="status-indicator">
       <div className={`status-icon ${status}`} aria-hidden="true" />
       <span>{statusText}</span>
     </div>
     
     // INCORRECT
     <div className={`status-indicator ${status}`} />
     ```
   - MUST support both light and dark modes:
     ```css
     :root {
       --text-color: #333333;
       --bg-color: #ffffff;
     }
     
     @media (prefers-color-scheme: dark) {
       :root {
         --text-color: #f0f0f0;
         --bg-color: #1a1a1a;
       }
     }
     ```
   - MUST test color contrast with a contrast checker.

5. **Focus Management**:
   - MUST manage focus programmatically when content changes:
     ```tsx
     const dialogRef = useRef<HTMLDivElement>(null);
     
     useEffect(() => {
       if (isOpen && dialogRef.current) {
         // Set focus to the dialog when it opens
         dialogRef.current.focus();
       }
     }, [isOpen]);
     ```
   - MUST return focus to triggering element when dialogs close:
     ```tsx
     const triggerRef = useRef<HTMLButtonElement>(null);
     
     const openDialog = () => {
       setIsOpen(true);
       // Store the currently focused element
       previousFocusRef.current = document.activeElement as HTMLElement;
     };
     
     const closeDialog = () => {
       setIsOpen(false);
       // Return focus to the previous element
       if (previousFocusRef.current) {
         previousFocusRef.current.focus();
       }
     };
     ```
   - MUST trap focus within modal dialogs:
     ```tsx
     const handleKeyDown = (e: React.KeyboardEvent) => {
       if (e.key === 'Tab') {
         // Trap focus within the dialog
         // Implementation depends on the specific UI library
       }
     };
     ```
   - MUST announce important changes with aria-live regions.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 6: Performance Optimization (STRICTLY ENFORCED)

**Trigger**: When implementing components, modules, or features.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Render Optimization**:
   - MUST use React.memo for components that render frequently:
     ```tsx
     export const ExpensiveComponent = React.memo(({ prop1, prop2 }) => {
       // Component implementation
     });
     ```
   - MUST use useCallback for event handlers passed to child components:
     ```tsx
     const handleClick = useCallback(() => {
       // Event handler implementation
     }, [dependencies]);
     ```
   - MUST use useMemo for expensive calculations:
     ```tsx
     const expensiveValue = useMemo(() => {
       return computeExpensiveValue(a, b);
     }, [a, b]);
     ```
   - MUST implement optimized rendering strategies for lists:
     ```tsx
     {items.map((item) => (
       <ItemComponent 
         key={item.id} // Stable, unique keys
         item={item}
       />
     ))}
     ```

2. **State Management Efficiency**:
   - MUST use selectors for targeted component updates:
     ```tsx
     // Only re-renders when relevant state changes
     const relevantState = useAppStore((state) => state.relevantField);
     ```
   - MUST structure state to minimize unnecessary rerenders:
     ```tsx
     // Split state to avoid unnecessary renders
     const [frequentlyChangingState, setFrequentlyChangingState] = useState(initialValue);
     const [rarelyChangingState, setRarelyChangingState] = useState(initialValue);
     ```
   - MUST implement proper dependency arrays in useEffect hooks:
     ```tsx
     useEffect(() => {
       // Effect implementation
     }, [/* Only dependencies actually used in the effect */]);
     ```
   - MUST use batched updates when multiple state changes occur together.

3. **Resource Management**:
   - MUST clean up ALL resources in useEffect cleanup functions:
     ```tsx
     useEffect(() => {
       const interval = setInterval(() => {
         // Implementation
       }, 1000);
       
       return () => {
         clearInterval(interval);
       };
     }, []);
     ```
   - MUST use AbortController for cancellable fetch requests:
     ```tsx
     useEffect(() => {
       const controller = new AbortController();
       const signal = controller.signal;
       
       fetchData(signal).catch(error => {
         if (error.name !== 'AbortError') {
           // Handle real errors
         }
       });
       
       return () => {
         controller.abort();
       };
     }, [fetchData]);
     ```
   - MUST properly dispose of event listeners:
     ```tsx
     useEffect(() => {
       window.addEventListener('resize', handleResize);
       
       return () => {
         window.removeEventListener('resize', handleResize);
       };
     }, [handleResize]);
     ```
   - MUST unsubscribe from subscriptions:
     ```tsx
     useEffect(() => {
       const unsubscribe = eventBus.on('event', handleEvent);
       
       return () => {
         unsubscribe();
       };
     }, [handleEvent]);
     ```

4. **Code Splitting and Lazy Loading**:
   - MUST implement lazy loading for large components/modules:
     ```tsx
     const LazyComponent = React.lazy(() => import('./LazyComponent'));
     
     // In the render function
     <Suspense fallback={<LoadingSpinner />}>
       <LazyComponent />
     </Suspense>
     ```
   - MUST use dynamic imports for code that isn't needed on initial load:
     ```tsx
     const loadFeature = async () => {
       const { feature } = await import('./feature');
       feature();
     };
     ```
   - MUST implement route-based code splitting:
     ```tsx
     // In app router configuration
     const Dashboard = React.lazy(() => import('./pages/Dashboard'));
     const Settings = React.lazy(() => import('./pages/Settings'));
     ```
   - MUST use proper loading states during code loading.

5. **Optimized Assets and Network**:
   - MUST optimize images and use appropriate formats:
     ```tsx
     <img 
       src={imageUrl}
       width={imageWidth}
       height={imageHeight}
       loading="lazy"
       alt="Description"
     />
     ```
   - MUST implement responsive images with srcset where appropriate:
     ```tsx
     <img 
       srcSet={`${smallImage} 400w, ${largeImage} 800w`}
       sizes="(max-width: 600px) 400px, 800px"
       src={fallbackImage}
       alt="Description"
     />
     ```
   - MUST load non-critical resources asynchronously:
     ```tsx
     // For non-critical scripts
     <script async src="non-critical.js"></script>
     ```
   - MUST implement proper caching strategies:
     ```typescript
     // In service worker
     workbox.routing.registerRoute(
       /\.(?:png|jpg|jpeg|svg|gif)$/,
       new workbox.strategies.CacheFirst({
         cacheName: 'images',
         plugins: [
           new workbox.expiration.ExpirationPlugin({
             maxEntries: 60,
             maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
           }),
         ],
       }),
     );
     ```

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 7: Code Cleaning (STRICTLY ENFORCED)

**Trigger**: After adding a component/feature or when asked to "Clean the codebase."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Run ESLint**: MUST use `eslint . --fix` and resolve ALL issues:
   ```bash
   eslint . --fix
   ```
   - MUST resolve any remaining issues that couldn't be automatically fixed.
   - MUST ensure ESLint configuration matches the project standards.

2. **Remove Dead Code**: MUST eliminate ALL:
   - Unused imports:
     ```typescript
     // REMOVE
     import { unused } from './module';
     ```
   - Unused variables:
     ```typescript
     // REMOVE
     const unusedVariable = 'value';
     ```
   - Unreachable code:
     ```typescript
     // REMOVE code after return
     return result;
     doSomething(); // Unreachable
     ```
   - Commented-out code:
     ```typescript
     // REMOVE
     // const oldImplementation = () => {
     //   // ...
     // };
     ```
   - Unused functions and components.

3. **Refactor Large Components**: MUST split ANY component exceeding 100 lines:
   - Extract repeating patterns into separate components:
     ```tsx
     // Extract to a separate component
     const ListItem = ({ item }) => (
       <li className="item">
         <h3>{item.title}</h3>
         <p>{item.description}</p>
       </li>
     );
     
     // Use in parent component
     const List = ({ items }) => (
       <ul>
         {items.map(item => <ListItem key={item.id} item={item} />)}
       </ul>
     );
     ```
   - Extract complex logic into custom hooks:
     ```tsx
     // Extract to a custom hook
     function useItemActions(item) {
       const handleEdit = useCallback(() => {
         // Edit logic
       }, [item]);
       
       const handleDelete = useCallback(() => {
         // Delete logic
       }, [item]);
       
       return { handleEdit, handleDelete };
     }
     
     // Use in component
     const ItemComponent = ({ item }) => {
       const { handleEdit, handleDelete } = useItemActions(item);
       // Component implementation
     };
     ```
   - Move utility functions to separate files.

4. **Remove Console Logs**: MUST delete ALL console statements from production code:
   ```typescript
   // REMOVE ALL of these
   console.log('Debug info');
   console.info('Info message');
   console.warn('Warning message');
   console.error('Error message');
   ```
   - MUST replace with proper error handling and logging mechanisms.
   - MUST ensure errors are properly tracked without exposing sensitive information.

5. **Check Types**: MUST ensure NO `any` types exist in the codebase:
   - Replace `any` with proper types:
     ```typescript
     // INCORRECT
     const handleData = (data: any) => {
       // Implementation
     };
     
     // CORRECT
     interface DataType {
       id: string;
       value: number;
     }
     
     const handleData = (data: DataType) => {
       // Implementation
     };
     ```
   - Use `unknown` with type guards instead of `any`:
     ```typescript
     // CORRECT
     const handleData = (data: unknown) => {
       if (
         typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         typeof data.id === 'string'
       ) {
         // Now TypeScript knows data has an id property of type string
         processData(data.id);
       }
     };
     ```
   - Use assertion functions when appropriate:
     ```typescript
     function assertIsDataType(value: unknown): asserts value is DataType {
       if (
         typeof value !== 'object' || 
         value === null || 
         !('id' in value) || 
         typeof value.id !== 'string'
       ) {
         throw new Error('Value is not a DataType');
       }
     }
     
     const handleData = (data: unknown) => {
       assertIsDataType(data);
       // Now TypeScript knows data is DataType
       processData(data.id);
     };
     ```

6. **Check for Memory Leaks**: MUST verify ALL resources are properly cleaned up:
   - Verify all useEffect hooks have proper cleanup:
     ```typescript
     // CORRECT
     useEffect(() => {
       const timer = setTimeout(() => {
         // Implementation
       }, 1000);
       
       return () => {
         clearTimeout(timer);
       };
     }, []);
     ```
   - Verify all event listeners are removed:
     ```typescript
     // CORRECT
     useEffect(() => {
       document.addEventListener('click', handleClick);
       
       return () => {
         document.removeEventListener('click', handleClick);
       };
     }, [handleClick]);
     ```
   - Verify all subscriptions are unsubscribed:
     ```typescript
     // CORRECT
     useEffect(() => {
       const subscription = observable.subscribe(handleUpdate);
       
       return () => {
         subscription.unsubscribe();
       };
     }, [observable, handleUpdate]);
     ```

7. **Check TODOs**: MUST highlight ALL `// TODO` comments and present them to the user:
   ```typescript
   // TODO: Implement error handling
   // TODO: Optimize performance
   // TODO: Add tests
   ```
   - MUST categorize TODOs by priority (critical, important, nice-to-have).
   - MUST indicate which TODOs should be resolved immediately.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 8: File Organization (STRICTLY ENFORCED)

**Trigger**: When creating/moving files or asked to "Organize the codebase."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Folder Structure**: MUST adhere to this EXACT structure:
   ```
   components/
     ui/                   # Base UI components (Button, Input, etc.)
       [ComponentName]/
     layout/               # Layout components (Header, Sidebar, etc.)
       [ComponentName]/
     modules/              # Dashboard modules
       [moduleName]/
   lib/
     stores/               # Zustand stores
     modules/              # Module definitions
       [moduleName]/
     events/               # Event bus
     utils/                # Utility functions
     hooks/                # Custom hooks
   types/                  # Type definitions
   app/                    # Next.js app router pages
     (auth)/               # Auth-related routes
     (dashboard)/          # Dashboard routes
   middleware.ts           # Next.js middleware for security headers
   ```
   - MUST create new files in the appropriate directories.
   - MUST move existing files to their correct locations.
   - MUST maintain proper directory structure when creating new features.

2. **Naming Conventions**: MUST follow these conventions WITHOUT EXCEPTION:
   - Files: kebab-case (e.g., `module-wrapper.tsx`)
   - Components/Types: PascalCase (e.g., `ModuleWrapper`)
   - Variables/Functions: camelCase (e.g., `handleSettingsChange`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_MODULE_COUNT`)
   - Store files: camelCase with "Store" suffix (e.g., `dashboardStore.ts`)
   - Atom files: camelCase with "Atoms" suffix (e.g., `metronomeAtoms.ts`)
   - Barrel files: always named `index.ts`
   - Test files: match component name with `.test.tsx` suffix (e.g., `ModuleWrapper.test.tsx`)
   - Story files: match component name with `.stories.tsx` suffix (e.g., `ModuleWrapper.stories.tsx`)

3. **Import Order**: MUST organize imports in this order:
   ```typescript
   // 1. React imports
   import React, { useEffect, useState } from 'react';
   
   // 2. External library imports
   import { useAtom } from 'jotai';
   import { motion } from 'framer-motion';
   
   // 3. Internal absolute imports (starting with @/)
   import { moduleRegistry } from '@/lib/modules/moduleRegistry';
   import { useAppStore } from '@/lib/stores/appStore';
   
   // 4. Internal relative imports
   import { SomeComponent } from './SomeComponent';
   import { useLocalState } from './hooks';
   
   // 5. CSS imports
   import './ComponentName.css';
   ```
   - MUST group imports by category with a blank line between groups.
   - MUST sort imports alphabetically within each group.
   - MUST use consistent import style (named vs default) throughout the codebase.

4. **Export Patterns**: MUST use consistent export patterns:
   - Named exports for most components and utilities:
     ```typescript
     export const ComponentName = () => {
       // Implementation
     };
     
     export function utilityFunction() {
       // Implementation
     }
     ```
   - Default exports only for page components or when a file has a single primary export:
     ```typescript
     const PageComponent = () => {
       // Implementation
     };
     
     export default PageComponent;
     ```
   - Barrel exports through index.ts for related items:
     ```typescript
     // index.ts
     export * from './ComponentName';
     export * from './utils';
     ```

5. **File Content Organization**: MUST organize file content consistently:
   - Types and interfaces at the top:
     ```typescript
     interface ComponentProps {
       // Props definition
     }
     
     type ComponentState = {
       // State definition
     };
     ```
   - Constants next:
     ```typescript
     const DEFAULT_VALUE = 42;
     const OPTIONS = ['option1', 'option2', 'option3'];
     ```
   - Helper functions before the main component:
     ```typescript
     function formatValue(value: number): string {
       return `${value.toFixed(2)}`;
     }
     ```
   - Main component/function last:
     ```typescript
     export const ComponentName: React.FC<ComponentProps> = (props) => {
       // Component implementation
     };
     ```

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 9: Git and Workflow Practices (STRICTLY ENFORCED)

**Trigger**: When making code changes, committing, or creating a PR.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Branch Management**:
   - MUST create feature branches from main/development:
     ```bash
     git checkout main
     git pull
     git checkout -b feature/[feature-name]
     ```
   - MUST name branches according to this pattern:
     - Feature branches: `feature/[feature-name]`
     - Bugfix branches: `bugfix/[bug-name]`
     - Hotfix branches: `hotfix/[hotfix-name]`
     - Release branches: `release/[version]`
   - MUST keep branches focused on a single feature or bugfix.
   - MUST regularly sync branches with the base branch:
     ```bash
     git fetch
     git rebase origin/main
     ```

2. **Commits**:
   - MUST create atomic commits (one logical change per commit):
     ```bash
     # Add only related files
     git add path/to/related/files
     git commit -m "[type]: [Description]"
     ```
   - MUST follow this commit message format:
     - Format: `[type]: [Description]`
     - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
     - Examples:
       ```
       feat: Add MetronomeModule component
       fix: Resolve memory leak in Timer module
       refactor: Optimize Dashboard grid performance
       ```
   - MUST write descriptive commit messages:
     - First line MUST be a summary under 72 characters
     - MUST use imperative mood ("Add" not "Added" or "Adds")
     - MUST describe what was changed and why
   - MUST NOT commit:
     - Generated files (`build/`, `dist/`, `node_modules/`)
     - Temporary files (`.DS_Store`, `.log`, etc.)
     - Environment files (`.env`, `.env.local`)

3. **Pre-Commit Checks**:
   - MUST run linting before commit:
     ```bash
     npm run lint
     ```
   - MUST run type checking:
     ```bash
     npm run typecheck
     ```
   - MUST run tests:
     ```bash
     npm run test
     ```
   - MUST fix ALL issues before committing.
   - MUST set up Husky for automated pre-commit checks:
     ```bash
     # In .husky/pre-commit
     npm run lint && npm run typecheck && npm run test
     ```

4. **Pull Requests**:
   - MUST create a PR for every feature/bugfix:
     ```
     Title: [type]: [Brief description]
     
     Description:
     - What this PR does
     - How to test it
     - Screenshots if applicable
     - Related issue numbers
     ```
   - MUST include comprehensive descriptions:
     - What changes were made
     - Why they were necessary
     - How to test the changes
     - Screenshots for UI changes
   - MUST link to related issues:
     ```
     Fixes #123
     Addresses #456
     ```
   - MUST respond to review comments promptly.
   - MUST update PR with requested changes.

5. **Code Review**:
   - MUST request code review from at least one peer.
   - MUST address ALL review comments before merging.
   - MUST NOT merge your own PRs without review approval.
   - MUST verify CI/CD pipeline passes before merging:
     - Linting
     - Type checking
     - Tests
     - Build process

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 10: Documentation Requirements (STRICTLY ENFORCED)

**Trigger**: When implementing components, modules, or features.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Component Documentation**:
   - MUST document props with JSDoc comments:
     ```tsx
     /**
      * Button component with various styles and states.
      *
      * @param {ButtonProps} props - The component props
      * @returns {React.ReactElement} The Button component
      */
     export const Button: React.FC<ButtonProps> = ({
       /**
        * Button variant style
        * @default 'primary'
        */
       variant = 'primary',
       
       /**
        * Button content
        */
       children,
       
       /**
        * Click handler
        */
       onClick,
       
       /**
        * Disabled state
        * @default false
        */
       disabled = false,
     }) => {
       // Implementation
     };
     ```
   - MUST explain complex rendering logic:
     ```tsx
     // Determine button style based on variant and state
     const getButtonClassName = () => {
       // Base class
       let className = 'button';
       
       // Add variant-specific class
       className += ` button--${variant}`;
       
       // Add state-specific classes
       if (disabled) {
         className += ' button--disabled';
       }
       
       if (isLoading) {
         className += ' button--loading';
       }
       
       return className;
     };
     ```
   - MUST document keyboard interactions and accessibility features:
     ```tsx
     /**
      * Dropdown component with keyboard navigation support.
      * 
      * Keyboard interactions:
      * - Space/Enter: Open/close dropdown
      * - Arrow Down: Move to next item
      * - Arrow Up: Move to previous item
      * - Escape: Close dropdown
      * - Home: Move to first item
      * - End: Move to last item
      */
     ```

2. **Module Documentation**:
   - MUST document module purpose and capabilities:
     ```tsx
     /**
      * Timer Module for the dashboard.
      * 
      * Features:
      * - Countdown timer with start, pause, and reset
      * - Configurable duration
      * - Optional alarm sound on completion
      * - Visual progress indicator
      */
     ```
   - MUST document permissions required:
     ```tsx
     /**
      * Required permissions:
      * - audio:play - For playing alarm sounds
      * - storage:read, storage:write - For saving timer preferences
      */
     ```
   - MUST document settings schema:
     ```tsx
     /**
      * Settings schema:
      * - duration: number (seconds, 1-3600)
      * - autoStart: boolean
      * - alarmSound: boolean
      * - showSeconds: boolean
      */
     ```
   - MUST provide usage examples:
     ```tsx
     /**
      * Usage:
      * 
      * <TimerModule
      *   id="timer-1"
      *   settings={{
      *     duration: 60,
      *     autoStart: false,
      *     alarmSound: true,
      *     showSeconds: true
      *   }}
      *   onSettingsChange={handleSettingsChange}
      *   isEditing={false}
      * />
      */
     ```

3. **API Documentation**:
   - MUST document parameters and return types:
     ```tsx
     /**
      * Fetches user data from the API.
      * 
      * @param {string} userId - The ID of the user to fetch
      * @param {RequestOptions} [options] - Optional request configuration
      * @returns {Promise<User>} The user data
      * @throws {ApiError} If the user is not found or the request fails
      */
     export async function fetchUser(
       userId: string, 
       options?: RequestOptions
     ): Promise<User> {
       // Implementation
     }
     ```
   - MUST document error handling behavior:
     ```tsx
     /**
      * Error handling:
      * - 404: Returns null instead of throwing
      * - 401/403: Redirects to login page
      * - Other errors: Throws with error message
      */
     ```
   - MUST document side effects:
     ```tsx
     /**
      * Side effects:
      * - Updates the auth store with the user's session
      * - Logs the request to the telemetry service
      */
     ```
   - MUST document rate limits and performance considerations:
     ```tsx
     /**
      * Note: This API is rate-limited to 100 requests per hour.
      * Response time can be slow (up to 2s) for users with many records.
      */
     ```

4. **State Management Documentation**:
   - MUST document store structure and purpose:
     ```tsx
     /**
      * Dashboard Store
      * 
      * Manages the state of dashboard configuration including:
      * - Dashboard metadata (name, description)
      * - Module layout and configuration
      * - Edit mode state
      * - Dashboard persistence and syncing
      */
     ```
   - MUST document atoms and their usage:
     ```tsx
     /**
      * Timer Atoms
      * 
      * State atoms:
      * - durationAtom: Current timer duration in seconds
      * - remainingTimeAtom: Time remaining in seconds
      * - isRunningAtom: Whether the timer is currently running
      * 
      * Action atoms:
      * - startTimerAtom: Starts the timer
      * - pauseTimerAtom: Pauses the timer
      * - resetTimerAtom: Resets the timer to the initial duration
      */
     ```
   - MUST document event types and payloads:
     ```tsx
     /**
      * Event: 'module:state-changed'
      * 
      * Emitted when a module's state changes in a way that might
      * be relevant to other modules.
      * 
      * Payload:
      * - moduleId: ID of the module that changed
      * - moduleType: Type of the module
      * - state: Object containing the changed state properties
      */
     ```
   - MUST document persistence behavior:
     ```tsx
     /**
      * Persistence:
      * - Settings are saved to local storage
      * - Synced to server on dashboard save
      * - Sensitive data is encrypted before storage
      */
     ```

5. **README Documentation**:
   - MUST maintain up-to-date README files:
     - Root README with project overview
     - Component README files for complex components
     - Module README files for each module type
   - MUST include installation and setup instructions:
     ```markdown
     ## Setup
     
     1. Clone the repository
     2. Install dependencies: `npm install`
     3. Start the development server: `npm run dev`
     ```
   - MUST document architecture decisions:
     ```markdown
     ## Architecture
     
     - **State Management**: Hybrid approach with Zustand for global state and Jotai for module-specific state
     - **Module System**: Sandboxed modules with permission-based capabilities
     - **UI Components**: Reusable, accessible components with Storybook documentation
     ```
   - MUST include developer guides:
     ```markdown
     ## Developer Guide
     
     ### Adding a New Module
     
     1. Create module atoms in `lib/modules/[moduleName]/`
     2. Implement module component in `components/modules/[moduleName]/`
     3. Register module in `lib/modules/moduleRegistration.ts`
     4. Add tests and documentation
     ```

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Example: Creating a Module (MANDATORY REFERENCE IMPLEMENTATION)

When asked to "Create a Timer module for the dashboard," the AI MUST produce EXACTLY:

1. **Module Atoms Definition**:
```typescript
// lib/modules/timer/timerAtoms.ts
import { atom } from 'jotai';
import { z } from 'zod';
import { moduleAtomsRegistry, createBaseModuleAtoms } from '@/lib/modules/moduleAtomsRegistry';
import { eventBus } from '@/lib/events/eventBus';

// Define schema for validation
export const timerSettingsSchema = z.object({
  duration: z.number().min(1).max(3600).default(60),
  autoStart: z.boolean().default(false),
  alarmSound: z.boolean().default(true),
  showSeconds: z.boolean().default(true),
});

// Type for timer settings
export type TimerSettings = z.infer<typeof timerSettingsSchema>;

// Default settings
export const defaultTimerSettings: TimerSettings = {
  duration: 60,
  autoStart: false,
  alarmSound: true,
  showSeconds: true,
};

// Type for timer atoms
export interface TimerAtoms extends BaseModuleAtoms {
  durationAtom: ReturnType<typeof atom<number>>;
  remainingTimeAtom: ReturnType<typeof atom<number>>;
  isRunningAtom: ReturnType<typeof atom<boolean>>;
  alarmSoundAtom: ReturnType<typeof atom<boolean>>;
  showSecondsAtom: ReturnType<typeof atom<boolean>>;
  
  // Actions
  startTimerAtom: ReturnType<typeof atom<void, [], void>>;
  pauseTimerAtom: ReturnType<typeof atom<void, [], void>>;
  resetTimerAtom: ReturnType<typeof atom<void, [], void>>;
  setDurationAtom: ReturnType<typeof atom<void, [number], void>>;
}

// Create timer atoms
export function createTimerAtoms(moduleId: string): TimerAtoms {
  // Get base atoms
  const baseAtoms = createBaseModuleAtoms(moduleId);
  
  // Create atoms
  const durationAtom = atom(60);
  const remainingTimeAtom = atom(60);
  const isRunningAtom = atom(false);
  const alarmSoundAtom = atom(true);
  const showSecondsAtom = atom(true);
  
  // Actions
  const startTimerAtom = atom(
    null,
    (get, set) => {
      set(isRunningAtom, true);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { isRunning: true },
        moduleId,
        'timer'
      );
    }
  );
  
  const pauseTimerAtom = atom(
    null,
    (get, set) => {
      set(isRunningAtom, false);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { isRunning: false },
        moduleId,
        'timer'
      );
    }
  );
  
  const resetTimerAtom = atom(
    null,
    (get, set) => {
      const duration = get(durationAtom);
      set(remainingTimeAtom, duration);
      set(isRunningAtom, false);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { 
          isRunning: false,
          remainingTime: duration 
        },
        moduleId,
        'timer'
      );
    }
  );
  
  const setDurationAtom = atom(
    null,
    (get, set, duration: number) => {
      set(durationAtom, duration);
      set(remainingTimeAtom, duration);
      
      // Emit event
      eventBus.emit(
        'module:state-changed',
        { duration },
        moduleId,
        'timer'
      );
    }
  );
  
  return {
    ...baseAtoms,
    durationAtom,
    remainingTimeAtom,
    isRunningAtom,
    alarmSoundAtom,
    showSecondsAtom,
    startTimerAtom,
    pauseTimerAtom,
    resetTimerAtom,
    setDurationAtom,
  };
}

// Register atom creator
moduleAtomsRegistry.registerAtomCreator<TimerAtoms>('timer', createTimerAtoms);

// Export for convenience
export default createTimerAtoms;
```

2. **Timer Module Component**:
```tsx
// components/modules/timer/TimerModule.tsx
import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { moduleAtomsRegistry } from '@/lib/modules/moduleAtomsRegistry';
import { TimerAtoms } from '@/lib/modules/timer/timerAtoms';
import { ModuleProps } from '@/types/module';
import { useModuleSandbox } from '@/lib/modules/moduleContext';
import './TimerModule.css';

/**
 * Timer Module for the dashboard.
 * 
 * Features:
 * - Countdown timer with start, pause, and reset
 * - Configurable duration
 * - Optional alarm sound on completion
 * - Visual progress indicator
 *
 * Required permissions:
 * - audio:play - For playing alarm sounds
 */
export const TimerModule: React.FC<ModuleProps> = ({ 
  id, 
  settings, 
  onSettingsChange, 
  isEditing,
  containerWidth,
  containerHeight
}) => {
  // Get module atoms
  const atoms = moduleAtomsRegistry.getModuleAtoms<TimerAtoms>('timer', id);
  
  // Get module sandbox
  const sandbox = useModuleSandbox();
  
  // Use atoms with Jotai
  const [duration, setDuration] = useAtom(atoms.durationAtom);
  const [remainingTime, setRemainingTime] = useAtom(atoms.remainingTimeAtom);
  const [isRunning, setIsRunning] = useAtom(atoms.isRunningAtom);
  const [alarmSound, setAlarmSound] = useAtom(atoms.alarmSoundAtom);
  const [showSeconds, setShowSeconds] = useAtom(atoms.showSecondsAtom);
  
  // Actions
  const [, startTimer] = useAtom(atoms.startTimerAtom);
  const [, pauseTimer] = useAtom(atoms.pauseTimerAtom);
  const [, resetTimer] = useAtom(atoms.resetTimerAtom);
  const [, setDurationAtom] = useAtom(atoms.setDurationAtom);
  
  // Refs
  const intervalRef = useRef<number | null>(null);
  const alarmSoundIdRef = useRef<string | null>(null);
  
  // Sync settings with Zustand store
  useEffect(() => {
    if (settings.duration !== undefined && settings.duration !== duration) {
      setDuration(settings.duration as number);
      if (!isRunning) {
        setRemainingTime(settings.duration as number);
      }
    }
    
    if (settings.alarmSound !== undefined && settings.alarmSound !== alarmSound) {
      setAlarmSound(settings.alarmSound as boolean);
    }
    
    if (settings.showSeconds !== undefined && settings.showSeconds !== showSeconds) {
      setShowSeconds(settings.showSeconds as boolean);
    }
    
    if (settings.autoStart && !isRunning && remainingTime === duration) {
      startTimer();
    }
  }, [
    settings, 
    duration, setDuration, 
    remainingTime, setRemainingTime,
    alarmSound, setAlarmSound,
    showSeconds, setShowSeconds,
    isRunning, startTimer
  ]);
  
  // Save settings to Zustand store
  useEffect(() => {
    const newSettings = {
      duration,
      autoStart: settings.autoStart || false,
      alarmSound,
      showSeconds,
    };
    
    onSettingsChange(newSettings);
  }, [
    duration, alarmSound, showSeconds, 
    settings.autoStart, onSettingsChange
  ]);
  
  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          
          // If timer completes
          if (newTime === 0 && prevTime !== 0) {
            pauseTimer();
            
            // Play alarm sound if enabled
            if (alarmSound) {
              playAlarmSound();
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, alarmSound, pauseTimer, setRemainingTime]);
  
  // Play alarm sound
  const playAlarmSound = async () => {
    try {
      const soundId = await sandbox.audio.playSound('/sounds/alarm.mp3', {
        volume: 0.8,
        id: 'timer-alarm',
      });
      
      alarmSoundIdRef.current = soundId;
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${
      remainingSeconds.toString().padStart(2, '0')
    }`;
  };
  
  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value, 10);
    setDurationAtom(newDuration);
  };
  
  // Stop alarm sound
  const stopAlarm = () => {
    if (alarmSoundIdRef.current) {
      sandbox.audio.stopSound(alarmSoundIdRef.current);
      alarmSoundIdRef.current = null;
    }
  };
  
  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);
  
  // Reset and stop alarm when reset button is clicked
  const handleReset = () => {
    stopAlarm();
    resetTimer();
  };
  
  return (
    <div 
      className={`timer-module ${isRunning ? 'is-running' : ''} ${
        remainingTime === 0 ? 'is-completed' : ''
      }`}
      role="timer"
      aria-label="Timer"
    >
      <div className="timer-display" aria-live="polite">
        {formatTime(remainingTime)}
      </div>
      
      <div className="timer-controls">
        {!isRunning ? (
          <button 
            className="timer-button start-button"
            onClick={() => startTimer()}
            aria-label="Start timer"
            disabled={remainingTime === 0}
          >
            Start
          </button>
        ) : (
          <button 
            className="timer-button pause-button"
            onClick={() => pauseTimer()}
            aria-label="Pause timer"
          >
            Pause
          </button>
        )}
        
        <button 
          className="timer-button reset-button"
          onClick={handleReset}
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
      
      {isEditing && (
        <div className="timer-settings">
          <div className="settings-row">
            <label className="setting-label">
              Duration (seconds):
              <input
                type="range"
                min="1"
                max="3600"
                value={duration}
                onChange={handleDurationChange}
                className="duration-slider"
                aria-label={`Duration: ${duration} seconds`}
              />
              <span className="duration-value">{duration}s</span>
            </label>
          </div>
          
          <div className="settings-row">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={alarmSound}
                onChange={() => setAlarmSound(!alarmSound)}
                aria-label="Play alarm sound when timer completes"
              />
              Alarm Sound
            </label>
            
            <label className="setting-label">
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={() => setShowSeconds(!showSeconds)}
                aria-label="Show seconds in timer display"
              />
              Show Seconds
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerModule;
```

3. **Module CSS**:
```css
/* components/modules/timer/TimerModule.css */
.timer-module {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  background-color: var(--module-bg-color, #ffffff);
  transition: background-color 0.2s;
}

.timer-display {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--timer-color, #4a5568);
  font-family: monospace;
}

.timer-module.is-running .timer-display {
  color: var(--timer-running-color, #3182ce);
}

.timer-module.is-completed .timer-display {
  color: var(--timer-completed-color, #e53e3e);
  animation: pulse 1.5s infinite;
}

.timer-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.timer-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.timer-button:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.timer-button:active {
  transform: scale(0.98);
}

.start-button {
  background-color: var(--start-button-bg, #4299e1);
  color: white;
}

.start-button:hover:not(:disabled) {
  background-color: var(--start-button-hover-bg, #3182ce);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pause-button {
  background-color: var(--pause-button-bg, #f6ad55);
  color: white;
}

.pause-button:hover {
  background-color: var(--pause-button-hover-bg, #ed8936);
}

.reset-button {
  background-color: var(--reset-button-bg, #e2e8f0);
  color: var(--reset-button-color, #4a5568);
}

.reset-button:hover {
  background-color: var(--reset-button-hover-bg, #cbd5e0);
}

.timer-settings {
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

.duration-slider {
  flex: 1;
  margin: 0 8px;
}

.duration-value {
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .timer-module {
    --module-bg-color: #1a202c;
    --timer-color: #e2e8f0;
    --timer-running-color: #63b3ed;
    --timer-completed-color: #fc8181;
    --start-button-bg: #4299e1;
    --start-button-hover-bg: #3182ce;
    --pause-button-bg: #f6ad55;
    --pause-button-hover-bg: #ed8936;
    --reset-button-bg: #2d3748;
    --reset-button-color: #e2e8f0;
    --reset-button-hover-bg: #4a5568;
    --divider-color: #4a5568;
    --text-color: #e2e8f0;
  }
}
```

4. **Module Index Export**:
```typescript
// components/modules/timer/index.ts
export * from './TimerModule';
export { default } from './TimerModule';
```

5. **Module Registration**:
```typescript
// lib/modules/moduleRegistration.ts (update to include Timer)
import { moduleRegistry } from './moduleRegistry';
import { timerSettingsSchema, defaultTimerSettings } from './timer/timerAtoms';
import TimerModule from '@/components/modules/timer/TimerModule';

// Register Timer module
moduleRegistry.register({
  type: 'timer',
  name: 'Timer',
  description: 'Countdown timer with alarm',
  version: '1.0.0',
  compatibleWith: ['1.0.0', '*'],
  category: 'Productivity',
  icon: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  defaultSize: { width: 3, height: 3 },
  defaultSettings: defaultTimerSettings,
  permissions: ['audio:play'],
  settingsSchema: timerSettingsSchema,
  Component: TimerModule,
});
```

6. **Module Tests**:
```tsx
// components/modules/timer/TimerModule.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'jotai';
import { TimerModule } from './TimerModule';
import { moduleAtomsRegistry } from '@/lib/modules/moduleAtomsRegistry';

// Mock the module sandbox
jest.mock('@/lib/modules/moduleContext', () => ({
  useModuleSandbox: () => ({
    audio: {
      playSound: jest.fn().mockResolvedValue('test-sound-id'),
      stopSound: jest.fn(),
    },
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
    },
    moduleId: 'test-timer-id',
    permissions: ['audio:play'],
  }),
}));

// Import timer atoms to register them
import '@/lib/modules/timer/timerAtoms';

// Mock timer
jest.useFakeTimers();

describe('TimerModule', () => {
  const defaultProps = {
    id: 'test-timer',
    settings: {
      duration: 60,
      autoStart: false,
      alarmSound: true,
      showSeconds: true,
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
        <TimerModule {...defaultProps} />
      </Provider>
    );
    
    // Check that the time is displayed
    expect(screen.getByText('01:00')).toBeInTheDocument();
    
    // Check that the start button is present
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset timer/i })).toBeInTheDocument();
  });
  
  it('starts countdown when start button is clicked', () => {
    render(
      <Provider>
        <TimerModule {...defaultProps} />
      </Provider>
    );
    
    // Click start button
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    
    // Pause button should now be visible
    expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument();
    
    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Time should now be 58 seconds
    expect(screen.getByText('00:58')).toBeInTheDocument();
  });
  
  it('pauses countdown when pause button is clicked', () => {
    render(
      <Provider>
        <TimerModule {...defaultProps} />
      </Provider>
    );
    
    // Start timer
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    
    // Advance timer by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Time should now be 55 seconds
    expect(screen.getByText('00:55')).toBeInTheDocument();
    
    // Pause timer
    fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));
    
    // Advance timer more
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Time should still be 55 seconds (paused)
    expect(screen.getByText('00:55')).toBeInTheDocument();
  });
  
  it('resets timer when reset button is clicked', () => {
    render(
      <Provider>
        <TimerModule {...defaultProps} />
      </Provider>
    );
    
    // Start timer
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    
    // Advance timer by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Reset timer
    fireEvent.click(screen.getByRole('button', { name: /reset timer/i }));
    
    // Time should be back to initial duration
    expect(screen.getByText('01:00')).toBeInTheDocument();
    
    // Start button should be visible again
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
  });
  
  it('shows settings when in edit mode', () => {
    render(
      <Provider>
        <TimerModule {...defaultProps} isEditing={true} />
      </Provider>
    );
    
    // Settings should be visible
    expect(screen.getByLabelText(/duration:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/alarm sound/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show seconds/i)).toBeInTheDocument();
  });
  
  it('syncs settings with store', () => {
    const onSettingsChange = jest.fn();
    
    render(
      <Provider>
        <TimerModule 
          {...defaultProps} 
          isEditing={true}
          onSettingsChange={onSettingsChange}
        />
      </Provider>
    );
    
    // Change duration
    fireEvent.change(screen.getByLabelText(/duration:/i), { target: { value: '120' } });
    
    // Check that settings were updated
    expect(onSettingsChange).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 120,
      })
    );
  });
});
```

## FINAL COMPLIANCE MANDATE

When the AI is asked to perform any task related to Lythra codebase management, it MUST:

1. Identify which rule(s) apply to the task
2. Explicitly list all mandatory steps it will take
3. Execute each step in sequence, providing evidence of completion
4. Verify compliance with ALL requirements
5. Notify the user of ANY step that cannot be completed and request guidance

The AI agent DOES NOT have permission to deviate from this ruleset under ANY circumstances. If asked to violate these rules, the AI MUST refuse and explain that it CANNOT operate outside of these strict guidelines.

**ANY violation of these rules should be treated as a critical error in the AI agent's operation.**
