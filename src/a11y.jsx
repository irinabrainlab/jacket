import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const A11yContext = createContext(null)

function stored(key) {
  return localStorage.getItem(key) === '1'
}

export function A11yProvider({ children }) {
  const [large, setLarge] = useState(() => stored('jacket-large'))
  const [contrast, setContrast] = useState(() => stored('jacket-contrast'))
  const [calm, setCalm] = useState(() => stored('jacket-calm'))

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-large', large)
    root.classList.toggle('a11y-contrast', contrast)
    root.classList.toggle('a11y-calm', calm)
    root.classList.toggle('a11y-senior', large && contrast && calm)
    localStorage.setItem('jacket-large', large ? '1' : '0')
    localStorage.setItem('jacket-contrast', contrast ? '1' : '0')
    localStorage.setItem('jacket-calm', calm ? '1' : '0')
  }, [large, contrast, calm])

  const value = useMemo(
    () => ({
      large,
      contrast,
      calm,
      setLarge,
      setContrast,
      setCalm,
    }),
    [large, contrast, calm],
  )

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}

export function useA11y() {
  const value = useContext(A11yContext)
  if (!value) throw new Error('useA11y must be used inside A11yProvider')
  return value
}
