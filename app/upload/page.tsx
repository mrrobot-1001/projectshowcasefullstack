'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Upload, Image as ImageIcon, Github, Globe, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [success, setSuccess] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    github_url: '',
    demo_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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

      setSuccess('Project uploaded successfully! Redirecting...');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header with Gradients */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#a855f7] text-white border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            {/* Decorative Elements */}
            <div className="absolute top-3 right-10 w-16 h-16 bg-[#ffd93d] border-4 border-black rotate-12"></div>
            <div className="absolute bottom-3 left-10 w-12 h-12 bg-[#ff6b9d] border-4 border-black -rotate-12"></div>
            <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-[#c7f464] border-4 border-black rotate-45"></div>
            
            <h1 className="text-5xl font-black mb-3 text-white uppercase relative z-10 drop-shadow-lg">Upload Project</h1>
            <p className="font-bold text-white/95 text-lg relative z-10 drop-shadow">
              🚀 Share your amazing project with the Bennett community
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-5 bg-[#ff6b9d] border-4 border-black text-black font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
              <AlertCircle size={24} strokeWidth={3} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-5 bg-[#c7f464] border-4 border-black text-black font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-6">
              {/* Team Code */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Team Code *
                </label>
                <Input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  placeholder="TEAM-XXXXXXXX"
                  required
                />
                <p className="text-sm font-bold text-gray-600 mt-2">
                  📋 Enter your team's unique code (e.g., TEAM-A1B2C3D4)
                </p>
              </div>

              {/* Project Title */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Project Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={5}
                  className="w-full px-4 py-3 border-3 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-black font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
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
                <label className="block text-sm font-black mb-2 uppercase">
                  Project Image *
                </label>
                <div className="border-4 border-dashed border-black p-6 bg-[#fef6e4] hover:bg-white transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    required
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block text-center">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto border-3 border-black" />
                        <p className="font-bold text-sm">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ImageIcon size={48} className="mx-auto text-black" strokeWidth={3} />
                        <p className="font-black text-lg">CLICK TO UPLOAD IMAGE</p>
                        <p className="font-bold text-sm text-gray-600">PNG, JPG, or GIF (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase flex items-center gap-2">
                  <Github size={16} strokeWidth={3} />
                  GitHub URL (Optional)
                </label>
                <Input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase flex items-center gap-2">
                  <Globe size={16} strokeWidth={3} />
                  Demo URL (Optional)
                </label>
                <Input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://your-demo.com"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full text-lg"
              >
                {loading ? 'UPLOADING...' : '🚀 UPLOAD PROJECT'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
