import { useEffect, useMemo, useState } from 'react'
import homeWardrobe from '../assets/home-wardrobe.jpg'
import { useI18n } from '../i18n'
import { formatDin, groups, labelOf, parseDin } from '../prices'

const pins = [
  { title: 'Košulje i majice', x: 18, y: 34 },
  { title: 'Odela', x: 36, y: 40 },
  { title: 'Džemperi i dodaci', x: 22, y: 58 },
  { title: 'Trenerke', x: 40, y: 68 },
  { title: 'Kaputi i mantili', x: 54, y: 30 },
  { title: 'Jakne', x: 66, y: 42 },
  { title: 'Suknje i haljine', x: 80, y: 36 },
  { title: 'Koža i krzno', x: 72, y: 62 },
  { title: 'Samo peglanje', x: 56, y: 74 },
  { title: 'Radna odeća', x: 86, y: 70 },
  { title: 'Posteljina', x: 16, y: 80 },
  { title: 'Zavese, stolnjaci, peškiri', x: 34, y: 84 },
]

function Pin({ x, y, label, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="absolute z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:block"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-pressed={active}
      aria-label={label}
    >
      <span className="relative flex h-full w-full items-center justify-center">
        {active && <span className="pin-pulse absolute inset-1 rounded-full bg-orange/45" />}
        <span
          className={`relative rounded-full shadow-lg ring-2 ring-white ${
            active ? 'h-4 w-4 bg-orange' : 'h-3 w-3 bg-orange/90'
          }`}
        />
      </span>
    </button>
  )
}

