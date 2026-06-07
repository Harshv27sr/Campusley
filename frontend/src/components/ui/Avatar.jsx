// src/components/ui/Avatar.jsx
import { cn } from '../../utils/cn'
import { getInitials } from '../../utils/helpers'

const sizes = {
  xs:  'w-6 h-6 text-xs',
  sm:  'w-8 h-8 text-sm',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
}

export default function Avatar({ src, name, size = 'md', className = '', online = false }) {
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const finalSrc = getImageUrl(src);

  if (finalSrc) {
    return (
      <div className={cn('relative flex-shrink-0 rounded-full', className)}>
        <img
          src={finalSrc}
          alt={name || 'User'}
          className={cn('rounded-full object-cover ring-2 ring-white dark:ring-slate-800', sizes[size])}
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
        />
        <div
          className={cn(
            'rounded-full hidden items-center justify-center font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
        {online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative flex-shrink-0 rounded-full', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white',
          sizes[size]
        )}
      >
        {getInitials(name)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
      )}
    </div>
  )
}
