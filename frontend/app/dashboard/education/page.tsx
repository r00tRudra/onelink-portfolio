'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input } from '@/components/FormComponents';
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from '@/lib/services';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Education {
  id: number;
  school: string;
  field_of_study: string;
  graduation_year?: number;
}

export default function EducationPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadEducation();
    }
  }, [isAuthenticated, router]);

  const loadEducation = async () => {
    try {
      const data = await getEducation();
      setEducation(data);
    } catch (error) {
      console.error('Failed to load education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData(edu);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.school || !formData.field_of_study) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateEducation(editingId, formData);
      } else {
        await addEducation(formData);
      }
      await loadEducation();
      resetForm();
    } catch (error) {
      alert('Failed to save education');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteEducation(id);
        await loadEducation();
      } catch (error) {
        alert('Failed to delete education');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({});
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Education</h1>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Education
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <Input
              label="School/University *"
              value={formData.school || ''}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g., MIT"
              required
            />
            <Input
              label="Field of Study *"
              value={formData.field_of_study || ''}
              onChange={(e) =>
                setFormData({ ...formData, field_of_study: e.target.value })
              }
              placeholder="e.g., Computer Science"
              required
            />
            <Input
              label="Graduation Year"
              type="number"
              value={formData.graduation_year || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  graduation_year: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="2023"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="primary">
                {editingId ? 'Update' : 'Add'} Education
              </Button>
              <Button onClick={resetForm} variant="secondary">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{edu.school}</h3>
                  <p className="text-gray-600">{edu.field_of_study}</p>
                  {edu.graduation_year && (
                    <p className="text-sm text-gray-500">Graduated: {edu.graduation_year}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(edu)}
                    variant="secondary"
                    className="p-2"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(edu.id)}
                    variant="danger"
                    className="p-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {education.length === 0 && !showForm && (
          <Card>
            <p className="text-gray-600 text-center">
              No education added yet. Click "Add Education" to get started!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
