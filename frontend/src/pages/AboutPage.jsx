// src/pages/AboutPage.jsx
import { motion } from 'framer-motion'
import { BookOpen, Users, Target, Sparkles } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function AboutPage() {
  document.title = 'About — Campusly'
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">About Campusly</h1>
              <p className="text-slate-500 dark:text-slate-400">Smart Campus Learning Platform</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
                <Target size={18} />Our Mission
              </div>
              <p>
                Campusly is built with one mission: to make academic resources accessible to every student.
                We believe that quality study materials shouldn't be locked behind paywalls or lost in chat groups.
                Every student deserves easy access to notes, question papers, and resources shared by their peers.
              </p>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
                <Sparkles size={18} />What We Offer
              </div>
              <ul className="space-y-2">
                <li>📄 <strong>Notes & Study Materials</strong> — Shared by verified students from your campus</li>
                <li>📝 <strong>Previous Year Papers</strong> — Access PYQ papers to prepare better</li>
                <li>🤖 <strong>AI Study Companion</strong> — Get AI-powered help with your studies</li>
                <li>✅ <strong>Verified Students Only</strong> — Platform is trusted through ID verification</li>
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
                <Users size={18} />Our Team
              </div>
              <p>
                Campusly is created by passionate developers and students who wanted to solve a real problem.
                We're a student-first platform, built by students for students.
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Have feedback? We'd love to hear from you at <a href="mailto:support@campusly.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@campusly.app</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
