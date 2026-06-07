import { Link } from 'react-router-dom'
import { BookOpen, Globe } from 'lucide-react'

const links = {
  Platform: [
    { label: 'Explore Notes', to: '/explore' },
    { label: 'PYQ Papers', to: '/papers' },
    { label: 'AI Study Tools', to: '/ai' },
    { label: 'Leaderboard', to: '/leaderboard' },
  ],
  Resources: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Support', to: '/contact' },
    { label: 'Help Center', to: '/help' },
    { label: 'Guidelines', to: '/guidelines' },
  ],
  Legal: [
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Cookie Policy', to: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="pt-16 pb-12 border-t border-white/5" style={{ backgroundColor: '#0F0F14' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">Campusly</span>
            </Link>
            <p className="text-sm text-dark-muted leading-relaxed mb-6 max-w-sm">
              Your smart campus learning platform. AI-powered academic resource sharing for Indian students.
            </p>
            <div className="text-dark-muted">
              <Globe size={20} />
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-6">{section}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-dark-muted hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}