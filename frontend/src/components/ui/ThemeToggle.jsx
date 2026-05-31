// src/components/ui/ThemeToggle.jsx
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all
        ${isDark
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </motion.div>
    </motion.button>
  )
}
