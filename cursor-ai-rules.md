# STRICT AI Agent Ruleset for Codebase Management

> **Note**: This is a copy of the canonical version located at `docs/development/cursor-ai-rules.md`
> placed in the root directory for easy access by Cursor AI.

## MANDATORY COMPLIANCE NOTICE

This ruleset MUST be followed WITHOUT EXCEPTION. The AI agent MUST NEVER deviate from these guidelines, suggest alternatives that contradict them, or skip any steps. If a step cannot be completed, the AI MUST notify the user and await further instructions rather than proceeding with a non-compliant solution.

## General Principles (REQUIRED)

- **Consistency**: STRICTLY use the EXACT same naming conventions, file structures, and formatting throughout the codebase. If conventions are unclear, HALT and request clarification before proceeding.
- **Type Safety**: TypeScript is MANDATORY (.tsx for components, .ts for utilities) unless JavaScript is EXPLICITLY specified by the user.
- **Modularity**: Code MUST be self-contained by grouping related files. Dependencies MUST be minimized to only what is absolutely necessary.
- **Documentation**: Every component REQUIRES a Storybook story WITHOUT EXCEPTION. Every feature MUST have documentation comments.
- **Automation**: ESLint, Prettier, and Husky MUST be utilized to enforce standards.

## Rule 1: Component Creation (STRICTLY ENFORCED)

**Trigger**: When instructed to create a new component.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Create Folder**: Component MUST be placed in `src/components/[ComponentName]/` (e.g., `src/components/Button/`).
2. **Component File**: MUST create `[ComponentName].tsx` with:
   - A typed props interface with EXPLICIT types for all props (NO `any` types permitted).
   - Component MUST be implemented as `React.FC<[ComponentName]Props>`.
   - Component file size MUST NOT exceed 100 lines; if larger, MUST split into sub-components.
3. **Storybook Story**: MUST create `[ComponentName].stories.tsx` with:
   - REQUIRED setup: `export default { title: 'Components/[ComponentName]', component: [ComponentName] };`.
   - MINIMUM of two stories: default state and one edge case.
4. **Styling**: MUST add `[ComponentName].css` with scoped styles. INLINE STYLES ARE FORBIDDEN.
5. **Lint and Clean**:
   - MUST run `eslint src/components/[ComponentName] --fix`.
   - MUST remove ALL unused imports, variables, and console.log statements.
6. **Commit**: MUST use commit message format: `git commit -m "Add [ComponentName] component with Storybook stories"`.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 2: Feature Implementation (STRICTLY ENFORCED)

**Trigger**: When asked to build a feature.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Create Feature Folder**: MUST use `src/features/[FeatureName]/` structure.
2. **Add Files**: MUST include ALL of the following:
   - `[FeatureName].tsx`: Main component implementing the feature.
   - `[FeatureName]Api.ts`: ALL API logic related to the feature.
   - `types.ts`: ALL feature-specific types with EXPLICIT typing (NO `any` allowed).
3. **Reuse Components**: MUST use existing components from `src/components/` when available or create new ones following Rule 1.
4. **Write Tests**: MUST add `[FeatureName].test.ts` covering ALL key logic paths.
5. **Document**: MUST include a detailed comment block at the top of `[FeatureName].tsx` explaining purpose, usage, and limitations.
6. **Commit Strategy**: MUST break into the following atomic commits:
   - `git commit -m "Add [FeatureName] component"`
   - `git commit -m "Add [FeatureName] API logic"`
   - `git commit -m "Add tests for [FeatureName]"`

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 3: Code Cleaning (STRICTLY ENFORCED)

**Trigger**: After adding a component/feature or when asked to "Clean the codebase."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Run ESLint**: MUST use `eslint . --fix` and resolve ALL issues.
2. **Remove Dead Code**: MUST eliminate ALL unused imports, functions, or variables WITHOUT EXCEPTION.
3. **Refactor Large Components**: MUST split ANY component exceeding 100 lines.
4. **Remove Console Logs**: MUST delete ALL console.log statements from production code.
5. **Check TODOs**: MUST highlight ALL `// TODO` comments and present them to the user.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 4: Storybook Maintenance (STRICTLY ENFORCED)

