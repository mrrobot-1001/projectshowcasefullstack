'use client'

import { Navbar } from '@/components/navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff6b9d] to-[#f50057] border-4 border-black p-10 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-5xl font-black text-white uppercase mb-4">Student Cabinet – SCSET</h1>
          <p className="text-xl font-bold text-white">Bennett University</p>
        </div>

        {/* About Content */}
        <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div>
            <h2 className="text-3xl font-black uppercase mb-4">About Us</h2>
            <p className="text-lg font-bold leading-relaxed mb-4">
              The Student Cabinet of SCSET (School of Computer Science Engineering and Technology), Bennett University is the official student-led body dedicated to representing, coordinating, and empowering the student community within the school. It acts as a vital bridge between students and the academic administration, ensuring that student voices are heard, valued, and transformed into meaningful action.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-black uppercase mb-4">Our Mission</h2>
            <p className="text-lg font-bold leading-relaxed mb-4">
              Our primary mission is to cultivate a dynamic academic and collaborative environment by organizing impactful technical, cultural, and professional initiatives. The cabinet plays a central role in planning and executing workshops, hackathons, coding contests, tech talks, industrial visits, peer-learning sessions, and large-scale student events that enhance both technical expertise and leadership capabilities.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-black uppercase mb-4">How We Operate</h2>
            <p className="text-lg font-bold leading-relaxed mb-4">
              The SCSET Student Cabinet operates through specialized verticals such as Academic Affairs, Technical Operations, Event Management, Public Relations, Creative Media, and Student Welfare. Each team works cohesively to address student concerns, promote innovation, and facilitate holistic development beyond the classroom.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-black uppercase mb-4">Our Values</h2>
            <p className="text-lg font-bold leading-relaxed mb-4">
              We strive to foster a culture of inclusivity, excellence, and forward-thinking by encouraging participation, collaboration, and initiative among students. Through strategic coordination with faculty, industry experts, and university leadership, the cabinet ensures that every initiative aligns with the evolving needs of the SCSET student community.
            </p>
          </div>

          <div className="bg-[#ffd93d] border-3 border-black p-6 mt-6">
            <p className="text-lg font-black leading-relaxed">
              At its core, the Student Cabinet is more than an organization — it is a platform for leadership, innovation, and student-driven change, shaping future-ready professionals and empowering them to make a meaningful impact in the world of technology and beyond.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
