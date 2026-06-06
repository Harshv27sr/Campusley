// src/components/home/TrendingNotes.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Download, Star } from 'lucide-react'
import api from '../../services/api'

const fileColors = {
  PDF: 'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  PPT: 'bg-orange-100 text-orange-700',
}

export default function TrendingNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notes/trending')
      .then(res => setNotes(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding bg-[#F8F9FA]">
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
            <h2 className="text-3xl font-bold font-display text-gray-900">
              Most Downloaded Notes
            </h2>
          </motion.div>
          <Link
            to="/explore?sort=popular"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#1A73E8] hover:gap-3 transition-all"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-200" />
            ))
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">No trending notes yet</p>
              <p className="text-sm mt-1">Be the first to upload!</p>
            </div>
          ) : notes.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/notes/${note._id}`}>
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#1A73E8]/40 hover:shadow-md transition-all group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${i === 0 ? 'bg-[#1A73E8] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#1A73E8] transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {note.subject && <span className="text-xs text-gray-500">{note.subject}</span>}
                      {note.semester && <><span className="text-gray-300">•</span><span className="text-xs text-gray-500">Sem {note.semester}</span></>}
                      {note.uploader?.name && <><span className="text-gray-300">•</span><span className="text-xs text-gray-500">{note.uploader.name}</span></>}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${fileColors[note.fileType] || 'bg-gray-100 text-gray-600'}`}>
                      {note.fileType}
                    </span>
                    {note.averageRating > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={13} className="fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{note.averageRating}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-500">
                      <Download size={13} />
                      <span className="text-xs font-medium">{(note.downloadsCount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/explore?sort=popular">
            <button className="btn px-6 py-3 rounded-xl border-2 border-[#1A73E8] text-[#1A73E8] font-semibold text-sm hover:bg-blue-50 transition-all">
              View All Trending Notes
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
