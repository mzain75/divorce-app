'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[rgb(var(--muted-foreground))]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <header className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">DivorceHelper Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-[rgb(var(--primary-foreground))]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome, {user.firstName} {user.lastName}!
                </h2>
                <p className="text-[rgb(var(--muted-foreground))]">
                  Ready to continue with your divorce process?
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
              <h3 className="font-semibold text-[rgb(var(--muted-foreground))] uppercase text-sm tracking-wide">
                Account Info
              </h3>
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Gender:</span> {user.gender}</p>
                <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
              <h3 className="font-semibold text-[rgb(var(--muted-foreground))] uppercase text-sm tracking-wide">
                Progress
              </h3>
              <div className="mt-4">
                <p className="text-2xl font-bold">0%</p>
                <p className="text-[rgb(var(--muted-foreground))]">Process completion</p>
              </div>
            </div>

            <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
              <h3 className="font-semibold text-[rgb(var(--muted-foreground))] uppercase text-sm tracking-wide">
                Next Steps
              </h3>
              <div className="mt-4">
                <p className="text-[rgb(var(--muted-foreground))]">
                  Start the AI chatbot to begin collecting your information
                </p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
              <h3 className="text-xl font-semibold mb-4">Start AI Chat</h3>
              <p className="text-[rgb(var(--muted-foreground))] mb-6">
                Begin the guided conversation to collect all necessary information for your divorce documents.
              </p>
              <Button onClick={() => window.location.href = '/chat'}>
                Start AI Chat
              </Button>
            </div>

            <div className="bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] p-6">
              <h3 className="text-xl font-semibold mb-4">Document Library</h3>
              <p className="text-[rgb(var(--muted-foreground))] mb-6">
                Access your generated documents including parenting plans and asset division summaries.
              </p>
              <Button variant="outline" disabled>
                Coming Soon: View Documents
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}