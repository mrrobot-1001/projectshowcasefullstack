'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { User, Mail, Phone, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

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

      // Get user's likes directly from the database (optimized single query)
      const likesResponse = await fetch(`/api/likes/user`);
      if (likesResponse.ok) {
        const likes = await likesResponse.json();
        
        // Group liked projects by category
        const likesByCategory: Record<string, any[]> = {};
        likes.forEach((like: any) => {
          const category = like.category;
          if (!likesByCategory[category]) {
            likesByCategory[category] = [];
          }
          likesByCategory[category].push(like.project);
        });
        
        setLikedProjects(likesByCategory);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef6e4]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">LOADING PROFILE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      
      <main className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-[#ff6b9d] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <User size={48} className="text-black" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl font-black uppercase mb-2">{user.name}</h1>
                <p className="font-bold text-gray-700">Bennett University Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#fef6e4] border-3 border-black">
                <Mail size={24} className="text-black" strokeWidth={3} />
                <div>
                  <p className="text-xs font-black uppercase text-gray-600">Email</p>
                  <p className="font-bold">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#fef6e4] border-3 border-black">
                <Phone size={24} className="text-black" strokeWidth={3} />
                <div>
                  <p className="text-xs font-black uppercase text-gray-600">Phone</p>
                  <p className="font-bold">{user.phone_number || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Liked Projects by Category */}
          <div className="bg-[#c7f464] border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 uppercase">
              <Heart size={32} className="fill-black text-black" strokeWidth={3} />
              Liked Projects
            </h2>
            <p className="font-bold text-black">Your favorite projects organized by category</p>
          </div>

          {Object.keys(likedProjects).length === 0 ? (
            <div className="bg-white border-4 border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles size={48} className="mx-auto mb-4 text-black" strokeWidth={3} />
              <p className="text-xl font-black mb-2">NO LIKED PROJECTS YET!</p>
              <p className="font-bold text-gray-700">
                You can like up to 2 projects per category!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(likedProjects).map(([category, projects]) => (
                <div key={category} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xl font-black mb-4 uppercase border-b-3 border-black pb-3">{category}</h3>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 p-4 bg-[#fef6e4] border-3 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        {project.image_url && (
                          <div className="relative w-20 h-20 border-3 border-black overflow-hidden">
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-black text-lg uppercase">{project.title}</h4>
                          <p className="text-sm font-bold text-gray-700 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#ff6b9d] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <Heart size={18} className="fill-black text-black" strokeWidth={3} />
                          <span className="font-black">{project.likes_count || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-700 mt-4 p-3 bg-[#c7f464] border-2 border-black">
                    📊 {projects.length}/2 projects liked in this category
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
