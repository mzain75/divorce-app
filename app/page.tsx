'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/register');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[rgb(var(--background)) flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">DivorceHelper</h1>
        <p className="text-[rgb(var(--muted-foreground)) mt-2">Loading...</p>
      </div>
    </div>
  );
}
