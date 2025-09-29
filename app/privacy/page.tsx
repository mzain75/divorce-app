import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-[rgb(var(--muted-foreground))">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              We collect information you provide directly to us, such as when you create 
              an account, use our services, or communicate with us. This may include your 
              name, email address, and other personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              We use the information we collect to provide, maintain, and improve our 
              services, process transactions, and communicate with you about our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to 
              third parties without your consent, except as described in this privacy policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              We implement appropriate technical and organizational measures to protect 
              your personal information against unauthorized access, alteration, disclosure, 
              or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              You have the right to access, update, or delete your personal information. 
              You may also opt out of certain communications from us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              We may update this privacy policy from time to time. We will notify you 
              of any changes by posting the new privacy policy on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
            <p className="text-[rgb(var(--muted-foreground)) leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us 
              at privacy@divorcehelper.com
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