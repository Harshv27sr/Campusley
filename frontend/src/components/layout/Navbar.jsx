// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Bell, User, ChevronDown,
  LogOut, Settings, LayoutDashboard, Shield, Menu, X, Search
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)
      if (currentScrollY <= 10) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY) {
        if (!mobileOpen && !profileOpen) {
          setVisible(false)
        }
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileOpen, profileOpen])

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#profile-menu')) setProfileOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setProfileOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 dark:border-slate-800'
        : 'bg-transparent'
    } ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-indigo-500/40 transition-all">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text hidden sm:block">Campusly</span>
          </Link>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 max-w-md w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, subjects, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-full font-medium"
            />
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <Link to="/upload" className="hidden sm:block">
                <Button variant="gradient" size="sm" className="shadow-sm font-semibold rounded-xl text-xs flex items-center gap-1.5 px-3 py-1.5" icon={<Plus size={14} />}>
                  Upload
                </Button>
              </Link>
            )}

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" id="profile-menu">
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5 text-left">
                          <DropItem to="/profile" icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                          <DropItem to="/dashboard?tab=uploads" icon={LayoutDashboard} label="My Uploads" onClick={() => setProfileOpen(false)} />
                          <DropItem to="/settings" icon={Settings} label="Settings" onClick={() => setProfileOpen(false)} />
                          {isAdmin && <DropItem to="/admin" icon={Shield} label="Admin Panel" onClick={() => setProfileOpen(false)} className="text-purple-600" />}
                        </div>
                        <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                          >
                            <LogOut size={15} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:shadow-indigo-500/30 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={() => setMobileOpen(p => !p)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="p-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes, subjects, PYQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-full font-medium"
                />
              </form>

              {/* Mobile Upload CTA */}
              {isAuthenticated && (
                <Link to="/upload" onClick={() => setMobileOpen(false)} className="block w-full">
                  <Button variant="gradient" className="w-full flex items-center justify-center gap-1.5" icon={<Plus size={16} />}>
                    Upload Notes
                  </Button>
                </Link>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function DropItem({ to, icon: Icon, label, onClick, className = '' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${className}`}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}
