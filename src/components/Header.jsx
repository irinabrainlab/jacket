import { useState } from 'react'
import { motion } from 'framer-motion'
import A11yMenu from './A11yMenu'
import { useI18n } from '../i18n'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  const links = [
    { href: '#usluge', label: t('Usluge', 'Services') },
    { href: '#cenovnik', label: t('Cenovnik', 'Price list') },
    { href: '#kontakt', label: t('Kontakt', 'Contact') },
  ]

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 px-4 py-4 sm:px-6 sm:py-5 lg:px-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-gold/25 bg-white/70 px-4 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3">
        <a
          href="#"
          className="font-serif text-lg tracking-tight text-warm sm:text-xl"
          onClick={() => setOpen(false)}
        >
          JACKET
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-warm-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-orange">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <A11yMenu />
          <div className="flex rounded-full bg-peach-light p-0.5 text-xs font-medium" role="group" aria-label={t('Jezik', 'Language')}>
            {['sr', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
                className={`rounded-full px-2.5 py-1 uppercase ${lang === code ? 'bg-white text-warm shadow-sm' : 'text-warm-muted'}`}
              >
                {code}
              </button>
            ))}
          </div>
          <a
            href="#kontakt"
            className="rounded-full bg-orange px-4 py-2 text-xs font-medium tracking-wide text-white transition hover:bg-orange/90 sm:px-5"
            onClick={() => setOpen(false)}
          >
            {t('Kontakt', 'Contact')}
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-warm md:hidden"
            aria-expanded={open}
            aria-label={open ? t('Zatvori meni', 'Close menu') : t('Otvori meni', 'Open menu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t('Zatvori', 'Close') : t('Meni', 'Menu')}</span>
            <span className="flex w-4 flex-col gap-1">
              <span
                className={`h-px w-full bg-warm transition ${open ? 'translate-y-[2.5px] rotate-45' : ''}`}
              />
              <span
                className={`h-px w-full bg-warm transition ${open ? '-translate-y-[2.5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl border border-gold/20 bg-white/90 p-3 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-warm"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </motion.header>
  )
}
