// src/pages/ExploreNotesPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, GraduationCap, BookOpen } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import NoteGrid from '../components/notes/NoteGrid'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import { Select } from '../components/ui/Input'
import { useDebounce } from '../hooks/useDebounce'
import { notesService } from '../services/notesService'
import {
  BRANCHES, SEMESTERS, SUBJECTS, NOTE_TYPES,
  EDUCATION_LEVELS, BOARDS, CLASSES, SCHOOL_SUBJECTS
} from '../utils/constants'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Downloaded' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'oldest', label: 'Oldest First' },
]



export default function ExploreNotesPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('College') // College or School
  const [filters, setFilters] = useState({
    branch: '', semester: '', collegeSubject: '',
    board: '', className: '', schoolSubject: '',
    type: '', sort: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Sync Search query from Top Navbar search input
  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearch(q)
  }, [searchParams])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 10) {
        setNavVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setNavVisible(false)
      } else {
        setNavVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const debouncedSearch = useDebounce(search, 400)
  const PER_PAGE = 12

  // Sync / Reset filters when changing School / College level
  useEffect(() => {
    setFilters(p => ({
      ...p,
      branch: '', semester: '', collegeSubject: '',
      board: '', className: '', schoolSubject: '',
      type: ''
    }))
    setPage(1)
  }, [level])

  // Dynamic REST Fetch from Backend database
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      try {
        const queryParams = {
          educationLevel: level,
          search: debouncedSearch,
          branch: filters.branch,
          semester: filters.semester,
          board: filters.board,
          className: filters.className,
        }

        if (level === 'College' && filters.collegeSubject) {
          queryParams.subject = filters.collegeSubject
        } else if (level === 'School' && filters.schoolSubject) {
          queryParams.subject = filters.schoolSubject
        }

        if (filters.type) {
          queryParams.isPYQ = filters.type === 'pyq' ? 'true' : 'false'
        }

        const data = await notesService.getNotes(queryParams)

        // Local dynamic sorting compilation
        let sorted = [...data]
        if (filters.sort === 'popular') {
          sorted.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0))
        } else if (filters.sort === 'rating') {
          sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        } else if (filters.sort === 'oldest') {
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else {
          // newest
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        setNotes(sorted)
      } catch (err) {
        console.error('Failed to fetch notes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [level, debouncedSearch, filters.branch, filters.semester, filters.collegeSubject, filters.board, filters.className, filters.schoolSubject, filters.type, filters.sort])

  const setFilter = (key) => (e) => {
    setFilters(p => ({ ...p, [key]: e.target.value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      branch: '', semester: '', collegeSubject: '',
      board: '', className: '', schoolSubject: '',
      type: '', sort: 'newest'
    })
    setSearch('')
    setPage(1)
  }

  const hasFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v) || search

  const paginated = notes.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(notes.length / PER_PAGE)

  return (
    <MainLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#1A1A24' }}>
        {/* Header */}
        <div className={`border-b border-white/5 sticky transition-all duration-300 z-30 ${
          navVisible ? 'top-16' : 'top-0'
        }`} style={{ backgroundColor: '#0F0F14' }}>
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4">
            {/* Level Selector Tabs */}
            <div className="flex border-b border-white/5 mb-4 gap-4">
              <button
                onClick={() => setLevel('College')}
                className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all
                  ${level === 'College'
                    ? 'border-[#6366F1] text-[#818CF8]'
                    : 'border-transparent text-dark-muted hover:text-white'}`}
              >
                <GraduationCap size={16} />
                College Study Materials
              </button>
              <button
                onClick={() => setLevel('School')}
                className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all
                  ${level === 'School'
                    ? 'border-[#6366F1] text-[#818CF8]'
                    : 'border-transparent text-dark-muted hover:text-white'}`}
              >
                <BookOpen size={16} />
                School Study Materials
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1 w-full sm:max-w-lg">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch('')}
                  placeholder={`Search ${level.toLowerCase()} notes, subjects, boards...`}
                  size="md"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <Select value={filters.sort} onChange={setFilter('sort')} className="text-sm !py-2 !px-3 w-40 flex-1 sm:flex-initial">
                  {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
                <button
                  onClick={() => setShowFilters(p => !p)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex-1 sm:flex-initial
                    ${showFilters
                      ? 'bg-[#6366F1]/10 border-[#6366F1]/30 text-[#818CF8]'
                      : 'border-white/10 text-dark-muted hover:bg-white/5'
                    }`}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </button>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all flex-1 sm:flex-initial">
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                >
                  {level === 'College' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Select value={filters.branch} onChange={setFilter('branch')}>
                        <option value="">All Branches</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </Select>
                      <Select value={filters.semester} onChange={setFilter('semester')}>
                        <option value="">All Semesters</option>
                        {SEMESTERS.map(s => <option key={s} value={s}>{s} Sem</option>)}
                      </Select>
                      <Select value={filters.collegeSubject} onChange={setFilter('collegeSubject')}>
                        <option value="">All Subjects</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <Select value={filters.type} onChange={setFilter('type')}>
                        <option value="">All Types</option>
                        {NOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </Select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Select value={filters.board} onChange={setFilter('board')}>
                        <option value="">All Boards</option>
                        {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </Select>
                      <Select value={filters.className} onChange={setFilter('className')}>
                        <option value="">All Classes</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </Select>
                      <Select value={filters.schoolSubject} onChange={setFilter('schoolSubject')}>
                        <option value="">All Subjects</option>
                        {SCHOOL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <Select value={filters.type} onChange={setFilter('type')}>
                        <option value="">All Types</option>
                        {NOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </Select>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">
              {debouncedSearch ? `Results for "${debouncedSearch}"` : `Explore ${level} Notes`}
            </h1>
            <span className="text-sm text-dark-muted">
              {notes.length} resources found
            </span>
          </div>

          <NoteGrid notes={paginated} loading={loading} emptyTitle={`No ${level.toLowerCase()} notes found`} emptyDesc="Try adjusting your search or filters." />

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
