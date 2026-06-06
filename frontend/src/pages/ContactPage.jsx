// src/pages/ContactPage.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageSquare, Send, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import Input, { Textarea } from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ContactPage() {
  document.title = 'Contact Us — Campusly'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API form submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Your message has been received! 🎉')
      setForm({ name: '', email: '', message: '' })
    }, 1200)
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 dark:bg-slate-950 py-16 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 shadow-sm">
              <MessageSquare size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Get in Touch
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Have questions, feedback, or need help? Send us a message and we'll reply shortly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Contact Details Column */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Contact Details</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  For inquiries regarding notes verification, content takedown/copyright notifications, or corporate integrations, please reach out directly or use the contact form.
                </p>

                <div className="space-y-4">
                  
                  {/* Email */}
                  <div className="flex items-start gap-4 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Email Address</h4>
                      <a href="mailto:support@campusly.in" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline block mt-1 font-semibold">
                        support@campusly.in
                      </a>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-4 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Response Time</h4>
                      <p className="text-slate-600 dark:text-slate-350 text-sm mt-1 font-semibold">
                        Within 24 to 48 Hours
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Country</h4>
                      <p className="text-slate-600 dark:text-slate-350 text-sm mt-1 font-semibold">
                        India
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Secure portal note */}
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 mt-6">
                <p className="text-xs text-indigo-200/70 leading-relaxed">
                  🛡️ <strong>Encrypted Transmission:</strong> Your message data is securely submitted. We do not share your contact info with third-party tracking networks.
                </p>
              </div>
            </motion.div>

            {/* Form Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                  >
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-4">Send us a message</h3>
                    
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
                      label="Message / Feedback"
                      placeholder="How can we help you? Feel free to ask details or request support..."
                      value={form.message}
                      onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={5}
                      required
                    />

                    <Button 
                      type="submit" 
                      variant="gradient" 
                      loading={loading} 
                      className="w-full flex items-center justify-center gap-1.5 shadow-md" 
                      iconRight={<Send size={16} />}
                    >
                      Send Message
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Message Sent Successfully!</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                      Thank you for contacting Campusly! We have received your query and our support team will reach out to you within 24 to 48 hours.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline" 
                      className="mx-auto"
                    >
                      Submit Another Query
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

        </div>
      </div>
    </MainLayout>
  )
}