export default function Services() {
  const { lang, t } = useI18n()
  const [open, setOpen] = useState(groups[0].title)
  const [qty, setQty] = useState({})
  const label = (sr) => labelOf(lang, sr)
  const current = groups.find((group) => group.title === open) ?? groups[0]

  function setCount(key, next) {
    const value = Math.max(0, Math.min(30, next))
    setQty((prev) => ({ ...prev, [key]: value }))
  }

  const chosen = useMemo(() => {
    const rows = []
    for (const group of groups) {
      for (const [item, price] of group.rows) {
        const count = qty[`${group.title}|${item}`] || 0
        if (count > 0) {
          rows.push({
            key: `${group.title}|${item}`,
            item,
            price,
            count,
            meters: item.includes('m²'),
            sum: count * parseDin(price),
          })
        }
      }
    }
    return rows
  }, [qty])

  const total = chosen.reduce((sum, row) => sum + row.sum, 0)
  const pieces = chosen.filter((row) => !row.meters).reduce((sum, row) => sum + row.count, 0)
  const meters = chosen.filter((row) => row.meters).reduce((sum, row) => sum + row.count, 0)
  const [rate, setRate] = useState(null)
  const [rateMissing, setRateMissing] = useState(false)

  useEffect(() => {
    let live = true
    async function load() {
      try {
        const response = await fetch('https://kurs.resenje.org/api/v1/currencies/eur/rates/today')
        if (!response.ok) throw new Error('rate')
        const data = await response.json()
        if (!live) return
        if (!Number.isFinite(data.exchange_middle)) throw new Error('rate')
        setRate({ ...data, readAt: new Date() })
        setRateMissing(false)
      } catch {
        if (live) setRateMissing(true)
      }
    }
    load()
    const onShow = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onShow)
    const timer = setInterval(load, 15 * 60 * 1000)
    return () => {
      live = false
      document.removeEventListener('visibilitychange', onShow)
      clearInterval(timer)
    }
  }, [])

  const euros =
    rate && total > 0
      ? (total / rate.exchange_middle).toLocaleString('sr-RS', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : ''
  const rateLabel = rate
    ? Number(rate.exchange_middle).toLocaleString('sr-RS', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    : ''

  return (
    <section id="usluge" className="scroll-mt-24 px-6 py-20 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-orange uppercase">
          {t('Usluge', 'Services')}
        </p>
        <h2 className="max-w-2xl font-serif text-3xl leading-tight text-warm sm:text-4xl lg:text-5xl">
          {t('Šta', 'What we')} <span className="italic text-orange">{t('čistimo', 'clean')}</span>
        </h2>
        <span className="mt-5 block h-px w-12 bg-gold" />
        <p className="mt-6 max-w-2xl leading-relaxed text-warm-muted">
          {t(
            'Svaka stavka iz cenovnika koja ima cenu po komadu ili po kvadratu. Klik dodaje količinu, zbir je tačna računica.',
            'Every price-list item that has a price per piece or per square metre. A click adds the quantity. The total is the exact sum.',
          )}
        </p>

        <div className="relative mt-10 overflow-hidden rounded-3xl bg-warm shadow-xl shadow-orange/10">
          <img
            src={homeWardrobe}
            alt={t(
              'Ormar sa odelima, košuljama, jaknama, mantilima, haljinama, kožom i kućnim tekstilom',
              'A wardrobe with suits, shirts, jackets, coats, dresses, leather and household linen',
            )}
            className="aspect-3/2 w-full object-cover object-[center_60%]"
          />
          {pins.map((pin) => (
            <Pin
              key={pin.title}
              x={pin.x}
              y={pin.y}
              label={label(pin.title)}
              active={open === pin.title}
              onSelect={() => setOpen(pin.title)}
            />
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-warm/80 via-warm/20 to-transparent px-5 pt-16 pb-5 sm:px-8 sm:pb-7">
            <p className="font-serif text-2xl text-cream sm:text-3xl">{label(current.title)}</p>
            <p className="mt-1 text-sm text-cream/80">
              {t('Sve stavke ove grupe su ispod, sa cenom iz knjige.', 'Every item in this group is below, with the price from the book.')}
            </p>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.title}>
              <button
                type="button"
                aria-pressed={open === group.title}
                onClick={() => setOpen(group.title)}
                className={`min-h-11 rounded-full px-4 py-2 text-sm transition ${
                  open === group.title ? 'bg-orange text-white' : 'bg-white text-warm hover:bg-peach-light'
                }`}
              >
                {label(group.title)}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-orange/10 ring-1 ring-peach/40 sm:p-8">
          <h3 className="font-serif text-2xl text-warm">{label(current.title)}</h3>
          <ul className="mt-4">
            {current.rows.map(([item, price]) => {
              const key = `${current.title}|${item}`
              const count = qty[key] || 0
              const metersRow = item.includes('m²')
              return (
                <li
                  key={key}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-peach/40 py-3"
                >
                  <span className="min-w-0 flex-1 text-warm">{label(item)}</span>
                  <span className="font-serif text-warm tabular-nums">
                    {price}
                    <span className="ml-1 font-sans text-xs text-warm-muted">
                      {metersRow ? t('din / m²', 'din / m²') : t('din', 'din')}
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={t(`Manje: ${label(item)}`, `Less: ${label(item)}`)}
                      disabled={count === 0}
                      onClick={() => setCount(key, count - 1)}
                      className="h-11 w-11 rounded-full bg-peach-light text-lg text-warm disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums" aria-hidden="true">
                      {count}
                    </span>
                    <button
                      type="button"
                      aria-label={t(`Više: ${label(item)}`, `More: ${label(item)}`)}
                      onClick={() => setCount(key, count + 1)}
                      className="h-11 w-11 rounded-full bg-orange text-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-xl shadow-orange/10 ring-1 ring-peach/40 lg:sticky lg:top-28" aria-live="polite">
          <p className="text-sm tracking-[0.16em] text-orange uppercase">{t('Zbir', 'Total')}</p>
          <p className="mt-3 font-serif text-4xl text-orange tabular-nums">
            {total > 0 ? formatDin(total) : '0'}
            <span className="ml-2 font-sans text-base text-warm-muted">{t('din', 'din')}</span>
          </p>
          <p className="mt-1 font-serif text-2xl text-warm tabular-nums">
            {rate ? `${euros || '0,00'} €` : '— €'}
          </p>
          {total > 0 && (
            <p className="mt-2 text-sm text-warm-muted">
              {pieces > 0 && t(`${pieces} kom.`, `${pieces} pcs`)}
              {pieces > 0 && meters > 0 && ' · '}
              {meters > 0 && `${meters} m²`}
            </p>
          )}
          {chosen.length > 0 && (
            <ul className="mt-4 border-t border-peach/50 pt-3 text-sm">
              {chosen.map((row) => (
                <li key={row.key} className="flex items-baseline gap-2 py-1.5">
                  <span className="text-warm">
                    {row.count}
                    {row.meters ? ' m²' : ' ×'} {label(row.item)}
                  </span>
                  <span className="mb-1 min-w-3 flex-1 border-b border-dotted border-peach" />
                  <span className="font-serif text-warm tabular-nums">{formatDin(row.sum)}</span>
                </li>
              ))}
            </ul>
          )}
          {(rate || rateMissing || meters > 0) && (
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-warm-muted">
              {rate ? (
                <p>{t(`Po srednjem kursu NBS, ${rateLabel}. Naplata je u dinarima.`, `At the NBS middle rate, ${rateLabel}. Payment is in dinars.`)}</p>
              ) : (
                rateMissing && (
                  <p>
                    {t(
                      'Kurs NBS nije stigao, pa evro nije ispisan.',
                      'The NBS rate did not arrive, so the euro figure is not shown.',
                    )}
                  </p>
                )
              )}
              {meters > 0 && (
                <p>
                  {t(
                    'Za zavese i ćilim množilac je kvadrat koji ste uneli.',
                    'For curtains and carpet, the multiplier is the square metres you entered.',
                  )}
                </p>
              )}
            </div>
          )}
          {total > 0 && (
            <button
              type="button"
              onClick={() => setQty({})}
              className="mt-4 min-h-11 text-sm text-orange underline-offset-2 hover:underline"
            >
              {t('Obriši zbir', 'Clear the total')}
            </button>
          )}
        </aside>
        </div>
      </div>
    </section>
  )
}
