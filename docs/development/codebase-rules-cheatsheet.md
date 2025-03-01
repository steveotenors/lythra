# Cursor AI Codebase Rules Cheatsheet

## Setup Instructions

1. **Save ruleset file**: Save the complete ruleset as `cursor-ai-rules.md` in project root
2. **Create Cursor config**:
   ```
   mkdir -p .cursor
   ```
   Create `.cursor/cursor.json`:
   ```json
   {
     "ai": {
       "contextFiles": ["./cursor-ai-rules.md"]
     }
   }
   ```
3. **First command for new sessions**:
   ```
   Before doing any work, read and follow cursor-ai-rules.md. Confirm you've loaded these rules.
   ```

## Essential Rule Summary

### 🧩 Component Creation (Rule 1)
- Must have: ComponentName.tsx, ComponentName.css, ComponentName.stories.tsx, ComponentName.test.tsx
- Props must use explicit TypeScript interfaces (no `any` allowed)
- Components must be under 100 lines
- Every component needs at least 2 Storybook stories

### 🛠️ Feature Implementation (Rule 2)
- Must include: FeatureName.tsx, FeatureNameApi.ts, types.ts, tests
- API calls must have proper error handling
- Feature folders must be in src/features/

### 🧹 Code Cleaning (Rule 3)
- Run ESLint: `eslint . --fix`
- No unused imports/variables allowed
- No console.logs in production code
- Components over 100 lines must be split

### 📚 Storybook (Rule 4)
- Every component must have a stories file
- Each story file needs default + edge cases
- Must run storybook locally to verify

### ✅ Linting (Rule 5)
- Use exact ESLint config from ruleset
- Use exact Prettier config from ruleset
- Pre-commit hooks required via Husky

### 📂 File Structure (Rule 6)
- Components: `src/components/[ComponentName]/`
- Features: `src/features/[FeatureName]/`
- Utils: `src/utils/`, Hooks: `src/hooks/`, Types: `src/types/`
- Naming: kebab-case for files, PascalCase for components/types, camelCase for variables/functions

### 🔄 Git Workflow (Rule 7)
- Format: `git commit -m "[Action] [Component] [Description]"`
- All commits require passing: eslint, prettier, tests

## Command Prompt Templates

### New Component Request
```
Following the STRICT AI Agent Ruleset, create a [ComponentName] component that [description]. Ensure it follows Rule 1 with all required files.
```

### Feature Implementation Request
```
Following the STRICT AI Agent Ruleset, implement a [FeatureName] feature that [description]. Apply Rule 2 with complete folder structure and tests.
```

### Code Cleaning Request
```
Following the STRICT AI Agent Ruleset, clean the codebase according to Rule 3. Show all steps of the cleaning process.
```

## Quick Reference Examples

### Component Structure Example
```
Button/
  Button.tsx         // <100 lines, explicit types
  Button.css         // No inline styles
  Button.stories.tsx // ≥2 stories
  Button.test.tsx    // Cover all paths
```

### Props Interface Example
```tsx
export interface ButtonProps {
  variant: 'primary' | 'secondary'; // Explicit type
  children: React.ReactNode;        // Proper children type
  onClick?: () => void;             // Optional handler
  disabled?: boolean;               // Optional state
  // NO any types allowed!
}
```

### Storybook Example
```tsx
export default { 
  title: 'Components/Button', 
  component: Button 
};

export const Primary = () => <Button variant="primary">Click Me</Button>;
export const Secondary = () => <Button variant="secondary">Click Me</Button>;
export const Disabled = () => <Button variant="primary" disabled>Disabled</Button>;
```

## Enforcement Checklist

- [ ] Correct folder structure
- [ ] TypeScript for all files
- [ ] No `any` types
- [ ] Component size <100 lines
- [ ] Storybook stories exist
- [ ] Tests written
- [ ] ESLint/Prettier passing
- [ ] Proper error handling
- [ ] Documentation comments

## Rejection Phrases

If Cursor suggests something outside the rules, copy and paste:

```
That solution doesn't comply with our STRICT AI Agent Ruleset. Please follow Rule [#] which requires [requirement]. Revise your approach to ensure full compliance.
```
