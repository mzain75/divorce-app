import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-[rgb(var(--border))">
        <Link href="/" className="text-xl font-semibold">
          DivorceHelper
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="text-[rgb(var(--muted-foreground))">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              By accessing and using DivorceHelper, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Use License</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on 
              DivorceHelper's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Privacy</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also 
              governs your use of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Disclaimer</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              The materials on DivorceHelper's website are provided on an 'as is' basis. 
              DivorceHelper makes no warranties, expressed or implied, and hereby disclaims 
              and negates all other warranties including without limitation, implied warranties 
              or conditions of merchantability, fitness for a particular purpose, or 
              non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Contact Information</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us 
              at support@divorcehelper.com
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-[rgb(var(--border))">
          <Link 
            href="/register" 
            className="text-[rgb(var(--primary)) hover:underline"
          >
            ← Back to Registration
          </Link>
        </div>
      </main>
    </div>
  );
}