// src/components/ui/Badge.jsx
import { cn } from '../../utils/cn'

const variants = {
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  green:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  red:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  yellow:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  cyan:    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  slate:   'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  orange:  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  gradient:'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function Badge({ children, variant = 'blue', size = 'md', className = '', dot = false }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}
