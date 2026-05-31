// src/components/ui/StarRating.jsx
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StarRating({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
  showCount,
  count,
  className = '',
}) {
  const [hovered, setHovered] = useState(0)

  const sizes = { sm: 12, md: 16, lg: 20 }
  const iconSize = sizes[size]

  const displayRating = interactive ? (hovered || rating) : rating

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1
          const filled = starValue <= Math.floor(displayRating)
          const halfFilled = !filled && starValue - 0.5 <= displayRating

          return (
            <button
              key={i}
              type="button"
              className={cn(
                'transition-all duration-100',
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default pointer-events-none'
              )}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(0)}
              onClick={() => interactive && onRate?.(starValue)}
            >
              <Star
                size={iconSize}
                className={cn(
                  'transition-colors',
                  filled ? 'text-yellow-400 fill-yellow-400' :
                  halfFilled ? 'text-yellow-400 fill-yellow-200' :
                  'text-slate-300 dark:text-slate-600'
                )}
              />
            </button>
          )
        })}
      </div>
      {showCount && (
        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
          ({count || 0})
        </span>
      )}
    </div>
  )
}
