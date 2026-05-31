// src/pages/PrivacyPage.jsx
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function PrivacyPage() {
  document.title = 'Privacy Policy — Campusly'
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Privacy Policy</h1>
              <p className="text-slate-500 dark:text-slate-400">Last updated: June 2025</p>
            </div>
          </div>

          <div className="space-y-6 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">1. Information We Collect</h2>
              <p>We collect personal information you provide when creating an account, such as name, email, educational institution, and student ID card for verification purposes.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">2. How We Use Your Information</h2>
              <p>Your information is used to verify student status, personalize your experience, and improve our platform. We do not sell your data to third parties.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">3. Student ID Card Security</h2>
              <p>ID cards submitted for verification are used solely for academic verification. They are stored securely and are not accessible to other users on the platform.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">4. Data Retention</h2>
              <p>We retain your data as long as your account is active. You can request account deletion at any time by contacting us at support@campusly.app.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">5. Contact Us</h2>
              <p>For any privacy concerns, please email us at <a href="mailto:privacy@campusly.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">privacy@campusly.app</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
