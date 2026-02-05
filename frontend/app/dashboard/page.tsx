'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button } from '@/components/FormComponents';
import { getCurrentUser, syncProjects } from '@/lib/services';
import { RefreshCw, Github, FileText } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [isAuthenticated, router]);

  const handleSyncProjects = async () => {
    setSyncing(true);
    try {
      await syncProjects();
      // Refresh user profile
      await getCurrentUser();
      alert('Projects synced successfully!');
    } catch (error) {
      alert('Failed to sync projects');
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-bold mb-4">Welcome, {user?.github_username}!</h2>
            <p className="text-gray-600 mb-4">
              Portfolio URL: <code className="bg-gray-100 px-2 py-1 rounded">{user?.portfolio_username}</code>
            </p>
            <a
              href={`/profile/${user?.portfolio_username}`}
              className="btn-primary inline-block"
            >
              View Public Portfolio
            </a>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={handleSyncProjects}
                variant="primary"
                disabled={syncing}
                className="w-full justify-center flex items-center gap-2"
              >
                <RefreshCw size={18} />
                {syncing ? 'Syncing...' : 'Sync GitHub Projects'}
              </Button>
              <a href="/settings" className="btn-secondary w-full text-center block">
                Edit Profile
              </a>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <a href="/dashboard/experience" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="text-lg font-bold">Experience</h3>
            <p className="text-gray-600 text-sm">Manage your work history</p>
          </a>

          <a href="/dashboard/education" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="text-lg font-bold">Education</h3>
            <p className="text-gray-600 text-sm">Add your education</p>
          </a>

          <a href="/dashboard/projects" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="text-lg font-bold">Projects</h3>
            <p className="text-gray-600 text-sm">Manage your projects</p>
          </a>

          <a href="/dashboard/skills" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-lg font-bold">Skills</h3>
            <p className="text-gray-600 text-sm">Add your skills</p>
          </a>

          <a href="/dashboard/resume" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="text-lg font-bold">Resume</h3>
            <p className="text-gray-600 text-sm">Upload your resume</p>
          </a>

          <a href="/dashboard/media" className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">🖼️</div>
            <h3 className="text-lg font-bold">Media</h3>
            <p className="text-gray-600 text-sm">Manage your media files</p>
          </a>
        </div>
      </div>
    </Layout>
  );
}
