import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const I18nContext = createContext(null)

const meta = {
  sr: {
    title: 'JACKET — Hemijsko čišćenje · Vračar',
    description:
      'JACKET — hemijsko čišćenje na Vračaru. Odela, košulje, jakne, mantili, koža, haljine, venčanice, vuna, peglanje. Kičevska 8, Beograd.',
  },
  en: {
    title: 'JACKET — Dry cleaning · Vračar',
    description:
      'JACKET — dry cleaning in Vračar. Suits, shirts, jackets, coats, leather, dresses, wedding gowns, wool, pressing. Kičevska 8, Belgrade.',
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (localStorage.getItem('jacket-lang') === 'en' ? 'en' : 'sr'))

  useEffect(() => {
    localStorage.setItem('jacket-lang', lang)
    document.documentElement.lang = lang
    document.title = meta[lang].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta[lang].description)
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (sr, en) => (lang === 'en' ? en : sr),
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside LanguageProvider')
  return value
}
