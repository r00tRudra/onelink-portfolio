'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Loader } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userId = searchParams.get('user_id');
        const username = searchParams.get('username');

        if (!token) {
          setError('No authentication token received');
          return;
        }

        // Store token and user info
        setToken(token);
        setUser({
          id: parseInt(userId || '0'),
          github_username: username || '',
          portfolio_username: username || '',
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, setToken, setUser, router]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          {error ? (
            <>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <a href="/login" className="btn-primary inline-block">
                Back to Login
              </a>
            </>
          ) : (
            <>
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Authenticating with GitHub...</p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