**Trigger**: After component creation/updates or when asked to "Update Storybook."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Ensure Coverage**: EVERY component MUST have a `.stories.tsx` file with AT LEAST two stories.
2. **Run Locally**: MUST verify rendering with `npm run storybook`.
3. **Fix Issues**: MUST debug and update ANY failing story before proceeding.
4. **Build**: MUST run `npm run build-storybook` for deployment readiness.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 5: Linting and Formatting (STRICTLY ENFORCED)

**Trigger**: Before commits or when asked to "Lint the code."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Run ESLint**: MUST use `eslint . --fix` with this EXACT configuration:
   ```json
   {
     "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
     "rules": { 
       "no-unused-vars": "error", 
       "react/prop-types": "off",
       "no-console": "error"
     }
   }
   ```
2. **Run Prettier**: MUST use `prettier --write .` with EXACTLY this configuration:
   ```json
   { 
     "singleQuote": true, 
     "trailingComma": "es5", 
     "tabWidth": 2,
     "semi": true,
     "printWidth": 80
   }
   ```
3. **Check Errors**: MUST flag ALL unresolved issues to the user and REFUSE to proceed until resolved.
4. **Integrate Husky**: MUST set up pre-commit hooks if not already configured.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 6: File Organization (STRICTLY ENFORCED)

**Trigger**: When creating/moving files or asked to "Organize the codebase."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Folder Structure**: MUST adhere to this EXACT structure:
   - Components: `src/components/[ComponentName]/`
   - Features: `src/features/[FeatureName]/`
   - Utilities: `src/utils/`
   - Hooks: `src/hooks/`
   - Types: `src/types/`
2. **Naming**: MUST follow these conventions WITHOUT EXCEPTION:
   - Files: kebab-case (e.g., `my-component.tsx`)
   - Components/Types: PascalCase (e.g., `MyComponent`)
   - Variables/Functions: camelCase (e.g., `myFunction`)
3. **Relocate Files**: MUST move ANY misplaced files to the correct directories.
4. **Limit Nesting**: Folder depth MUST NOT exceed 3 levels.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 7: Commit and PR Workflow (STRICTLY ENFORCED)

**Trigger**: After completing a task/feature.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Stage**: MUST run `git add .` for affected files only.
2. **Pre-Commit Checks**: MUST run and pass ALL of these:
   - `eslint .` with zero errors
   - `prettier --check .` with zero formatting issues
   - `npm run test` with all tests passing
3. **Commit**: MUST use this format: `git commit -m "[Action] [Component/Feature] [Brief description]"`.
4. **Push and PR**:
   - MUST push to a feature branch: `git push origin [feature-name]`.
   - PR MUST include a title, detailed description, and Storybook links.
5. **Review**: MUST request code review.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 8: Periodic Audits (STRICTLY ENFORCED)

**Trigger**: Monthly or when asked to "Audit the codebase."

**Required Actions (ALL STEPS MANDATORY)**:

1. **Find Duplicates**: MUST identify and suggest merging ALL similar components.
2. **Tighten Types**: MUST replace ALL `any` types with specific types. Type `any` is FORBIDDEN.
3. **Update Dependencies**: MUST flag ALL outdated packages and recommend updates.
4. **Review Large Files**: MUST identify ALL files over 200 lines and propose refactoring.
5. **Report**: MUST generate a comprehensive audit report with specific action items.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 9: Error Handling and Edge Cases (STRICTLY ENFORCED)

**Trigger**: During feature/component implementation.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Add Error States**: MUST include error stories in Storybook for ALL components.
2. **Handle API Errors**: MUST implement try/catch blocks for ALL API calls.
3. **Type Edge Cases**: MUST account for null, undefined, and empty states in ALL component props.
4. **Test**: MUST write tests covering ALL edge cases and error conditions.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Rule 10: Performance Considerations (STRICTLY ENFORCED)

**Trigger**: When adding complex features/components.

**Required Actions (ALL STEPS MANDATORY)**:

