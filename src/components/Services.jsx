import { useState } from 'react'
import homeWardrobe from '../assets/home-wardrobe.jpg'

const services = [
  {
    id: 'odela',
    title: 'Odela i sakoi',
    note: 'Precizno čišćenje koje čuva kroj i oblik',
    x: 16,
    y: 40,
  },
  {
    id: 'kosulje',
    title: 'Košulje',
    note: 'Ispeglane, složene i spremne za nošenje',
    x: 34,
    y: 38,
  },
  {
    id: 'jakne',
    title: 'Jakne',
    note: 'Pernate, bomber i sezonske jakne — bez tragova i bez izgubljene zapremine',
    x: 50,
    y: 36,
  },
  {
    id: 'mantili',
    title: 'Mantili',
    note: 'Vuna, kašmir i trenčkot — sezonska nega koja čuva siluetu',
    x: 54,
    y: 48,
  },
  {
    id: 'koza',
    title: 'Koža i krzno',
    note: 'Specijalizovana obrada uz negu i hranjenje kože',
    x: 66,
    y: 40,
  },
  {
    id: 'haljine',
    title: 'Haljine',
    note: 'Večernje i svečane haljine, delikatne tkanine i šljokice',
    x: 88,
    y: 50,
  },
  {
    id: 'vencanice',
    title: 'Venčanice',
    note: 'Delikatno čišćenje i zaštitna navlaka za čuvanje',
    x: 80,
    y: 36,
  },
  {
    id: 'dzemperi',
    title: 'Džemperi i vuna',
    note: 'Kašmir, merino i pletenina — bez skupljanja i bez žuljeva',
    x: 14,
    y: 18,
  },
  {
    id: 'farmerke',
    title: 'Farmerke',
    note: 'Čišćenje koje čuva boju, kroj i mekoću denima',
    x: 66,
    y: 16,
  },
  {
    id: 'kravate',
    title: 'Kravate i šalovi',
    note: 'Svila i fini materijali, bez otiska i bez tragova',
    x: 66,
    y: 70,
  },
  {
    id: 'peglanje',
    title: 'Peglanje i slaganje',
    note: 'Besprekorno ispeglano, složeno kao u izlogu',
    x: 34,
    y: 72,
  },
  {
    id: 'posteljina',
    title: 'Posteljina',
    note: 'Čaršavi, jorgani i peškiri — sveže, meko i uredno složeno',
    x: 84,
    y: 78,
  },
]

function Pin({ service, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className="absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:block"
      style={{ left: `${service.x}%`, top: `${service.y}%` }}
      aria-pressed={active}
      aria-label={service.title}
    >
      <span className="relative flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8">
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-orange/45" />
        )}
        <span
          className={`relative rounded-full shadow-lg ring-2 ring-white transition-all duration-300 ${
            active
              ? 'h-3.5 w-3.5 bg-orange sm:h-4 sm:w-4'
              : 'h-2.5 w-2.5 bg-orange/90 sm:h-3 sm:w-3'
          }`}
        />
      </span>
    </button>
  )
}

export default function Services() {
  const [open, setOpen] = useState(null)
  const current = services.find((s) => s.id === open)

  return (
    <section id="usluge" className="scroll-mt-24 px-6 py-20 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-orange uppercase">
          Usluge
        </p>
        <h2 className="max-w-2xl font-serif text-3xl leading-tight text-warm sm:text-4xl lg:text-5xl">
          Šta <span className="italic text-orange">čistimo</span>
        </h2>
        <span className="mt-5 block h-px w-12 bg-gold" />

        <div className="relative mt-10 overflow-hidden rounded-3xl bg-warm shadow-xl shadow-orange/10">
          <img
            src={homeWardrobe}
            alt="Ormar u luksuznom stanu sa odelima, košuljama, jaknama, mantilima i ostalom garderobom"
            className="aspect-3/2 w-full object-cover object-[center_60%]"
          />

          {services.map((s) => (
            <Pin
              key={s.id}
              service={s}
              active={open === s.id}
              onSelect={(id) => setOpen((prev) => (prev === id ? null : id))}
            />
          ))}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-warm/80 via-warm/20 to-transparent px-5 pt-16 pb-5 sm:px-8 sm:pb-7">
            {current && (
              <div key={current.id} className="max-w-md animate-rise">
                <p className="font-serif text-2xl text-cream sm:text-3xl">
                  {current.title}
                </p>
                <p className="mt-1 text-sm text-cream/75 sm:text-base">
                  {current.note}
                </p>
              </div>
            )}
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setOpen((prev) => (prev === s.id ? null : s.id))}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  open === s.id
                    ? 'bg-orange text-white'
                    : 'bg-white text-warm hover:bg-peach-light'
                }`}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
