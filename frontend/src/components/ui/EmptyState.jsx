// src/components/ui/EmptyState.jsx
import { cn } from '../../utils/cn'

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  )
}
