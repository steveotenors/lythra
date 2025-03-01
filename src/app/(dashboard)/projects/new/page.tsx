import { ProjectForm } from '@/components/features/projects/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <ProjectForm />
    </div>
  );
}