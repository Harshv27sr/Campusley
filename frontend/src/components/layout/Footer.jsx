// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'

const links = {
  Platform: [
    { label: 'Explore Notes', to: '/explore' },
    { label: 'PYQ Papers', to: '/papers' },
    { label: 'Upload Notes', to: '/upload' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  Community: [
    { label: 'Top Contributors', to: '/explore?sort=contributors' },
    { label: 'Leaderboard', to: '/explore?sort=top' },
    { label: 'Bookmarks', to: '/bookmarks' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Contact', to: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-250 flex items-center justify-center shadow-sm">
                <BookOpen size={18} className="text-[#1A73E8]" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-display">Campusly</span>
            </Link>
            <p className="text-sm text-gray-505 leading-relaxed mb-5">
              Your smart campus learning platform. Upload, discover, and share academic resources with students across India.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-gray-505 hover:text-[#1A73E8] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border border-gray-200 rounded-2xl p-6 mb-10 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-gray-900 font-semibold mb-1">Stay updated with Campusly</h4>
              <p className="text-sm text-gray-505">New notes, papers, and features delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                disabled
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none cursor-not-allowed opacity-50"
              />
              <button disabled className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-505 text-sm font-semibold whitespace-nowrap cursor-not-allowed opacity-60 border border-gray-200">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-505">
            © {new Date().getFullYear()} Campusly. All rights reserved.
          </p>
          <p className="text-sm text-gray-505 flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-400 fill-red-400" /> for students across India
          </p>
        </div>
      </div>
    </footer>
  )
}
