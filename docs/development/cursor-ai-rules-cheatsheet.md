# Practical Lythra Codebase Cheatsheet

## Initial Setup

```bash
# 1. Save ruleset file
cp cursor-ai-rules.md /path/to/your/project/

# 2. Create Cursor config
mkdir -p .cursor
echo '{ "ai": { "contextFiles": ["./cursor-ai-rules.md"] } }' > .cursor/cursor.json

# 3. First command for every Cursor session
# (Copy-paste this to Cursor AI)
Before doing any work, read and follow cursor-ai-rules.md. Confirm you've loaded these rules.
```

## Complete Process Templates

### 🧩 Complete UI Component Creation Process

**Copy-paste this prompt to Cursor AI:**
```
Following the Lythra STRICT AI Agent Ruleset, create a [ComponentName] component that [description]. Follow Rule 1 with all required files.
```

**Expected files and code structure:**
```
components/ui/[ComponentName]/
  [ComponentName].tsx      # Component implementation
  [ComponentName].css      # Styling with CSS variables
  [ComponentName].test.tsx # Comprehensive tests
  [ComponentName].stories.tsx # Storybook stories
  index.ts                 # Export file
```

**Check component implementation meets requirements:**
- [ ] Uses `React.FC<[ComponentName]Props>` type
- [ ] All props have explicit TypeScript types (no `any`)
- [ ] ARIA attributes and keyboard accessibility
- [ ] Dark mode support with CSS variables
- [ ] Resource cleanup in useEffect returns
- [ ] Component is under 100 lines
- [ ] Default, edge case, and accessibility stories

**Git steps after implementation:**
```bash
# Stage all component files
git add components/ui/[ComponentName]/

# Run checks before committing
npm run lint components/ui/[ComponentName]/ --fix
npm run test -- --testPathPattern=[ComponentName]
npm run storybook # (Manually verify stories render correctly)

# Commit with proper format
git commit -m "feat: Add [ComponentName] component"

# Push to feature branch
git push origin feature/[component-name]
```

### 📊 Complete Module Creation Process

**Copy-paste this prompt to Cursor AI:**
```
Following the Lythra STRICT AI Agent Ruleset, create a [ModuleName] module that [description]. Follow Rule 2 with proper state management, security, and accessibility.
```

**Expected files and code structure:**
```
lib/modules/[moduleName]/
  [moduleName]Atoms.ts     # Jotai atoms, Zod schema
  index.ts                 # Export file

components/modules/[moduleName]/
  [ModuleName]Module.tsx   # Module implementation
  [ModuleName]Module.css   # Styling with dark mode
  [ModuleName]Module.test.tsx # Tests
  index.ts                 # Export file
```

**Implementation checklist:**
1. **In [moduleName]Atoms.ts:**
   - [ ] Zod schema for settings validation
   - [ ] Default settings object
   - [ ] Atom creator function with proper types
   - [ ] Registration with moduleAtomsRegistry

2. **In [ModuleName]Module.tsx:**
   - [ ] Uses ModuleProps interface
   - [ ] Gets atoms from registry
   - [ ] Uses module sandbox for permissions
   - [ ] Syncs settings with parent store
   - [ ] Implements proper cleanup
   - [ ] ARIA attributes and keyboard support

3. **Register module:**
   - [ ] Update moduleRegistration.ts to include module
   - [ ] Specify permissions, default size, category

**Git steps after implementation:**
```bash
# Stage all module files
git add lib/modules/[moduleName]/ components/modules/[moduleName]/ lib/modules/moduleRegistration.ts

# Run checks before committing
npm run lint
npm run test -- --testPathPattern=[ModuleName]

# Commit changes in sequence
git commit -m "feat: Add [ModuleName]Module component"
git add lib/modules/[moduleName]/
git commit -m "feat: Add [ModuleName] module state management"
git add lib/modules/moduleRegistration.ts
git commit -m "feat: Register [ModuleName] module in registry"

# Push to feature branch
git push origin feature/module-[module-name]
```

### 🧹 Complete Code Cleaning Process

**Copy-paste this prompt to Cursor AI:**
```
Following the Lythra STRICT AI Agent Ruleset, clean the codebase according to Rule 7. Run ESLint, remove dead code, check for memory leaks, and ensure proper type safety.
```

