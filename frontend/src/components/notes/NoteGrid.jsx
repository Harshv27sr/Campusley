// src/components/notes/NoteGrid.jsx
import { motion } from 'framer-motion'
import NoteCard from './NoteCard'
import { NoteCardSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'
import { FileText } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

export default function NoteGrid({ notes = [], loading = false, emptyTitle = 'No notes found', emptyDesc = 'Try a different search or filter.', onBookmark, onLike }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => <NoteCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!notes.length) {
    return (
      <EmptyState
        icon="📚"
        title={emptyTitle}
        description={emptyDesc}
      />
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {notes.map((note) => (
        <motion.div key={note._id} variants={item}>
          <NoteCard note={note} onBookmark={onBookmark} onLike={onLike} />
        </motion.div>
      ))}
    </motion.div>
  )
}
