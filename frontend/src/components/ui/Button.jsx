// src/components/ui/Button.jsx
import { cn } from '../../utils/cn'
import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25',
  secondary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/25',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  gradient: 'text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs gap-1',
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2',
  xl: 'px-9 py-4 text-lg gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className = '',
  ...props
}) {
  const isGradient = variant === 'gradient'

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl select-none',
        sizes[size],
        variants[variant],
        isGradient && 'bg-gradient-to-r from-blue-600 to-purple-600',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        'active:scale-[0.97]',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" className="text-current border-t-current border-r-current/50" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}
