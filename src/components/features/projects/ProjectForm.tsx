'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { createProject } from '@/app/actions/project';
import { Alert, AlertDescription } from '@/components/ui/Alert/Alert';

// Install these components:
// npx shadcn-ui@latest add textarea alert

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Project'}
    </Button>
  );
}

export function ProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  async function clientAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    
    const result = await createProject(formData);
    
    if (result.success) {
      formRef.current?.reset();
      setSuccess(true);
    } else {
      setError(result.error as string);
    }
  }
  
  return (
    <form ref={formRef} action={clientAction} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>Project created successfully!</AlertDescription>
        </Alert>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Project Title
        </label>
        <Input id="title" name="title" required />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <TextArea id="description" name="description" rows={3} />
      </div>
      
      <SubmitButton />
    </form>
  );
}