1. **Optimize Renders**: MUST use `React.memo` for ALL components with frequent re-renders.
2. **Lazy Load**: MUST implement lazy loading for ALL large components and routes.
3. **Profile**: MUST use React DevTools to profile and optimize performance bottlenecks.
4. **Optimize Assets**: MUST ensure ALL images are properly optimized and use modern formats.

**Non-Compliance Notice**: If any step cannot be completed, the AI MUST indicate the specific issue and request guidance.

## Example: Creating a ProfileCard Component (MANDATORY REFERENCE IMPLEMENTATION)

When asked to "Create a ProfileCard component with name, bio, and avatar," the AI MUST produce EXACTLY:

1. **Folder Structure**:
```
src/
  components/
    ProfileCard/
      ProfileCard.tsx
      ProfileCard.css
      ProfileCard.stories.tsx
      ProfileCard.test.tsx
```

2. **Component Implementation**:
```tsx
// src/components/ProfileCard/ProfileCard.tsx
import React from 'react';
import './ProfileCard.css';

export interface ProfileCardProps {
  name: string;
  bio?: string;
  avatarSrc: string;
  onProfileClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name, 
  bio, 
  avatarSrc,
  onProfileClick
}) => {
  return (
    <div className="profile-card" onClick={onProfileClick}>
      <img 
        src={avatarSrc} 
        alt={`${name}'s avatar`} 
        className="profile-card__avatar"
      />
      <div className="profile-card__content">
        <h2 className="profile-card__name">{name}</h2>
        {bio && <p className="profile-card__bio">{bio}</p>}
      </div>
    </div>
  );
};
```

3. **Storybook Stories**:
```tsx
// src/components/ProfileCard/ProfileCard.stories.tsx
import React from 'react';
import { ProfileCard } from './ProfileCard';

export default { 
  title: 'Components/ProfileCard', 
  component: ProfileCard 
};

export const Default = () => (
  <ProfileCard 
    name="Jane Doe" 
    avatarSrc="/placeholder/150" 
    bio="Frontend Developer" 
  />
);

export const NoBio = () => (
  <ProfileCard 
    name="John Smith" 
    avatarSrc="/placeholder/150" 
  />
);

export const WithClickHandler = () => (
  <ProfileCard 
    name="Alex Johnson" 
    avatarSrc="/placeholder/150" 
    bio="UX Designer"
    onProfileClick={() => alert('Profile clicked')}
  />
);
```

4. **CSS Styling**:
```css
/* src/components/ProfileCard/ProfileCard.css */
.profile-card {
  display: flex;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.profile-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}

.profile-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-card__name {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.profile-card__bio {
  margin: 0;
  color: #666;
  font-size: 14px;
}
```

5. **Tests**:
```tsx
// src/components/ProfileCard/ProfileCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  test('renders name and avatar', () => {
    render(<ProfileCard name="Test User" avatarSrc="/test.jpg" />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText("Test User's avatar")).toBeInTheDocument();
  });

  test('renders bio when provided', () => {
    render(<ProfileCard name="Test User" avatarSrc="/test.jpg" bio="Test Bio" />);
    
    expect(screen.getByText('Test Bio')).toBeInTheDocument();
  });

  test('does not render bio when not provided', () => {
    render(<ProfileCard name="Test User" avatarSrc="/test.jpg" />);
    
    expect(screen.queryByText('Test Bio')).not.toBeInTheDocument();
  });

  test('calls onProfileClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <ProfileCard 
        name="Test User" 
        avatarSrc="/test.jpg" 
        onProfileClick={handleClick} 
      />
    );
    
    fireEvent.click(screen.getByText('Test User'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## FINAL COMPLIANCE MANDATE

When the AI is asked to perform any task related to codebase management, it MUST:

1. Identify which rule(s) apply to the task
2. Explicitly list all mandatory steps it will take
3. Execute each step in sequence, providing evidence of completion
4. Verify compliance with ALL requirements
5. Notify the user of ANY step that cannot be completed and request guidance

The AI agent DOES NOT have permission to deviate from this ruleset under ANY circumstances. If asked to violate these rules, the AI MUST refuse and explain that it CANNOT operate outside of these strict guidelines.

**ANY violation of these rules should be treated as a critical error in the AI agent's operation.**
