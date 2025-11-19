'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Heart } from 'lucide-react';

const CATEGORIES = [
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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [likedProjects, setLikedProjects] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get user info
      const userResponse = await fetch('/api/auth/user');
      if (!userResponse.ok) {
        router.push('/login');
        return;
      }
      const userData = await userResponse.json();
      setUser(userData);

      // Get liked projects grouped by category
      const likesByCategory: Record<string, any[]> = {};
      
      for (const category of CATEGORIES) {
        const response = await fetch(`/api/projects?category=${encodeURIComponent(category)}`);
        if (response.ok) {
          const projects = await response.json();
          
          // Filter projects that the user has liked
          const liked = [];
          for (const project of projects) {
            const likeStatus = await fetch(`/api/likes?project_id=${project.id}`);
            if (likeStatus.ok) {
              const status = await likeStatus.json();
              if (status.liked) {
                liked.push(project);
              }
            }
          }
          
          if (liked.length > 0) {
            likesByCategory[category] = liked;
          }
        }
      }
      
      setLikedProjects(likesByCategory);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card rounded-xl border p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">Bennett University Student</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone_number || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liked Projects by Category */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart size={24} className="text-red-500" />
            Liked Projects
          </h2>

          {Object.keys(likedProjects).length === 0 ? (
            <div className="bg-card rounded-xl border p-8 text-center">
              <p className="text-muted-foreground">You haven't liked any projects yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                You can like up to 2 projects per category!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(likedProjects).map(([category, projects]) => (
                <div key={category} className="bg-card rounded-xl border p-6">
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <a
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                      >
                        {project.image_url && (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart size={16} className="fill-red-500 text-red-500" />
                          <span className="text-sm">{project.likes_count || 0}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {projects.length}/2 projects liked in this category
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
