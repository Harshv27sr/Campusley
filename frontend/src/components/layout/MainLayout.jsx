// src/components/layout/MainLayout.jsx
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children, noFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-surface text-dark-text transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  )
}
