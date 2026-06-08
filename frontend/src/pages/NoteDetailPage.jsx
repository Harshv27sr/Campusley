// src/pages/NoteDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download, Heart, Bookmark, Share2, Flag, Eye,
  Star, MessageSquare, Clock, FileText, User, ArrowLeft, Send
} from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import StarRating from '../components/ui/StarRating'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { timeAgo } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { notesService } from '../services/notesService'
import toast from 'react-hot-toast'

export default function NoteDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchNoteDetail = async () => {
      setLoading(true)
      try {
        const data = await notesService.getNoteById(id)
        setNote(data)
        setComments(data.comments || [])
        setLikeCount(data.likes?.length || 0)
        
        const uId = user?._id?.toString()
        if (uId) {
          setLiked(data.likes?.includes(uId) || false)
          
          // Check if bookmarked
          const isBookmarked = user?.bookmarks?.some(b => b._id?.toString() === id || b.toString() === id)
          setBookmarked(isBookmarked || false)

          // Check if rated
          const ratingObj = data.ratings?.find(r => r.user?._id?.toString() === uId || r.user?.toString() === uId)
          if (ratingObj) setUserRating(ratingObj.rating)
        }
      } catch (err) {
        console.error('Failed to fetch note detail:', err)
        toast.error('Failed to load study document details.')
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchNoteDetail()
    }
  }, [id, user])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await notesService.downloadNote(id)
      const downloadLink = `http://localhost:5000${res.downloadUrl}`
      
      // Native dynamic browser download trigger
      const link = document.createElement('a')
      link.href = downloadLink
      link.setAttribute('download', '')
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setNote(p => ({ ...p, downloadsCount: (p.downloadsCount || 0) + 1 }))
      toast.success('Download successfully started! 📂')
    } catch (err) {
      toast.error('Failed to register download.')
    } finally {
      setDownloading(false)
    }
  }

  const handleLike = async () => {
    try {
      const updatedNote = await notesService.likeNote(id)
      setLiked(p => !p)
      setLikeCount(updatedNote.likes?.length || 0)
      toast.success(liked ? 'Removed from liked notes' : 'Added to liked notes! ❤️')
    } catch (err) {
      toast.error('Failed to toggle like.')
    }
  }

  const handleRate = async (ratingValue) => {
    setUserRating(ratingValue)
    try {
      const updatedNote = await notesService.rateNote(id, ratingValue)
      setNote(p => ({ ...p, averageRating: updatedNote.averageRating, ratings: updatedNote.ratings }))
      toast.success(`You rated this document ${ratingValue} stars! ⭐`)
    } catch (err) {
      toast.error('Failed to submit rating.')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      const newComment = await notesService.commentNote(id, comment.trim())
      setComments(p => [newComment, ...p])
      setComment('')
      toast.success('Review posted successfully! 💬')
    } catch (err) {
      toast.error('Failed to post review.')
    }
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullScreen />
      </MainLayout>
    )
  }

  if (!note) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto text-center py-20">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Note not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">This study resource does not exist or was removed.</p>
          <Link to="/explore" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
            Back to Explore
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
            >
              {/* File Type + Subject */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                  {note.fileType || 'PDF'}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {note.subject}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  {note.isPYQ ? 'PYQ Paper' : 'Study Notes'}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display leading-tight">
                {note.title}
              </h1>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
                <span className="flex items-center gap-1.5 font-medium"><Download size={14} /> {note.downloadsCount || 0} downloads</span>
                <span className="flex items-center gap-1.5 text-yellow-500 font-bold">
                  <Star size={14} className="fill-yellow-400" /> {note.averageRating || '0.0'} ({note.ratings?.length || 0} reviews)
                </span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {timeAgo(note.createdAt)}</span>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 text-sm sm:text-base">
                {note.description || 'No description provided for this academic resource.'}
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2">
                {note.branch && <Badge variant="slate">{note.branch}</Badge>}
                {note.semester && <Badge variant="blue">Sem {note.semester}</Badge>}
                {note.className && <Badge variant="slate">{note.className}</Badge>}
                {note.board && <Badge variant="blue">{note.board}</Badge>}
                <Badge variant="green">📄 {(note.fileSize / 1048576).toFixed(1)} MB</Badge>
              </div>
            </motion.div>

            {/* Preview Area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                <span className="font-semibold text-slate-900 dark:text-white text-sm">Interactive Preview</span>
              </div>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center mx-auto mb-3">
                    <FileText size={28} className="text-blue-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Preview available after download</p>
                  <Button variant="gradient" size="sm" className="mt-3 font-semibold" onClick={handleDownload} loading={downloading}>
                    Download to Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Rate this Note */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-400" /> Rate & Review
              </h3>
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your Rating:</p>
                <StarRating rating={userRating} interactive onRate={handleRate} size="lg" />
              </div>
              <form onSubmit={handleComment} className="flex gap-3">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write an academic review or comment..."
                  className="flex-1 input-field"
                  required
                />
                <Button type="submit" variant="primary" size="md" icon={<Send size={15} />}>
                  Post
                </Button>
              </form>
            </div>

            {/* Comments */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-500" /> Peer Reviews ({comments.length})
              </h3>
              <div className="space-y-5">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c._id || c.id} className="flex gap-3 pb-5 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                      <Avatar name={c.user?.name || 'Student'} size="sm" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{c.user?.name || 'Student'}</span>
                          {c.rating > 0 && <StarRating rating={c.rating} size="sm" />}
                          <span className="text-xs text-slate-400 ml-auto">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{c.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No reviews posted yet. Be the first to write one!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sticky top-24 shadow-sm"
            >
              <Button variant="gradient" size="lg" className="w-full mb-3 shadow-md" icon={<Download size={18} />} loading={downloading} onClick={handleDownload}>
                Download Document
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <button
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all
                    ${liked ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/20 text-rose-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <Heart size={16} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
                  {likeCount} Likes
                </button>
                <button
                  onClick={() => setBookmarked(p => !p)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all
                    ${bookmarked ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/20 text-blue-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <Bookmark size={16} className={bookmarked ? 'fill-blue-500 text-blue-500' : ''} />
                  Save
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              <div className="text-xs text-center text-slate-400 mb-3 font-medium">
                {note.downloadsCount || 0} students downloaded this
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Overall Rating</span>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{note.averageRating || '0.0'}</span>
                    <span className="text-slate-400">/ 5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Uploader Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={15} className="text-blue-500" /> Uploaded by
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={note.uploader?.name || 'Campusley Contributor'} size="lg" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{note.uploader?.name || 'Campusley Contributor'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{note.uploader?.email || 'verified.student@university.edu'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Badge variant="yellow" size="sm">🏆 verified Student</Badge>
              </div>
            </div>

            {/* Report */}
            <button className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-rose-500 transition-colors p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold">
              <Flag size={14} /> Report this content
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
