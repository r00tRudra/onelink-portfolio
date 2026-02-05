'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input } from '@/components/FormComponents';
import {
  getSkills,
  addSkill,
  deleteSkill,
} from '@/lib/services';
import { Plus, Trash2 } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
}

export default function SkillsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadSkills();
    }
  }, [isAuthenticated, router]);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert('Please enter a skill name');
      return;
    }

    try {
      await addSkill({ name: newSkill });
      await loadSkills();
      setNewSkill('');
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteSkill(id);
        await loadSkills();
      } catch (error) {
        alert('Failed to delete skill');
      }
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
        <h1 className="text-3xl font-bold mb-8">Skills</h1>

        <Card className="mb-8">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="e.g., React, Python, AWS"
            />
            <Button onClick={handleAddSkill} className="flex items-center gap-2">
              <Plus size={18} />
              Add
            </Button>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2"
            >
              <span>{skill.name}</span>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <Card>
            <p className="text-gray-600 text-center">
              No skills added yet. Add your first skill above!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
