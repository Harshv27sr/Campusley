// src/components/ui/Card.jsx
import { cn } from '../../utils/cn'

export default function Card({ children, className = '', hover = true, glass = false, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'glass'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm',
        hover && 'hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={cn('text-lg font-bold text-slate-900 dark:text-white', className)}>{children}</h3>
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-slate-100 dark:border-slate-700', className)}>
      {children}
    </div>
  )
}
