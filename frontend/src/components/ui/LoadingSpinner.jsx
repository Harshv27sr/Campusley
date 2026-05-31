// src/components/ui/LoadingSpinner.jsx
import { cn } from '../../utils/cn'

export default function LoadingSpinner({ size = 'md', fullScreen = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  const spinner = (
    <div
      className={cn(
        'rounded-full border-transparent animate-spin',
        'border-t-blue-600 border-r-purple-600',
        sizes[size],
        className
      )}
      style={{ borderStyle: 'solid' }}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}
