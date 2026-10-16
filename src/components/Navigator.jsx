import { useEffect, useMemo, useState } from 'react'
import { Car, LocateFixed } from 'lucide-react'
import { googleUrl, inBelgrade, toLatin, yandexUrl } from '../navigator/advice'
import { compareNumbers, fold, foldNumber, loadAreaNumbers, loadDirectory } from '../navigator/directory'
import { useI18n } from '../i18n'

const numberPattern = /^\d{1,4}\p{L}?(?:\/\d{1,3})?$/u

async function findBuilding(street, area, number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=rs&q=${encodeURIComponent(`${street} ${number}, ${area}, Beograd`)}`,
    { headers: { 'Accept-Language': 'sr' } },
  )
  if (!response.ok) return null
  const hits = await response.json()
  const wantedStreet = fold(street)
  const wantedNumber = foldNumber(number)
  const matches = []
  for (const hit of hits) {
    const lat = Number(hit.lat)
    const lon = Number(hit.lon)
    if (!inBelgrade(lat, lon)) continue
    const road = fold(hit.address?.road || '')
    const house = foldNumber(hit.address?.house_number || '')
    const streetOk = road === wantedStreet || (road && (road.includes(wantedStreet) || wantedStreet.includes(road)))
    if (streetOk && house && house === wantedNumber) matches.push(hit)
  }
  const hit = matches.find((item) => item.type === 'house') ?? matches[0]
  if (!hit) return null
  return { label: `${street} ${number}, ${area}`, lat: Number(hit.lat), lon: Number(hit.lon) }
}

export default function Navigator() {
  const { lang, t } = useI18n()
  const [directory, setDirectory] = useState(null)
  const [step, setStep] = useState('home')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)
  const [numbers, setNumbers] = useState([])
  const [numbersBusy, setNumbersBusy] = useState(false)
  const [house, setHouse] = useState('')
  const [draft, setDraft] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    loadDirectory()
      .then((data) => {
        if (live) setDirectory(data)
      })
      .catch(() => {
        if (live) setError(t('Spisak ulica se nije učitao. Pokušajte ponovo.', 'The street list did not load. Please try again.'))
      })
    return () => {
      live = false
    }
  }, [t])

  const needle = fold(query.trim())

  const streetHits = useMemo(() => {
    if (!directory || needle.length < 2 || step !== 'search') return []
    return directory.rows.filter((row) => fold(row.name).includes(needle)).slice(0, 40)
  }, [directory, needle, step])

  const moreStreets = useMemo(() => {
    if (!directory || needle.length < 2 || step !== 'search') return false
    return directory.rows.filter((row) => fold(row.name).includes(needle)).length > 40
  }, [directory, needle, step])

  const areaOnly = useMemo(() => {
    if (!directory || needle.length < 3 || streetHits.length > 0) return ''
    return directory.areas.find((item) => fold(item.name) === needle)?.name ?? ''
  }, [directory, needle, streetHits.length])

  const shownNumbers = useMemo(() => {
    if (!needle || step !== 'numbers') return numbers
    return numbers.filter((item) => foldNumber(item.number).includes(needle.replace(/\s/g, '')))
  }, [numbers, needle, step])

  function resetAll() {
    setStep('home')
    setQuery('')
    setPicked(null)
    setNumbers([])
    setHouse('')
    setDraft(null)
    setError('')
  }

  function openSearch(prefill = '') {
    setDraft(null)
    setQuery(prefill)
    setStep('search')
  }

  async function openStreet(street) {
    setPicked(street)
    setHouse('')
    setQuery('')
    setDraft(null)
    setNumbers([])
    setStep('numbers')
    setNumbersBusy(true)
    try {
      const book = await loadAreaNumbers(street.area)
      const raw = book?.[street.name] ?? []
      setNumbers(
        raw
          .map((item) =>
            Array.isArray(item)
              ? { number: String(item[0]), lat: item[1], lon: item[2] }
              : { number: String(item) },
          )
          .sort((a, b) => compareNumbers(a.number, b.number)),
      )
    } catch {
      setNumbers([])
    } finally {
      setNumbersBusy(false)
    }
  }

  function useOrigin(origin) {
    setDraft(origin)
    setError('')
    setStep('ready')
  }

  function onLocate() {
    if (!navigator.geolocation) {
      setError(t('Ovaj pregledač ne daje lokaciju. Upišite ulicu i broj.', 'This browser cannot share location. Type the street and number.'))
      openSearch()
      return
    }
    setBusy(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        if (!inBelgrade(lat, lon)) {
          setBusy(false)
          setError(t('Lokacija nije u Beogradu. Upišite ulicu i broj.', 'That location is not in Belgrade. Type the street and number.'))
          openSearch()
          return
        }
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18`,
            { headers: { 'Accept-Language': 'sr' } },
          )
          const data = await response.json()
          const address = data.address ?? {}
          const road = toLatin(address.road || '').trim()
          const houseNumber = toLatin(address.house_number || '').trim()
          const place =
            [address.suburb, address.city_district, address.municipality]
              .map((value) =>
                toLatin(value || '')
                  .replace(/^Beograd\s*\((.+)\)\s*$/i, '$1')
                  .replace(/\s*\(Beograd\)\s*/gi, '')
                  .trim(),
              )
              .find((value) => value && fold(value) !== 'beograd') || ''
          if (road && houseNumber) {
            setPicked({ name: road, area: place || 'Beograd' })
            useOrigin({
              label: place ? `${road} ${houseNumber}, ${place}` : `${road} ${houseNumber}`,
              lat,
              lon,
            })
            } else if (road) {
            const wanted = fold(road)
            const match = directory?.rows.find((row) => fold(row.name) === wanted)
            if (match) {
              openStreet(match)
              setError(t('Vidim ulicu, ali ne i broj. Izaberite ga.', 'The street is here, but not the number. Choose it.'))
            } else {
              openSearch(road)
              setError(t('Vidim ulicu, ali ne i broj. Upišite adresu.', 'The street is here, but not the number. Type the address.'))
            }
          } else {
            openSearch()
            setError(t('Sa ove lokacije ne vidim ulicu i broj. Upišite ih.', 'This location has no street and number. Type them.'))
          }
        } catch {
          openSearch()
          setError(t('Adresu ne mogu da pročitam. Upišite ulicu i broj.', 'I cannot read the address. Type the street and number.'))
        } finally {
          setBusy(false)
        }
      },
      () => {
        setBusy(false)
        setError(t('Lokacija nije dozvoljena. Upišite ulicu i broj.', 'Location was not allowed. Type the street and number.'))
        openSearch()
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  async function chooseListedNumber(item) {
    if (!picked) return
    const label = `${picked.name} ${item.number}, ${picked.area}`
    if (Number.isFinite(item.lat) && Number.isFinite(item.lon)) {
      useOrigin({ label, lat: item.lat, lon: item.lon })
      return
    }
    setBusy(true)
    setError('')
    try {
      const origin = await findBuilding(picked.name, picked.area, item.number)
      if (!origin) {
        setError(t('Taj broj ne mogu da postavim na mapu. Izaberite drugi.', 'I cannot place that number on the map. Choose another.'))
        return
      }
      useOrigin(origin)
    } catch {
      setError(t('Adresu sad ne mogu da proverim. Pokušajte ponovo.', 'I cannot check that address right now. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  async function submitNumber(event) {
    event.preventDefault()
    const number = house.trim()
    if (!picked || !numberPattern.test(number)) {
      setError(t('Upišite broj, na primer 8 ili 15a.', 'Enter a number, for example 8 or 15a.'))
      return
    }
    const listed = numbers.find((item) => foldNumber(item.number) === foldNumber(number))
    if (listed) {
      chooseListedNumber(listed)
      return
    }
    setBusy(true)
    setError('')
    try {
      const origin = await findBuilding(picked.name, picked.area, number)
      if (!origin) {
        setError(t('Taj broj na ovoj ulici ne nalazim. Proverite broj.', 'I cannot find that number on this street. Check the number.'))
        return
      }
      useOrigin(origin)
    } catch {
      setError(t('Adresu sad ne mogu da proverim. Pokušajte ponovo.', 'I cannot check that address right now. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div id="put" className={`relative h-full min-h-[440px] ${step === 'home' ? 'bg-white/10 lg:absolute lg:inset-0' : 'bg-white'}`}>
        {step === 'home' && (
          <>
            <iframe
              title={t('JACKET lokacija — Kičevska 8, Vračar', 'JACKET location — Kičevska 8, Vračar')}
              className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=Ki%C4%8Devska+8,+Beograd&hl=${lang}&z=17&output=embed`}
            />
            <div className="absolute bottom-8 left-3 z-10">
              <button
                type="button"
                onClick={onLocate}
                disabled={busy}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60"
              >
                <LocateFixed className="h-4 w-4" />
                {busy ? t('Čitam…', 'Reading…') : t('Taksi', 'Taxi')}
              </button>
              {error && (
                <p className="mt-2 max-w-xs rounded-2xl bg-white px-4 py-2 text-sm text-warm shadow-lg" role="alert">
                  {error}
                </p>
              )}
            </div>
          </>
        )}

        {step === 'search' && (
          <div className="p-5 sm:p-6">
            <button type="button" onClick={resetAll} className="min-h-11 text-sm text-warm-muted hover:text-warm">
              {t('Nazad', 'Back')}
            </button>
            <label className="mt-4 block text-sm text-warm-muted" htmlFor="ulica">
              {t('Upišite ulicu', 'Type the street')}
            </label>
            <input
              id="ulica"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('Na primer Gandijeva', 'For example Gandijeva')}
              autoComplete="off"
              spellCheck={false}
              className="mt-2 w-full rounded-full border border-peach bg-cream px-5 py-3.5 text-base text-warm outline-none placeholder:text-warm-muted/70 focus:border-orange"
            />
            <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-2xl border border-peach/50">
              {needle.length < 2 && (
                <p className="px-4 py-6 text-sm text-warm-muted">
                  {t('Dva slova su dovoljna da se ulica pojavi.', 'Two letters are enough for the street to appear.')}
                </p>
              )}
              {streetHits.map((item) => (
                <button
                  key={`${item.name}-${item.area}`}
                  type="button"
                  onClick={() => {
                    setError('')
                    openStreet(item)
                  }}
                  className="flex min-h-11 w-full items-baseline justify-between gap-4 border-b border-peach/40 px-4 py-3 text-left last:border-b-0 hover:bg-peach-light"
                >
                  <span className="text-warm">{item.name}</span>
                  <span className="shrink-0 text-sm text-warm-muted">{item.area}</span>
                </button>
              ))}
              {areaOnly && (
                <p className="px-4 py-6 text-sm text-warm-muted">
                  {t(
                    `${areaOnly} je deo grada, ne adresa. Upišite ulicu.`,
                    `${areaOnly} is a part of the city, not an address. Type the street.`,
                  )}
                </p>
              )}
              {needle.length >= 2 && streetHits.length === 0 && !areaOnly && (
                <p className="px-4 py-6 text-sm text-warm-muted">{t('Nema te ulice u Beogradu.', 'That street is not in Belgrade.')}</p>
              )}
            </div>
            {moreStreets && (
              <p className="mt-3 text-sm text-warm-muted">
                {t('Ima još ulica. Upišite još koje slovo.', 'There are more streets. Type another letter.')}
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm text-warm" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        {step === 'numbers' && picked && (
          <div className="p-5 sm:p-6">
            <button type="button" onClick={() => openSearch(picked.name)} className="min-h-11 text-sm text-warm-muted hover:text-warm">
              {t('Druga ulica', 'Another street')}
            </button>
            <p className="mt-4 text-sm tracking-[0.16em] text-orange uppercase">{t('Kućni brojevi', 'Building numbers')}</p>
            <h3 className="mt-2 font-serif text-3xl text-warm">{picked.name}</h3>
            <p className="mt-2 text-warm-muted">{picked.area}</p>
            {numbers.length > 12 && (
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('Pronađite broj', 'Find a number')}
                aria-label={t('Pretraga brojeva', 'Search numbers')}
                inputMode="text"
                autoComplete="off"
                className="mt-5 w-full rounded-full border border-peach bg-cream px-5 py-3.5 text-base text-warm outline-none placeholder:text-warm-muted/70 focus:border-orange"
              />
            )}
            <div className="mt-4 max-h-80 overflow-y-auto rounded-2xl border border-peach/50">
              {numbersBusy && <p className="px-4 py-6 text-sm text-warm-muted">{t('Učitavam brojeve…', 'Loading numbers…')}</p>}
              {!numbersBusy && shownNumbers.length === 0 && (
                <p className="px-4 py-6 text-sm text-warm-muted">
                  {t('Za ovu ulicu nema ponuđenih brojeva. Upišite svoj ispod.', 'This street has no listed numbers. Type yours below.')}
                </p>
              )}
              {shownNumbers.map((item) => (
                <button
                  key={item.number}
                  type="button"
                  disabled={busy}
                  onClick={() => chooseListedNumber(item)}
                  className="flex min-h-11 w-full items-baseline justify-between gap-4 border-b border-peach/40 px-4 py-3 text-left last:border-b-0 hover:bg-peach-light disabled:opacity-60"
                >
                  <span className="text-warm">
                    {picked.name} {item.number}
                  </span>
                  <span className="shrink-0 text-sm text-warm-muted">{picked.area}</span>
                </button>
              ))}
            </div>
            <form onSubmit={submitNumber} className="mt-5">
              <label className="text-sm text-warm-muted" htmlFor="broj">
                {t('Ako vašeg broja nema u spisku', 'If your number is not in the list')}
              </label>
              <div className="mt-2 flex gap-3">
                <input
                  id="broj"
                  value={house}
                  onChange={(event) => setHouse(event.target.value)}
                  placeholder={t('Broj', 'Number')}
                  autoComplete="off"
                  className="w-full rounded-full border border-peach bg-cream px-5 py-3.5 text-base text-warm outline-none placeholder:text-warm-muted/70 focus:border-orange"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="min-h-11 shrink-0 rounded-full bg-orange px-5 py-3.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {busy ? t('Proveravam…', 'Checking…') : t('Proveri', 'Check')}
                </button>
              </div>
            </form>
            {error && (
              <p className="mt-4 text-sm text-warm" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        {step === 'ready' && draft && (
          <div className="p-5 sm:p-6">
            <p className="text-sm tracking-[0.16em] text-orange uppercase">{t('Vaša adresa', 'Your address')}</p>
            <h3 className="mt-3 font-serif text-3xl text-warm">{draft.label}</h3>
            <p className="mt-3 max-w-md leading-relaxed text-warm-muted">
              {t(
                'Taksi već dobija ovu adresu i Kičevsku 8. Ako vozač pita, recite mu je.',
                'The taxi already receives this address and Kičevska 8. If the driver asks, tell them.',
              )}
            </p>
            <a
              href={yandexUrl(draft, lang)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-orange px-6 py-3.5 text-sm font-medium text-white"
            >
              <Car className="h-4 w-4" />
              {t('Otvori taksi', 'Open the taxi')}
            </a>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <a href={googleUrl(draft)} target="_blank" rel="noreferrer" className="min-h-11 text-sm text-warm-muted hover:text-warm">
                {t('Ruta u mapama', 'Route in maps')}
              </a>
              <button
                type="button"
                onClick={() => openSearch(picked?.name || '')}
                className="min-h-11 text-sm text-orange underline-offset-2 hover:underline"
              >
                {t('Izmeni', 'Change')}
              </button>
            </div>
          </div>
        )}
    </div>
  )
}
