'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const error = searchParams.get('error');
      const accessToken = searchParams.get('access_token');

      if (error) {
        showToast({
          type: 'error',
          title: 'Authentication failed',
          message: error,
        });
        router.push('/auth/signin');
        return;
      }

      if (accessToken) {
        // Store token
        localStorage.setItem('access_token', accessToken);

        showToast({
          type: 'success',
          title: 'Successfully authenticated',
          message: 'Welcome to tagform!',
        });

        router.push('/dashboard');
      } else {
        showToast({
          type: 'error',
          title: 'Authentication failed',
          message: 'Invalid response from server',
        });
        router.push('/auth/signin');
      }
    };

    handleCallback();
  }, [router, searchParams, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-jedira text-gray-900 mb-2">
          Authenticating...
        </h2>
        <p className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">
          Please wait while we complete your authentication
        </p>
      </div>
    </div>
  );
} 