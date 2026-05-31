// src/components/layout/MainLayout.jsx
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children, noFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  )
}