**Step-by-step process:**
```bash
# 1. Run ESLint to fix auto-fixable issues
npx eslint . --fix

# 2. Run TypeScript compiler in strict mode
npx tsc --noEmit

# 3. Find and fix remaining issues
```

**Common issues checklist:**
- [ ] Remove unused imports and variables
- [ ] Remove console.log statements
- [ ] Replace any `any` types with proper types
- [ ] Check useEffect cleanup for resources:
  - [ ] clearInterval/clearTimeout
  - [ ] Event listener removals
  - [ ] Subscription unsubscribes
- [ ] Split components over 100 lines
- [ ] Check for memory leaks
- [ ] Ensure proper error handling

**Git steps after cleaning:**
```bash
# Stage cleaned files (be selective)
git add [files-that-were-cleaned]

# Run checks before committing
npm run test

# Commit with proper format
git commit -m "refactor: Clean codebase and fix type issues"

# Push to branch
git push origin [branch-name]
```

### 🔒 Security Implementation Process

**Copy-paste this prompt to Cursor AI:**
```
Following the Lythra STRICT AI Agent Ruleset, implement security features for [component/module/feature] according to Rule 4.
```

**Input validation with Zod implementation:**
```typescript
// Define the schema
const userInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100)
});

type UserInput = z.infer<typeof userInputSchema>;

// Validate input
function handleSubmit(data: unknown) {
  const result = userInputSchema.safeParse(data);
  
  if (!result.success) {
    // Handle validation errors
    const formattedErrors = result.error.format();
    setErrors(formattedErrors);
    return;
  }
  
  // Use validated data safely
  const validatedData = result.data;
  processUserData(validatedData);
}
```

**Module sandbox usage:**
```typescript
// In a module component
const sandbox = useModuleSandbox();

// Check permissions before using capabilities
if (sandbox.permissions.includes('storage:write')) {
  try {
    // Encrypt sensitive data
    const encrypted = encryptData(sensitiveValue);
    await sandbox.storage.setItem('protected-key', encrypted);
  } catch (error) {
    // Handle error safely without exposing details
    setError('Failed to save settings');
    console.error('Storage error:', error);
  }
}

// Proper cleanup
useEffect(() => {
  return () => {
    // Clean up any resources
  };
}, []);
```

**Content Security Policy in middleware.ts:**
```typescript
// In middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set CSP header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.example.com;"
  );
  
  // Set other security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}
```

### ♿ Accessibility Implementation Process

**Copy-paste this prompt to Cursor AI:**
```
Following the Lythra STRICT AI Agent Ruleset, implement accessibility features for [component/module] according to Rule 5.
```

**Semantic HTML and ARIA attributes:**
```typescript
// Dialog component example
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirmation</h2>
  <p id="dialog-description">Are you sure you want to delete this item?</p>
  
  <div className="dialog-actions">
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onConfirm}>Confirm</button>
  </div>
</div>
```

**Keyboard navigation implementation:**
```typescript
// Dropdown component example
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          Math.min(prev + 1, options.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          selectOption(options[selectedIndex]);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };
  
  // Other implementation details
};
```

**Focus management for modals:**
```typescript
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  
  // Save previous focus and move focus to modal when opened
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    }
    
    // Return focus when modal closes
    return () => {
      if (isOpen && prevFocusRef.current) {
        prevFocusRef.current.focus();
      }
    };
  }, [isOpen]);
  
  // Implementation details
};
```

### 📤 Complete Git Workflow Processes

**Feature development workflow:**
```bash
# Start a new feature
git checkout main
git pull
git checkout -b feature/[feature-name]

# During development, commit regularly
git add [specific-files]
git commit -m "feat: [Brief description of changes]"

# Before creating PR, sync with main
git fetch origin
git rebase origin/main

# Push feature branch
git push origin feature/[feature-name]

# Create PR via GitHub/GitLab UI
# Title: feat: Add [feature name]
# Description:
# - What: [Description of the feature]
# - Why: [Purpose of the feature]
# - How to test: [Testing instructions]
```

**Bug fix workflow:**
```bash
# Start a bug fix
git checkout main
git pull
git checkout -b bugfix/[bug-name]

# Fix the bug and commit
git add [specific-files]
git commit -m "fix: [Brief description of the fix]"

# Run tests to verify the fix
npm run test

# Push bugfix branch
git push origin bugfix/[bug-name]

# Create PR with details about the bug and the fix
```

