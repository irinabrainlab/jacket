import { useEffect, useState } from 'react'
import priceBookRoom from '../assets/price-book-room.jpg'
import priceBookOpen from '../assets/price-book-open.jpg'
import { useI18n } from '../i18n'

import { english, groups } from '../prices'

export default function Ledger() {
  const [open, setOpen] = useState(false)
  const { lang, t } = useI18n()
  const label = (sr) => (lang === 'en' ? english[sr] ?? sr : sr)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="cenovnik" className="scroll-mt-24 px-6 py-20 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-orange uppercase">
          {t('Cenovnik', 'Price list')}
        </p>
        <h2 className="max-w-xl font-serif text-3xl leading-tight text-warm sm:text-4xl lg:text-5xl">
          {t('U', 'In the')} <span className="italic text-orange">{t('knjizi', 'book')}</span>
        </h2>
        <span className="mt-5 block h-px w-12 bg-gold" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mt-10 block w-full overflow-hidden rounded-3xl text-left shadow-xl shadow-orange/10"
        >
          <img
            src={priceBookRoom}
            alt={t('Otvorena knjiga na stolu u salonu', 'An open book on a table in the shop')}
            className="aspect-3/2 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:aspect-video"
          />
          <div className="absolute inset-0 bg-linear-to-t from-warm/70 via-transparent to-transparent" />
          <div className="absolute right-6 bottom-6 left-6 sm:right-10 sm:bottom-10">
            <p className="font-serif text-2xl text-cream sm:text-3xl">
              {t('Otvorite knjigu', 'Open the book')}
            </p>
            <p className="mt-1 text-sm text-cream/70">
              {t('Cene po komadu, u dinarima.', 'Prices per piece, in dinars.')}
            </p>
          </div>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-warm/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cenovnik-naslov"
            className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-end justify-between gap-4 border-b border-peach/50 px-6 py-5 sm:px-8">
              <div className="flex items-end gap-5">
                <img
                  src={priceBookOpen}
                  alt=""
                  className="hidden h-16 w-24 rounded-xl object-cover sm:block"
                />
                <div>
                  <p className="font-serif text-xs tracking-[0.3em] text-orange uppercase">
                    JACKET
                  </p>
                  <h3 id="cenovnik-naslov" className="font-serif text-3xl text-warm">
                    {t('Cenovnik', 'Price list')}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-orange px-5 py-2 text-xs font-medium tracking-wide text-white"
              >
                {t('Zatvorite', 'Close')}
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <div className="columns-1 gap-x-12 md:columns-2">
                {groups.map((group) => (
                  <section key={group.title} className="mb-8 break-inside-avoid">
                    <h4 className="mb-2 text-xs font-medium tracking-[0.18em] text-orange uppercase">
                      {label(group.title)}
                    </h4>
                    <ul>
                      {group.rows.map(([item, price]) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-2 border-b border-peach/40 py-1.5 text-sm"
                        >
                          <span className="text-warm">{label(item)}</span>
                          <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-peach" />
                          <span className="font-serif text-warm tabular-nums">{price}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-warm-muted">
                {t(
                  'Cene su u dinarima. Zavese i ćilim računaju se po kvadratnom metru.',
                  'Prices are in dinars. Curtains and carpet are charged per square metre.',
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
