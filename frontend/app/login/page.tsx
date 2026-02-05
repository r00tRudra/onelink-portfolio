'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGitHubLogin = () => {
    // Redirect to backend OAuth endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/login`;
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">OneLink</h1>
            <p className="text-gray-600">Build your portfolio from GitHub</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-2 btn-primary py-3"
            >
              <Github size={20} />
              Login with GitHub
            </button>

            <p className="text-center text-gray-600 text-sm">
              We'll read your GitHub data to build your portfolio automatically.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>No account? Just login with GitHub to get started!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
