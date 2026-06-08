import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Bell, User, ChevronDown,
  LogOut, Settings, LayoutDashboard, Shield, Menu, X, Search, Moon
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
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
  const [unreadCount, setUnreadCount] = useState(0)

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0F0F14] border-b ${
      scrolled ? 'shadow-sm border-dark-border' : 'border-transparent'
    } ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-md">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display text-white hidden sm:block">Campusley</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-4">
            <Link to="/explore" className="text-sm font-semibold text-dark-muted hover:text-white transition-colors">
              Explore
            </Link>
            <Link to="/papers" className="text-sm font-semibold text-dark-muted hover:text-white transition-colors">
              PYQ Papers
            </Link>
            <Link to="/about" className="text-sm font-semibold text-dark-muted hover:text-white transition-colors">
              About
            </Link>
          </nav>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 max-w-md w-full bg-dark-card border border-dark-border rounded-full px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
            <Search size={16} className="text-dark-muted" />
            <input
              type="text"
              placeholder="Search notes, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-dark-muted w-full font-medium"
            />
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="text-dark-muted hover:text-white transition-colors hidden sm:block">
              <Moon size={18} />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="hidden sm:block">
                  <button className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5">
                    <Plus size={16} /> Upload
                  </button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" id="profile-menu">
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 p-1 rounded-full border border-dark-border hover:bg-dark-card transition-all cursor-pointer"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <ChevronDown size={14} className={`text-dark-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-dark-surface rounded-xl shadow-xl border border-dark-border overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-dark-border">
                          <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                          <p className="text-xs text-dark-muted truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5 text-left">
                          <DropItem to="/profile" icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                          <DropItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setProfileOpen(false)} />
                          {isAdmin && <DropItem to="/admin" icon={Shield} label="Admin Panel" onClick={() => setProfileOpen(false)} className="text-primary" />}
                        </div>
                        <div className="p-1.5 border-t border-dark-border">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-all text-left"
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
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-hover px-4 py-2 rounded text-sm font-semibold text-white transition-colors"
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded text-dark-muted hover:bg-dark-card transition-all"
              onClick={() => setMobileOpen(p => !p)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function DropItem({ to, icon: Icon, label, onClick, className = '' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-text hover:bg-dark-card transition-all ${className}`}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}
