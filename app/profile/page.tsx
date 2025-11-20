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
      // Fetch user info and likes in parallel for faster loading
      const [userResponse, likesResponse] = await Promise.all([
        fetch('/api/auth/user'),
        fetch('/api/likes/user')
      ]);

      if (!userResponse.ok) {
        router.push('/login');
        return;
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Process likes
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
        <main className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header Skeleton */}
            <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 border-3 sm:border-4 border-black"></div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="h-8 sm:h-10 bg-gray-300 border-2 border-black mb-2 w-48 mx-auto sm:mx-0"></div>
                  <div className="h-4 bg-gray-200 border-2 border-black w-32 mx-auto sm:mx-0"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="h-20 bg-gray-200 border-2 border-black"></div>
                <div className="h-20 bg-gray-200 border-2 border-black"></div>
              </div>
            </div>
            {/* Likes Section Skeleton */}
            <div className="bg-gray-300 border-3 sm:border-4 border-black p-4 sm:p-6 mb-4 sm:mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              <div className="h-8 bg-gray-400 border-2 border-black w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 border-2 border-black w-48"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />

      <main className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#ff6b9d] border-3 sm:border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <User size={40} className="sm:w-12 sm:h-12 text-black" strokeWidth={3} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-1 sm:mb-2">{user.name}</h1>
                <p className="text-sm sm:text-base font-bold text-gray-700">Bennett University Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#fef6e4] border-2 sm:border-3 border-black">
                <Mail size={20} className="sm:w-6 sm:h-6 text-black flex-shrink-0" strokeWidth={3} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase text-gray-600">Email</p>
                  <p className="font-bold text-sm sm:text-base truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#fef6e4] border-2 sm:border-3 border-black">
                <Phone size={20} className="sm:w-6 sm:h-6 text-black flex-shrink-0" strokeWidth={3} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase text-gray-600">Phone</p>
                  <p className="font-bold text-sm sm:text-base truncate">{user.phone_number || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Team Code Display - if user is team leader */}
            {user.is_team_leader && user.team_code && (
              <div className="mt-4 sm:mt-6 relative overflow-hidden bg-gradient-to-r from-[#c7f464] to-[#a8d92e] border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-[#ff6b9d] border-3 sm:border-4 border-black -mr-6 sm:-mr-8 -mt-6 sm:-mt-8 rotate-45"></div>
                <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3 uppercase relative z-10 flex items-center gap-2">
                  🎯 Your Team Code
                </h3>
                <div className="bg-white border-2 sm:border-3 border-black p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <p className="text-xs font-black uppercase mb-1 text-gray-600">Use this code to upload projects:</p>
                      <code className="text-lg sm:text-2xl font-black font-mono bg-[#fef6e4] px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-black inline-block break-all">
                        {user.team_code}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.team_code)
                        alert('Team code copied to clipboard!')
                      }}
                      className="w-full sm:w-auto shrink-0 px-3 sm:px-4 py-2 bg-[#3b82f6] text-white font-black border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase text-xs sm:text-sm"
                    >
                      📋 COPY
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold mt-2 sm:mt-3 relative z-10">💡 Share this with your team to collaborate on projects</p>
              </div>
            )}
          </div>

          {/* Liked Projects by Category */}
          <div className="bg-[#c7f464] border-3 sm:border-4 border-black p-4 sm:p-6 mb-4 sm:mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl sm:text-3xl font-black mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 uppercase">
              <Heart size={24} className="sm:w-8 sm:h-8 fill-black text-black" strokeWidth={3} />
              Liked Projects
            </h2>
            <p className="text-sm sm:text-base font-bold text-black">Your favorite projects organized by category</p>
          </div>

          {Object.keys(likedProjects).length === 0 ? (
            <div className="bg-white border-3 sm:border-4 border-black p-8 sm:p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles size={40} className="sm:w-12 sm:h-12 mx-auto mb-4 text-black" strokeWidth={3} />
              <p className="text-lg sm:text-xl font-black mb-2">NO LIKED PROJECTS YET!</p>
              <p className="text-sm sm:text-base font-bold text-gray-700">
                You can like up to 2 projects per category!
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(likedProjects).map(([category, projects]) => (
                <div key={category} className="bg-white border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 uppercase border-b-2 sm:border-b-3 border-black pb-2 sm:pb-3">{category}</h3>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#fef6e4] border-2 sm:border-3 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        {project.image_url && (
                          <div className="relative w-full sm:w-20 h-40 sm:h-20 border-2 sm:border-3 border-black overflow-hidden flex-shrink-0">
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 w-full">
                          <h4 className="font-black text-base sm:text-lg uppercase break-words">{project.title}</h4>
                          <p className="text-xs sm:text-sm font-bold text-gray-700 line-clamp-2 sm:line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#ff6b9d] border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] self-start sm:self-center">
                          <Heart size={16} className="sm:w-[18px] sm:h-[18px] fill-black text-black" strokeWidth={3} />
                          <span className="font-black text-sm sm:text-base">{project.likes_count || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mt-3 sm:mt-4 p-2 sm:p-3 bg-[#c7f464] border-2 border-black">
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
