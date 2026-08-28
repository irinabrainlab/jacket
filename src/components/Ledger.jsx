import { useState } from 'react'
import priceBookRoom from '../assets/price-book-room.jpg'
import priceBookOpen from '../assets/price-book-open.jpg'

const lines = [
  { item: 'Odelo', price: '—' },
  { item: 'Sako', price: '—' },
  { item: 'Košulja', price: '—' },
  { item: 'Jakna', price: '—' },
  { item: 'Mantil', price: '—' },
  { item: 'Haljina', price: '—' },
  { item: 'Venčanica', price: '—' },
  { item: 'Koža / krzno', price: '—' },
  { item: 'Peglanje', price: '—' },
]

export default function Ledger() {
  const [open, setOpen] = useState(false)

  return (
    <section id="cenovnik" className="scroll-mt-24 px-6 py-20 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-orange uppercase">
          Cenovnik
        </p>
        <h2 className="max-w-xl font-serif text-3xl leading-tight text-warm sm:text-4xl lg:text-5xl">
          U <span className="italic text-orange">knjizi</span>
        </h2>
        <span className="mt-5 block h-px w-12 bg-gold" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mt-10 block w-full overflow-hidden rounded-3xl text-left shadow-xl shadow-orange/10"
        >
          <img
            src={priceBookRoom}
            alt="Otvorena knjiga na stolu u salonu"
            className="aspect-3/2 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:aspect-video"
          />
          <div className="absolute inset-0 bg-linear-to-t from-warm/70 via-transparent to-transparent" />
          <div className="absolute right-6 bottom-6 left-6 sm:right-10 sm:bottom-10">
            <p className="font-serif text-2xl text-cream sm:text-3xl">
              Otvorite knjigu
            </p>
            <p className="mt-1 text-sm text-cream/70">
              Cenovnik na uvid — tačna cena po komadu, u radnji.
            </p>
          </div>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-warm/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid sm:grid-cols-2">
              <img
                src={priceBookOpen}
                alt=""
                className="hidden h-full min-h-80 object-cover sm:block"
              />
              <div className="flex flex-col p-8 sm:p-10">
                <p className="font-serif text-xs tracking-[0.3em] text-orange uppercase">
                  JACKET
                </p>
                <h3 className="mt-2 font-serif text-3xl text-warm">Cenovnik</h3>
                <span className="mt-4 block h-px w-10 bg-orange/40" />

                <ul className="mt-6 flex-1 space-y-3">
                  {lines.map((row) => (
                    <li
                      key={row.item}
                      className="flex items-baseline justify-between gap-4 border-b border-peach/50 pb-2 text-sm"
                    >
                      <span className="text-warm">{row.item}</span>
                      <span className="font-serif text-warm-muted">{row.price}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs leading-relaxed text-warm-muted">
                  Cene zavise od tkanine i stanja komada. Unesite iznose ovde kad
                  budete spremni — do tada, tačnu cenu dobijate u radnji.
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 self-start rounded-full bg-orange px-5 py-2 text-xs font-medium tracking-wide text-white"
                >
                  Zatvorite knjigu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