**Code review response workflow:**
```bash
# After receiving review comments
# Make requested changes

# Stage changes
git add [modified-files]

# Commit as a fixup
git commit --fixup=[commit-hash-to-fix]

# OR commit normally for new changes
git commit -m "feat: Address PR feedback for [feature]"

# Push updates
git push origin [branch-name]
```

## Quick Reference Tables

### Component Types Quick Reference

| UI Element | HTML Tag | ARIA Role | Keyboard Support |
|------------|----------|-----------|------------------|
| Button | `<button>` | N/A (native) | Enter, Space |
| Link | `<a>` | N/A (native) | Enter |
| Dropdown | `<div>` | `role="listbox"` | Arrow keys, Enter, Escape |
| Checkbox | `<input type="checkbox">` | N/A (native) | Space |
| Modal | `<div>` | `role="dialog"` aria-modal="true" | Escape, Tab trap |
| Tab | `<button>` | `role="tab"` | Arrow keys, Home, End |
| Menu | `<ul>` | `role="menu"` | Arrow keys, Escape |

### CSS Variables Template

```css
/* Base variables */
:root {
  /* Colors */
  --primary-color: #4299e1;
  --secondary-color: #a0aec0;
  --accent-color: #ed8936;
  --success-color: #48bb78;
  --error-color: #f56565;
  --warning-color: #ecc94b;
  
  /* Text colors */
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --bg-tertiary: #edf2f7;
  
  /* Border colors */
  --border-color: #e2e8f0;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  
  /* Borders & Shadows */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* Colors in dark mode */
    --primary-color: #63b3ed;
    --secondary-color: #718096;
    --accent-color: #ed8936;
    
    /* Text colors in dark mode */
    --text-primary: #f7fafc;
    --text-secondary: #e2e8f0;
    --text-muted: #a0aec0;
    
    /* Background colors in dark mode */
    --bg-primary: #1a202c;
    --bg-secondary: #2d3748;
    --bg-tertiary: #4a5568;
    
    /* Border colors in dark mode */
    --border-color: #4a5568;
    
    /* Shadows in dark mode */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  }
}
```

### Type Safety Patterns

**Instead of `any`, use these patterns:**

```typescript
// For API responses with unknown structure
function processApiResponse(data: unknown) {
  if (isUser(data)) {
    // Now TypeScript knows data is User
    return processUser(data);
  } else if (isError(data)) {
    // Handle error case
    return handleError(data);
  }
  throw new Error('Unknown data format');
}

// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  );
}

// Zod for schema validation
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof userSchema>;

// Parse unknown data
function validateUser(data: unknown): User | null {
  const result = userSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error('Invalid user data:', result.error);
  return null;
}
```

### Command Prompt Templates

For complete end-to-end workflows, use these prompts:

**New Component:**
```
Following the Lythra STRICT AI Agent Ruleset, create a [ComponentName] component that [description]. Follow Rule 1 with proper TypeScript typing, accessibility, dark mode support, and tests. After implementation, stage and commit the files following Rule 9.
```

**New Module:**
```
Following the Lythra STRICT AI Agent Ruleset, create a [ModuleName] module that [description]. Follow Rule 2 with Jotai atoms, Zod validation, proper sandboxing, and accessibility features. Implement, test, and commit the changes following Rules 2 and 9.
```

**Code Cleaning:**
```
Following the Lythra STRICT AI Agent Ruleset, clean the codebase according to Rule 7. Run ESLint, remove dead code, fix type issues, ensure proper resource cleanup, and commit changes according to Rule 9.
```

**Security Review:**
```
Following the Lythra STRICT AI Agent Ruleset, review this code for security issues according to Rule 4. Check for input validation, proper sandboxing, secure data handling, and error management. Provide a list of issues and implement the fixes according to Rules 4 and 9.
```

**Accessibility Implementation:**
```
Following the Lythra STRICT AI Agent Ruleset, enhance the accessibility of [component/module] according to Rule 5. Implement semantic HTML, ARIA attributes, keyboard navigation, focus management, and proper color contrast. Test with screen readers and keyboard-only navigation, then commit the changes according to Rule 9.
```

## Rejection Phrases

If Cursor suggests something outside the rules, copy and paste:

```
That solution doesn't comply with our STRICT AI Agent Ruleset for Lythra. Please follow the complete process in Rule [#] which requires [requirement]. All code must adhere to our guidelines for security, accessibility, and best practices, and follow the proper git workflow.
```
