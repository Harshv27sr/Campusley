// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Force clean light theme mode on load and prevent dark mode classes
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
    localStorage.setItem('campusley_theme', 'light')
  }, [])

  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ isDark: false, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return { isDark: false, toggleTheme: () => {} }
}
