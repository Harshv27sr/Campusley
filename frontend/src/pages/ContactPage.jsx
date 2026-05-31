// src/pages/ContactPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Input, { Textarea } from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ContactPage() {
  document.title = 'Contact Us — Campusly'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Contact Us</h1>
              <p className="text-slate-500 dark:text-slate-400">We typically respond within 24 hours</p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Email Info */}
            <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Email Support</p>
                <a href="mailto:support@campusly.app" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">support@campusly.app</a>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Send us a message</h2>
              <Input
                label="Your Name"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
              <Textarea
                label="Message"
                placeholder="Tell us about your issue or feedback..."
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5}
                required
              />
              <Button type="submit" variant="gradient" loading={loading} className="w-full" iconRight={<Send size={16} />}>
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
