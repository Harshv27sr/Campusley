// src/components/ui/StatCard.jsx
import { cn } from '../../utils/cn'
import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, color = 'blue', trend, className = '' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' },
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-2xl p-5 border border-slate-200 dark:border-slate-700',
        'bg-white dark:bg-slate-800 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {trend && (
            <p className={cn('text-xs font-medium mt-1', trend > 0 ? 'text-emerald-600' : 'text-red-500')}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', colors[color].icon)}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
