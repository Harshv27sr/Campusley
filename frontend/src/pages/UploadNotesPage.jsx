// src/pages/UploadNotesPage.jsx
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Input, { Textarea, Select } from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import {
  BRANCHES, SEMESTERS, SUBJECTS, NOTE_TYPES,
  EDUCATION_LEVELS, BOARDS, CLASSES, SCHOOL_SUBJECTS
} from '../utils/constants'
import { formatFileSize } from '../utils/helpers'
import { notesService } from '../services/notesService'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED = { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'image/*': ['.jpg', '.jpeg', '.png'] }

export default function UploadNotesPage() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    educationLevel: user?.educationLevel || 'College', // Dynamically sets default based on logged-in user!
    subject: '',
    branch: '',
    semester: '',
    board: '',
    className: '',
    type: 'notes',
    unit: ''
  })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('File too large or unsupported format. Max 50MB.')
      return
    }
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED,
    multiple: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a file to upload'); return }
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.subject) { toast.error('Please select a subject'); return }

    if (form.educationLevel === 'College') {
      if (!form.branch) { toast.error('Please select a branch'); return }
      if (!form.semester) { toast.error('Please select a semester'); return }
    } else {
      if (!form.board) { toast.error('Please select a board'); return }
      if (!form.className) { toast.error('Please select a class'); return }
    }

    setUploading(true)
    setProgress(30)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('educationLevel', form.educationLevel)
    formData.append('subject', form.subject)
    formData.append('isPYQ', form.type === 'pyq' ? 'true' : 'false')
    
    if (form.type === 'pyq') {
      formData.append('pyqType', form.semester === '5th' ? 'Mid-Sem' : 'End-Sem')
    }

    if (form.educationLevel === 'College') {
      formData.append('college', user?.college || 'Delhi Technological University')
      formData.append('branch', form.branch)
      formData.append('semester', form.semester)
    } else {
      formData.append('schoolName', user?.schoolName || 'St. Xavier High School')
      formData.append('board', form.board)
      formData.append('className', form.className)
    }

    try {
      setProgress(60)
      await notesService.uploadNote(formData)
      setProgress(100)
      setUploading(false)
      setSuccess(true)
      toast.success('Notes uploaded successfully! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Upload Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Your notes have been uploaded and are now available to students.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="gradient" onClick={() => { setSuccess(false); setFile(null); setProgress(0); setForm({ title: '', description: '', educationLevel: user?.educationLevel || 'College', subject: '', branch: '', semester: '', board: '', className: '', type: 'notes', unit: '' }) }}>
              Upload More
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/explore'}>
              View in Explore
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">Upload Notes</h1>
          <p className="text-slate-500 dark:text-slate-400">Share your study materials with thousands of students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
              ${isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : file
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
              }`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDragActive ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Upload size={26} className={isDragActive ? 'text-blue-500' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {isDragActive ? 'Drop your file here!' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">PDF, DOCX, DOC, PNG, JPG — Max 50MB</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Uploading to Cloudinary...</span>
                  <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-blue-500" /> Note Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" placeholder="e.g. Data Structures Complete Notes Unit 1-5" value={form.title} onChange={set('title')} required />
              <Select label="Education Level" value={form.educationLevel} onChange={set('educationLevel')}>
                {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level} Notes</option>)}
              </Select>
            </div>
            <Textarea label="Description" placeholder="Describe what's covered in these notes, which topics, exam readiness..." value={form.description} onChange={set('description')} />

            {form.educationLevel === 'College' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Subject" value={form.subject} onChange={set('subject')} required>
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select label="Note Type" value={form.type} onChange={set('type')}>
                  {NOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
                <Select label="Branch" value={form.branch} onChange={set('branch')}>
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Semester" value={form.semester} onChange={set('semester')}>
                  <option value="">Select semester</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Subject" value={form.subject} onChange={set('subject')} required>
                  <option value="">Select subject</option>
                  {SCHOOL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select label="Note Type" value={form.type} onChange={set('type')}>
                  {NOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
                <Select label="Education Board" value={form.board} onChange={set('board')}>
                  <option value="">Select board</option>
                  {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Class" value={form.className} onChange={set('className')}>
                  <option value="">Select class</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
            )}

            <Input label="Unit / Chapter / Topic (Optional)" placeholder="e.g. Unit 1-3, Chapter 5-8" value={form.unit} onChange={set('unit')} />
          </div>

          {/* Info Note */}
          <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>Your upload will be reviewed and published. Uploading someone else's paid content or copyrighted material is not allowed.</span>
          </div>

          <Button type="submit" variant="gradient" size="lg" loading={uploading} className="w-full" icon={<Upload size={18} />}>
            {uploading ? 'Uploading...' : 'Upload Notes'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
