// src/pages/TermsPage.jsx
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function TermsPage() {
  document.title = 'Terms of Service — Campusley'
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Terms of Service</h1>
              <p className="text-slate-500 dark:text-slate-400">Effective Date: June 2025</p>
            </div>
          </div>

          <div className="space-y-6 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">1. Acceptance of Terms</h2>
              <p>By using Campusley, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">2. Eligibility</h2>
              <p>Campusley is exclusively for verified students. You must provide a valid student ID during registration. Creating fake accounts is strictly prohibited.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">3. Content Policy</h2>
              <p>You may only upload content you own or have permission to share. Plagiarized content, adult material, and content violating copyrights is strictly prohibited and will result in account termination.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">4. Account Termination</h2>
              <p>We reserve the right to terminate accounts that violate these terms, upload harmful content, or attempt to misuse the platform.</p>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2">5. Contact</h2>
              <p>For questions about these terms, email us at <a href="mailto:legal@campusley.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">legal@campusley.app</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
