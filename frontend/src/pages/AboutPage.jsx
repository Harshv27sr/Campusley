// src/pages/AboutPage.jsx
import { motion } from 'framer-motion'
import { BookOpen, Award, Users, Target, BookMarked, CheckCircle } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'

export default function AboutPage() {
  document.title = 'About Us — Campusly'

  return (
    <MainLayout>
      <div className="py-16 transition-colors duration-300" style={{ backgroundColor: '#1A1A24' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">

          {/* Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center text-[#818CF8] mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white font-display">
              About Campusly
            </h1>
            <p className="text-[#818CF8] font-semibold text-lg mt-2 font-display">
              "Smart Campus Learning Platform"
            </p>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Story & Description */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 bg-black/20 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5"
            >
              <h2 className="text-2xl font-bold text-white font-display">Our Vision & Story</h2>
              <p className="text-dark-muted leading-relaxed text-sm sm:text-base">
                Campusly is a dedicated smart campus learning platform designed to streamline how students share, collaborate, and access academic resources. Built with college and university students in India as our primary audience, Campusly acts as a centralized repository where students can seamlessly upload and download high-quality lecture notes, study materials, and previous year question (PYQ) papers.
              </p>
              <p className="text-dark-muted leading-relaxed text-sm sm:text-base">
                Our mission is to foster peer-to-peer educational support. We believe that quality learning materials should not be scattered across unorganized instant messaging threads or locked behind expensive subscriptions. By validating student registrations through secure ID checks, we maintain a secure and spam-free space where genuine academic content thrives.
              </p>
              <p className="text-dark-muted leading-relaxed text-sm sm:text-base">
                Whether you need to review a syllabus, find solutions to previous year exams, or bookmark important notes for finals, Campusly makes peer learning simple and efficient. We are committed to empowering thousands of students in their higher education journey by making resource sharing structured, accessible, and completely open.
              </p>
            </motion.div>

            {/* Platform Statistics / Highlights */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Mission Card */}
              <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <Target size={28} className="mb-4 text-indigo-100" />
                <h3 className="text-lg font-bold font-display mb-2">Our Mission</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  To democratize education by building India's largest trusted peer-to-peer resource sharing community for university students.
                </p>
              </div>

              {/* Verified Badge */}
              <div className="bg-black/20 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] flex-shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Verified Peer Network</h4>
                  <p className="text-dark-muted text-xs mt-1 leading-relaxed">
                    AI-powered student credentials verification ensures only verified university students upload resources.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-white font-display mb-8">What We Bring to Your Campus</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                <BookMarked className="text-[#818CF8] mb-3" size={24} />
                <h3 className="font-bold text-white text-base">Explore Notes</h3>
                <p className="text-dark-muted text-xs mt-2 leading-relaxed">
                  Browse chapter summaries, syllabus guides, and structured handwritten notes shared by top-performing students from your campus.
                </p>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                <Award className="text-[#818CF8] mb-3" size={24} />
                <h3 className="font-bold text-white text-base">PYQs & Papers</h3>
                <p className="text-dark-muted text-xs mt-2 leading-relaxed">
                  Access college mid-semesters, end-semesters, and lab manuals database organized systematically by semester and subject branch.
                </p>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                <Users className="text-[#818CF8] mb-3" size={24} />
                <h3 className="font-bold text-white text-base">Leaderboard & Rewards</h3>
                <p className="text-dark-muted text-xs mt-2 leading-relaxed">
                  Reward top contributors who share clean resources. Building academic recognition through a peer-rated verification system.
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  )
}
