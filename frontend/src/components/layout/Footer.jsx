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
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Contact', to: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white font-display">Campusly</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Your smart campus learning platform. Upload, discover, and share academic resources with students across India.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com" label="GitHub">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialLink>
            </div>

          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
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
        <div className="border border-slate-700 rounded-2xl p-6 mb-10 bg-slate-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay updated with Campusly</h4>
              <p className="text-sm text-slate-400">New notes, papers, and features delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Campusly. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-400 fill-red-400" /> for students across India
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
    >
      {children}
    </a>
  )
}
