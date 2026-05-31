// src/components/notes/NoteCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Heart, Bookmark, Star, Eye, FileText, BookOpen } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { timeAgo, formatFileSize, getFileColor } from '../../utils/helpers'
import { cn } from '../../utils/cn'

const fileTypeColors = {
  pdf:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  docx: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  doc:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ppt:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  img:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export default function NoteCard({ note, onBookmark, onLike }) {
  const [liked, setLiked] = useState(note?.isLiked || false)
  const [bookmarked, setBookmarked] = useState(note?.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(note?.likes || 0)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(p => !p)
    setLikeCount(c => liked ? c - 1 : c + 1)
    onLike?.(note._id)
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarked(p => !p)
    onBookmark?.(note._id)
  }

  const ext = note?.fileType?.toLowerCase() || 'pdf'
  const colorClass = fileTypeColors[ext] || 'bg-slate-100 text-slate-600'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/notes/${note?._id}`} className="block">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative h-40 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
            {note?.thumbnail ? (
              <img src={note.thumbnail} alt={note.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center">
                  <FileText size={28} className="text-blue-500" />
                </div>
              </div>
            )}
            {/* File Type Badge */}
            <div className="absolute top-3 left-3">
              <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold uppercase', colorClass)}>
                {note?.fileType || 'PDF'}
              </span>
            </div>
            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-all"
            >
              <Bookmark
                size={14}
                className={bookmarked ? 'fill-blue-600 text-blue-600' : 'text-slate-500 dark:text-slate-400'}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Subject Badge */}
            {note?.subject && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
                {note.subject}
              </span>
            )}

            <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 leading-snug">
              {note?.title || 'Untitled Note'}
            </h3>

            {/* Semester & Branch */}
            <div className="flex items-center gap-2 mb-3">
              {note?.semester && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                  Sem {note.semester}
                </span>
              )}
              {note?.branch && (
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{note.branch}</span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <Download size={12} /> {note?.downloads || 0}
              </span>
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                {note?.rating?.toFixed(1) || '0.0'}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {note?.views || 0}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={note?.uploader?.avatar} name={note?.uploader?.name} size="xs" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[90px]">
                  {note?.uploader?.name || 'Anonymous'}
                </span>
              </div>
              <button
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all',
                  liked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <Heart size={12} className={liked ? 'fill-red-500' : ''} />
                {likeCount}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
