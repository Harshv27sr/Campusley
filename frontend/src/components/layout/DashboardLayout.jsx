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
    <div className="flex flex-col h-full" style={{ backgroundColor: '#0F0F14' }}>
      {/* Brand Header */}
      <div className={`flex items-center gap-3 p-4 mb-2 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold gradient-text font-display">Campusley</span>}
        </Link>
      </div>

      {/* Structured Section Navigation */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {/* Section heading */}
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-dark-muted uppercase">
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
                      ? 'bg-[#6366F1]/10 text-[#818CF8] font-bold'
                      : 'text-dark-muted hover:bg-white/5 hover:text-white'
                    }
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
                  ? 'bg-purple-500/10 text-purple-400 font-bold'
                  : 'text-purple-400 hover:bg-purple-500/10'
                }
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
      <div className={`p-3 border-t border-white/5 mt-2 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] text-dark-muted truncate font-semibold uppercase">{user?.educationLevel || 'Student'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#1A1A24' }}>
      {/* SaaS Top Header Navbar */}
      <Navbar />

      <div className="flex pt-16 min-h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar Layout */}
        <aside className={`hidden md:flex flex-col fixed top-16 left-0 bottom-0 border-r border-white/5 transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-60'}`} style={{ backgroundColor: '#0F0F14' }}>
          <SidebarContent />
          {/* Collapse Toggle trigger */}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="absolute -right-3 top-6 w-6 h-6 border border-white/10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-dark-muted z-50 cursor-pointer" style={{ backgroundColor: '#1A1A24' }}
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
                className="fixed top-16 left-0 bottom-0 w-64 z-50 md:hidden" style={{ backgroundColor: '#0F0F14' }}
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <main className={`flex-1 transition-all duration-300 p-4 md:p-8 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
          {/* Mobile Top Bar with menu toggle */}
          <div className="md:hidden flex items-center gap-3 mb-6 bg-black/20 p-3 rounded-2xl border border-white/5">
            <button onClick={() => setMobileOpen(p => !p)} className="p-2 rounded-xl hover:bg-white/5">
              <Menu size={20} className="text-dark-muted" />
            </button>
            <span className="font-bold text-white text-sm">Navigation Menu</span>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}
