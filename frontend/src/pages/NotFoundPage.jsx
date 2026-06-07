// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1A1A24' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[120px] font-bold font-display gradient-text select-none leading-none"
          >
            404
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            📚
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-display">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! Looks like this page went missing from the campus. Maybe the notes were too popular and got deleted? 😅
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="gradient" size="lg" icon={<Home size={18} />}>Go Home</Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="lg" icon={<Search size={18} />}>Explore Notes</Button>
          </Link>
        </div>

        <button onClick={() => window.history.back()} className="mt-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mx-auto">
          <ArrowLeft size={14} /> Go back
        </button>
      </motion.div>
    </div>
  )
}
