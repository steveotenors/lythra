import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// This is a Server Component that checks authentication
async function AuthCheck(): Promise<null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      {/* Auth check happens server-side */}
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      
      <div className="flex min-h-screen">
        {/* Will add Sidebar component here later */}
        <main className="flex-1 lg:pl-64 pt-4">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}