'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card } from '@/components/FormComponents';
import { getPublicPortfolio } from '@/lib/services';
import { ExternalLink, Github } from 'lucide-react';

interface Portfolio {
  user: {
    github_username: string;
    portfolio_username: string;
    bio?: string;
    profile_image_url?: string;
    resume_text?: string;
  };
  projects: any[];
  experience: any[];
  education: any[];
  skills: any[];
  media: any[];
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPublicPortfolio(username);
        setPortfolio(data);
      } catch (err) {
        setError('Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [username]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Card>
            <h2 className="text-2xl font-bold text-red-600">Portfolio Not Found</h2>
            <p className="text-gray-600 mt-2">The portfolio you're looking for doesn't exist.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{portfolio.user.github_username}</h1>
              <p className="text-gray-600">{portfolio.user.bio}</p>
              <a
                href={`https://github.com/${portfolio.user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
              >
                <Github size={18} />
                View GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Projects */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {portfolio.projects.map((project) => (
                <Card key={project.id}>
                  <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  {project.languages && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.keys(project.languages).map((lang) => (
                        <span key={lang} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink size={16} />
                    View Repository
                  </a>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-4">
              {portfolio.experience.map((exp) => (
                <Card key={exp.id}>
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  <p className="text-sm text-gray-500">
                    {new Date(exp.start_date).toLocaleDateString()} -{' '}
                    {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education && portfolio.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Education</h2>
            <div className="space-y-4">
              {portfolio.education.map((edu) => (
                <Card key={edu.id}>
                  <h3 className="text-lg font-bold">{edu.school}</h3>
                  <p className="text-gray-600">{edu.field_of_study}</p>
                  {edu.graduation_year && (
                    <p className="text-sm text-gray-500">Graduated: {edu.graduation_year}</p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
