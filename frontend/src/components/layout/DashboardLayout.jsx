// src/components/layout/DashboardLayout.jsx
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Upload, Compass, BookOpen, Settings,
  FileText, ChevronLeft, ChevronRight, Shield, Menu, X, Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import Navbar from './Navbar'

const sidebarSections = [
  {
    title: 'MAIN',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/explore', icon: Compass, label: 'Explore' },
      { to: '/papers', icon: FileText, label: 'PYQ Papers' },
      { to: '/ai-companion', icon: Sparkles, label: 'AI Study Portal' },
    ]
  },
  {
    title: 'PERSONAL',
    items: [
      { to: '/bookmarks', icon: BookOpen, label: 'Bookmarks' },
      { to: '/bookmarks?tab=saved', icon: BookOpen, label: 'Saved Notes' },
      { to: '/dashboard?tab=uploads', icon: Upload, label: 'My Uploads' },
    ]
  },
  {
    title: 'ACCOUNT',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ]
  }
]

export default function DashboardLayout({ children }) {
  const { user, isAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 p-4 mb-2 border-b border-slate-100 dark:border-slate-800/80 ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold gradient-text font-display">Campusly</span>}
        </Link>
      </div>

      {/* Structured Section Navigation */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {/* Section heading */}
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.title}
              </h4>
            )}
            
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
                    ${isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? label : undefined}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div className="space-y-1.5 pt-2">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-purple-400 uppercase">
                ADMINISTRATION
              </h4>
            )}
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${isActive
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Shield size={16} className="flex-shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Collapsible User Badge Footer */}
      <div className={`p-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-semibold uppercase">{user?.educationLevel || 'Student'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* SaaS Top Header Navbar */}
      <Navbar />

      <div className="flex pt-16 min-h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar Layout */}
        <aside className={`hidden md:flex flex-col fixed top-16 left-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-60'}`}>
          <SidebarContent />
          {/* Collapse Toggle trigger */}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-500 dark:text-slate-400 z-50 cursor-pointer"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 z-50 md:hidden"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <main className={`flex-1 transition-all duration-300 p-4 md:p-8 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
          {/* Mobile Top Bar with menu toggle */}
          <div className="md:hidden flex items-center gap-3 mb-6 bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <button onClick={() => setMobileOpen(p => !p)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Menu size={20} className="text-slate-500 dark:text-slate-400" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Navigation Menu</span>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}
