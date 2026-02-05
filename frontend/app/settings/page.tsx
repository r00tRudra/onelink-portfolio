'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input, TextArea } from '@/components/FormComponents';
import { getCurrentUser, updateUserProfile, uploadResume } from '@/lib/services';
import { Upload, FileText } from 'lucide-react';

interface UserProfile {
  id: string;
  github_username: string;
  portfolio_username: string;
  bio?: string;
  profile_image_url?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [resumeText, setResumeText] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadProfile();
    }
  }, [isAuthenticated, router]);

  const loadProfile = async () => {
    try {
      const profile = await getCurrentUser();
      setFormData(profile);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadResume(file);
      alert('Resume uploaded successfully!');
      loadProfile();
    } catch (error) {
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <Input
            label="GitHub Username"
            value={formData.github_username || ''}
            disabled
          />
          <Input
            label="Portfolio Username"
            value={formData.portfolio_username || ''}
            disabled
            helperText="This is your unique portfolio URL"
          />
          <TextArea
            label="Bio"
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={4}
          />
          <Input
            label="Profile Image URL"
            value={formData.profile_image_url || ''}
            onChange={(e) =>
              setFormData({ ...formData, profile_image_url: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />
          <Button onClick={handleSave} disabled={saving} variant="primary">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-6">Resume</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="font-medium mb-1">Upload Resume</p>
                  <p className="text-gray-600 text-sm">PDF or DOCX (Max 10MB)</p>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {resumeText && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} />
                  <p className="font-medium">Resume Text Extracted</p>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{resumeText}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
