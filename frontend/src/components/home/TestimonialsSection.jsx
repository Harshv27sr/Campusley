// src/components/home/TestimonialsSection.jsx
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Avatar from '../ui/Avatar'
import StarRating from '../ui/StarRating'

const testimonials = [
  {
    name: 'Ritika Mehra',
    college: 'Delhi Technological University',
    branch: 'CSE 5th Sem',
    text: 'Campusly literally saved my semester! I found 3rd year notes for all 6 subjects in under 10 minutes. No more begging in WhatsApp groups!',
    rating: 5,
  },
  {
    name: 'Varun Sharma',
    college: 'VIT Vellore',
    branch: 'AI/ML 4th Sem',
    text: 'The PYQ papers section is amazing. I found papers from the last 5 years for every subject. My exam prep became so much more focused.',
    rating: 5,
  },
  {
    name: 'Anjali Gupta',
    college: 'NIT Bhopal',
    branch: 'ECE 6th Sem',
    text: 'I uploaded my practical files and got 200 downloads in a week! The reputation system motivates me to keep contributing.',
    rating: 5,
  },
  {
    name: 'Karan Patel',
    college: 'BITS Pilani',
    branch: 'MCA 2nd Sem',
    text: 'Best study platform for Indian students. The search filters are brilliant — I filter by my exact semester, branch, and subject.',
    rating: 5,
  },
  {
    name: 'Divya Nair',
    college: 'IIIT Hyderabad',
    branch: 'Data Science 3rd Sem',
    text: 'Finally a platform that understands what Indian students need. No paywalls, easy upload, great quality notes. 10/10!',
    rating: 5,
  },
  {
    name: 'Siddharth Rao',
    college: 'IIT Bombay',
    branch: 'CS 7th Sem',
    text: 'The AI features are going to be a game changer. Even without them, Campusly is already the best study resource platform I have used.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white mb-3">
            Loved by Students Across India
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Join 10,000+ students already using Campusly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote size={32} className="text-blue-200 dark:text-blue-900" />
                <StarRating rating={t.rating} size="sm" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size="md" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.branch} • {t.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
