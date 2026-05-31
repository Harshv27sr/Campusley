// src/pages/PreviousYearPapersPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Star, Search, Filter } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import SearchBar from '../components/ui/SearchBar'
import Badge from '../components/ui/Badge'
import Pagination from '../components/ui/Pagination'
import { Select } from '../components/ui/Input'
import { BRANCHES, SEMESTERS } from '../utils/constants'
import { timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const PAPER_TYPES = ['Mid Sem', 'End Sem', 'Viva', 'Practical', 'Important Questions']
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019']

const mockPapers = Array.from({ length: 20 }, (_, i) => ({
  id: `p${i+1}`,
  title: ['Data Structures Mid Sem 2023', 'OS End Sem 2024', 'CN Viva Questions 2023', 'DBMS Important Questions 2024', 'ML End Sem 2023', 'Software Engg Mid Sem 2022', 'Compiler Design End Sem 2023', 'Web Dev Important Questions 2024', 'Digital Electronics 2022', 'Discrete Math Mid Sem 2023'][i % 10],
  type: PAPER_TYPES[i % 5],
  subject: ['DSA', 'OS', 'CN', 'DBMS', 'ML', 'SE', 'CD', 'WD', 'DE', 'DM'][i % 10],
  branch: BRANCHES[i % 5],
  semester: SEMESTERS[i % 8],
  year: YEARS[i % 6],
  downloads: Math.floor(Math.random() * 3000 + 500),
  rating: +(Math.random() * 1 + 4).toFixed(1),
  uploader: ['Rahul S', 'Priya K', 'Amit G', 'Sneha P'][i % 4],
  createdAt: new Date(Date.now() - i * 5 * 86400000).toISOString(),
}))

const typeColors = {
  'Mid Sem': 'blue', 'End Sem': 'purple', 'Viva': 'green', 'Practical': 'orange', 'Important Questions': 'yellow'
}

export default function PreviousYearPapersPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', branch: '', semester: '', year: '' })
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const setF = (k) => (e) => { setFilters(p => ({ ...p, [k]: e.target.value })); setPage(1) }

  const filtered = mockPapers.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.subject.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.branch && p.branch !== filters.branch) return false
    if (filters.semester && p.semester !== filters.semester) return false
    if (filters.year && p.year !== filters.year) return false
    return true
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-5">
                <FileText size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold font-display text-white mb-3">Previous Year Papers</h1>
              <p className="text-blue-100 text-lg mb-8">Access exam papers, viva questions, and important questions from past years</p>
              <SearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch('')}
                placeholder="Search papers by subject, branch..."
                size="lg"
                className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-xl"
              />
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Paper Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setF('type')({ target: { value: '' } })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!filters.type ? 'gradient-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              All Papers
            </button>
            {PAPER_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setF('type')({ target: { value: t } })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filters.type === t ? 'gradient-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Select value={filters.branch} onChange={setF('branch')}><option value="">All Branches</option>{BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}</Select>
            <Select value={filters.semester} onChange={setF('semester')}><option value="">All Semesters</option>{SEMESTERS.map(s => <option key={s} value={s}>{s} Sem</option>)}</Select>
            <Select value={filters.year} onChange={setF('year')}><option value="">All Years</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</Select>
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">{filtered.length} Papers Found</h2>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {paginated.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText size={18} className="text-blue-500" />
                    </div>
                    <Badge variant={typeColors[paper.type] || 'blue'} size="sm">{paper.type}</Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {paper.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">{paper.year}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">Sem {paper.semester}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">{paper.subject}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Download size={11} /> {paper.downloads}</span>
                    <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" /> {paper.rating}</span>
                  </div>

                  <button
                    onClick={() => toast.success('Download started!')}
                    className="w-full py-2 rounded-xl gradient-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={Math.ceil(filtered.length / PER_PAGE)} onPageChange={setPage} />
        </div>
      </div>
    </MainLayout>
  )
}
