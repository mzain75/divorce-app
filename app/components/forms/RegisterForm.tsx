'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { validateEmail, validatePassword } from '@/lib/utils';
import { RegisterFormData, RegisterFormState, RegisterFormErrors, GenderFormValue } from '@/types';

const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate gender selection
    const isValidGender = formData.gender === 'MALE' || formData.gender === 'FEMALE';
    if (!isValidGender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with numbers and symbols';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Convert form state to API data format
      const submissionData: RegisterFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender as 'MALE' | 'FEMALE', // Safe because validation ensures it's MALE or FEMALE
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms
      };
      
      const success = await register(submissionData);
      if (success) {
        router.push('/dashboard');
      } else {
        setErrors({ email: 'Registration failed. Email may already be in use.' });
      }
    } catch (error) {
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-[rgb(var(--muted-foreground))] mt-2">
          Join us to get started with your divorce process
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            disabled={isLoading}
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />

        <Select
          label="Gender"
          options={genderOptions}
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          error={errors.gender}
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-4">
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms}
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-[rgb(var(--primary))] hover:underline">
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[rgb(var(--primary))] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Already have an account?{' '}
          <Link href="/login" className="text-[rgb(var(--primary))] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}