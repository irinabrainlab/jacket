import { useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: '#usluge', label: 'Usluge' },
  { href: '#cenovnik', label: 'Cenovnik' },
  { href: '#kontakt', label: 'Kontakt' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

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
          <a
            href="#kontakt"
            className="rounded-full bg-orange px-4 py-2 text-xs font-medium tracking-wide text-white transition hover:bg-orange/90 sm:px-5"
            onClick={() => setOpen(false)}
          >
            Posetite nas
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-warm md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Zatvori meni' : 'Otvori meni'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Zatvori' : 'Meni'}</span>
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
