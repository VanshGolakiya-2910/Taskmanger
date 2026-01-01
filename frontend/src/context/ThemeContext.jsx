import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme')
    if (saved !== null) {
      return saved === 'dark'
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply theme immediately on mount and when isDark changes
  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDark) {
      htmlElement.classList.add('dark')
      htmlElement.style.colorScheme = 'dark'
      localStorage.setItem('theme', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      htmlElement.style.colorScheme = 'light'
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
