'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'Web Development',
  'Mobile App',
  'AI/ML',
  'IoT',
  'Game Development',
  'AR/VR',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity',
  'Other'
];

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    github_url: '',
    demo_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!imageFile) {
        throw new Error('Please select an image');
      }

      if (!teamCode.trim()) {
        throw new Error('Please enter your team code');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('github_url', formData.github_url);
      formDataToSend.append('demo_url', formData.demo_url);
      formDataToSend.append('team_code', teamCode);
      formDataToSend.append('image', imageFile);

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload project');
      }

      // Redirect to the project page
      router.push(`/projects/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Upload Project</h1>
        <p className="text-muted-foreground mb-8">
          Share your amazing project with the Bennett community
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Code */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Team Code *
            </label>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="TEAM-XXXXXXXX"
              className="w-full px-4 py-2 rounded-lg border bg-background"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your team's unique code (e.g., TEAM-A1B2C3D4)
            </p>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              className="w-full px-4 py-2 rounded-lg border bg-background"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project..."
              rows={5}
              className="w-full px-4 py-2 rounded-lg border bg-background resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border bg-background"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 rounded-lg border bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
              required
            />
            {imageFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Demo URL
            </label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://your-demo.com"
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
