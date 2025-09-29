'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEmail } from '@/lib/utils';
import { LoginFormData } from '@/types';

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setErrors({ password: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ password: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-[rgb(var(--muted-foreground))] mt-2">
          Sign in to continue with your divorce process
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          disabled={isLoading}
          placeholder="Enter your email"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            disabled={isLoading}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]" 
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[rgb(var(--primary))] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}