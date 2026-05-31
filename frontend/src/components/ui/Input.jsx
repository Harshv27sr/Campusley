// src/components/ui/Input.jsx
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  iconRight,
  type = 'text',
  className = '',
  containerClassName = '',
  required,
  preventAutofill = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(preventAutofill)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            'w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400 dark:focus:ring-blue-400/10 transition-all',
            Icon ? 'pl-11' : 'pl-4',
            (isPassword || iconRight) ? 'pr-11' : 'pr-4',
            error && 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20',
            className
          )}
          readOnly={isReadOnly}
          onFocus={(e) => {
            setIsReadOnly(false)
            if (props.onFocus) props.onFocus(e)
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10 flex items-center justify-center"
            onClick={() => setShowPassword(p => !p)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {iconRight && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 flex items-center justify-center">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1 mt-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, error, hint, className = '', containerClassName = '', required, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400 dark:focus:ring-blue-400/10 transition-all resize-none min-h-[120px]',
          error && 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function Select({ label, error, hint, children, className = '', containerClassName = '', required, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400 dark:focus:ring-blue-400/10 transition-all cursor-pointer',
          error && 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}
