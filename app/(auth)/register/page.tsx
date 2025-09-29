'use client';

import { RegisterForm } from '@/components/forms/RegisterForm';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h2 className="text-xl font-semibold">DivorceHelper</h2>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <RegisterForm />
      </main>

      {/* Footer */}
      <footer className="text-center p-6 text-sm text-[rgb(var(--muted-foreground))]">
        © 2024 DivorceHelper. All rights reserved.
      </footer>
    </div>
  );
}