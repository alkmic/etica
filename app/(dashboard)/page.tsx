// app/(dashboard)/page.tsx
// Root page for dashboard - redirects to /new or dashboard

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardRootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Redirect to dashboard by default
  redirect('/dashboard');
}
