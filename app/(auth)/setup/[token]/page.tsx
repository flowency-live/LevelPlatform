'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

type PageState =
  | { status: 'loading' }
  | { status: 'valid'; email: string }
  | { status: 'invalid' }
  | { status: 'expired' };

export default function SetupPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/setup/${token}`);
        if (response.ok) {
          const data = await response.json();
          setPageState({ status: 'valid', email: data.email });
        } else if (response.status === 410) {
          setPageState({ status: 'expired' });
        } else {
          setPageState({ status: 'invalid' });
        }
      } catch {
        setPageState({ status: 'invalid' });
      }
    };

    validateToken();
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || pageState.status !== 'valid') {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`/api/setup/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ general: data.error || 'Failed to set up account' });
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: pageState.email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/teacher');
      } else {
        setErrors({ general: 'Account created but login failed. Please try logging in.' });
        setIsLoading(false);
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred' });
      setIsLoading(false);
    }
  };

  if (pageState.status === 'loading') {
    return (
      <Card data-testid="setup-card" className="p-8">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Card>
    );
  }

  if (pageState.status === 'invalid') {
    return (
      <Card data-testid="setup-card" className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invite Link</h1>
          <p className="text-gray-600">
            This invite link is invalid or has already been used.
          </p>
        </div>
      </Card>
    );
  }

  if (pageState.status === 'expired') {
    return (
      <Card data-testid="setup-card" className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invite Link Has Expired</h1>
          <p className="text-gray-600">
            This invite link has expired. Please contact your administrator for a new link.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card data-testid="setup-card" className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set Up Your Account</h1>
        <p className="text-gray-600 mt-2">Create a password to complete your registration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-status-error-bg text-status-error text-sm rounded-md">
            {errors.general}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={pageState.email}
          readOnly
          className="bg-gray-50"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        <div className="text-sm text-gray-500">
          <p>Password must be at least 8 characters</p>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>
    </Card>
  );
}
