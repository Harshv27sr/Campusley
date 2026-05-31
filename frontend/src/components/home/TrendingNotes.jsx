// src/components/home/TrendingNotes.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Download, Star } from 'lucide-react'

const mockNotes = [
  { id: '1', title: 'Data Structures & Algorithms Complete Notes', subject: 'DSA', downloads: 3241, rating: 4.8, semester: '3rd', branch: 'CSE', fileType: 'PDF', uploader: { name: 'Rahul Sharma' } },
  { id: '2', title: 'Operating System Hand Written Notes', subject: 'OS', downloads: 2876, rating: 4.7, semester: '4th', branch: 'CSE', fileType: 'PDF', uploader: { name: 'Priya Singh' } },
  { id: '3', title: 'Computer Networks Semester Notes 2024', subject: 'CN', downloads: 2104, rating: 4.6, semester: '5th', branch: 'ECE', fileType: 'PDF', uploader: { name: 'Amit Kumar' } },
  { id: '4', title: 'Machine Learning with Python Practical', subject: 'ML', downloads: 1987, rating: 4.9, semester: '6th', branch: 'AI/ML', fileType: 'DOCX', uploader: { name: 'Sneha Patel' } },
  { id: '5', title: 'DBMS Complete Study Material Unit 1-5', subject: 'DBMS', downloads: 1756, rating: 4.5, semester: '4th', branch: 'IT', fileType: 'PDF', uploader: { name: 'Rohan Gupta' } },
]

const fileColors = {
  PDF: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DOCX: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PPT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function TrendingNotes() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-950">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm mb-2">
              <TrendingUp size={16} />
              Trending This Week
            </div>
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              Most Downloaded Notes
            </h2>
          </motion.div>
          <Link
            to="/explore?sort=popular"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="space-y-3">
          {mockNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/notes/${note.id}`}>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group">
                  {/* Rank */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${i === 0 ? 'gradient-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{note.subject}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Sem {note.semester}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{note.uploader.name}</span>
                    </div>
                  </div>

                  {/* Right Stats */}
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${fileColors[note.fileType] || 'bg-slate-100 text-slate-600'}`}>
                      {note.fileType}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={13} className="fill-yellow-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Download size={13} />
                      <span className="text-xs font-medium">{note.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/explore?sort=popular">
            <button className="btn px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              View All Trending Notes
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
