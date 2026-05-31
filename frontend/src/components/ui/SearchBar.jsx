// src/components/ui/SearchBar.jsx
import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function SearchBar({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search notes, papers...',
  className = '',
  size = 'md',
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const sizes = {
    sm: 'h-9 text-sm px-3 pl-9',
    md: 'h-11 text-sm px-4 pl-10',
    lg: 'h-14 text-base px-5 pl-12',
  }
  const iconSizes = { sm: 14, md: 16, lg: 18 }
  const iconLeft = { sm: 'left-2.5', md: 'left-3', lg: 'left-4' }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.()
    if (e.key === 'Escape') { onClear?.(); inputRef.current?.blur() }
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 transition-colors',
        iconLeft[size],
        focused && 'text-blue-500'
      )}>
        <Search size={iconSizes[size]} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border transition-all duration-200 outline-none font-medium',
          'bg-white dark:bg-slate-800',
          'border-slate-200 dark:border-slate-700',
          'text-slate-900 dark:text-white',
          'placeholder:text-slate-400',
          'focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10',
          sizes[size],
          value && 'pr-10'
        )}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => { onClear?.(); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
