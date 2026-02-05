'use client';

import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">OneLink Portfolio</h1>
          <p className="text-xl text-gray-600">
            Build your beautiful portfolio automatically from your GitHub profile
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">Connected</h3>
            <p className="text-gray-600">
              Seamlessly connect with your GitHub account to sync your projects
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Beautiful</h3>
            <p className="text-gray-600">
              Display your projects, experience, and skills in a stunning portfolio
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Responsive</h3>
            <p className="text-gray-600">
              Your portfolio looks amazing on all devices
            </p>
          </div>
        </div>

        <div className="text-center">
          <a href="/login" className="btn-primary px-8 py-4 text-lg inline-block">
            Get Started with GitHub
          </a>
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-4 text-gray-700">
            <li><span className="font-bold">1.</span> Login with your GitHub account</li>
            <li><span className="font-bold">2.</span> We automatically pull your repositories</li>
            <li><span className="font-bold">3.</span> Customize with your experience and education</li>
            <li><span className="font-bold">4.</span> Share your portfolio with anyone</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}
