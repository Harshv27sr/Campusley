// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 2
    const range = []
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }
    if (currentPage - delta > 2) range.unshift('...')
    if (currentPage + delta < totalPages - 1) range.push('...')
    pages.push(1)
    range.forEach(p => pages.push(p))
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const PageBtn = ({ page, active, disabled, children, onClick }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all',
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )

  return (
    <div className={cn('flex items-center gap-1.5 justify-center', className)}>
      <PageBtn disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <ChevronLeft size={16} />
      </PageBtn>
      {getPages().map((page, i) =>
        page === '...'
          ? <span key={i} className="w-9 h-9 flex items-center justify-center text-slate-400">…</span>
          : <PageBtn key={page} active={page === currentPage} onClick={() => onPageChange(page)}>{page}</PageBtn>
      )}
      <PageBtn disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <ChevronRight size={16} />
      </PageBtn>
    </div>
  )
}
