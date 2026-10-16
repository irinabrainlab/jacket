import { useState } from 'react'
import { useA11y } from '../a11y'
import { useI18n } from '../i18n'

function Switch({ pressed, onClick, label, hint }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left hover:bg-peach-light"
    >
      <span>
        <span className="block text-sm font-medium text-warm">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-warm-muted">{hint}</span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${pressed ? 'bg-orange' : 'bg-peach'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${pressed ? 'left-5' : 'left-0.5'}`}
        />
      </span>
    </button>
  )
}

export default function A11yMenu() {
  const [open, setOpen] = useState(false)
  const { large, contrast, calm, setLarge, setContrast, setCalm } = useA11y()
  const { t } = useI18n()
  const senior = large && contrast && calm

  function setSenior(next) {
    setLarge(next)
    setContrast(next)
    setCalm(next)
  }

  return (
    <div className="relative">
      {open && (
        <div className="absolute top-full right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-3xl bg-white p-3 shadow-xl shadow-orange/15 ring-1 ring-peach/50">
          <p className="px-4 pt-2 text-xs tracking-[0.16em] text-orange uppercase">
            {t('Pristupačnost', 'Accessibility')}
          </p>
          <div className="mt-2" role="group" aria-label={t('Podešavanja čitanja', 'Reading settings')}>
            <Switch
              pressed={senior}
              onClick={() => setSenior(!senior)}
              label={t('Za starije', 'For older visitors')}
              hint={t(
                'Veća slova, jači kontrast, mirnija strana i podvučeni linkovi.',
                'Larger type, stronger contrast, a calmer page and underlined links.',
              )}
            />
            <Switch
              pressed={large}
              onClick={() => setLarge((value) => !value)}
              label={t('Lakše čitanje', 'Easier reading')}
              hint={t('Veći tekst i veća dugmad.', 'Larger text and larger buttons.')}
            />
            <Switch
              pressed={contrast}
              onClick={() => setContrast((value) => !value)}
              label={t('Jači kontrast', 'Stronger contrast')}
              hint={t('Tamnija slova, jasnija narandžasta.', 'Darker type, a clearer orange.')}
            />
            <Switch
              pressed={calm}
              onClick={() => setCalm((value) => !value)}
              label={t('Manje pokreta', 'Less motion')}
              hint={t('Ormar i treperenje stanu.', 'The wardrobe and the pulse stop.')}
            />
          </div>
          <a
            href="tel:+381638471002"
            className="mt-2 flex min-h-11 items-center rounded-2xl px-4 py-3 text-sm font-medium text-warm hover:bg-peach-light"
          >
            {t('Pozovite salon · 063 847 1002', 'Call the shop · 063 847 1002')}
          </a>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-label={t('Pristupačnost', 'Accessibility')}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-peach-light text-sm font-medium text-warm"
      >
        Aa
      </button>
    </div>
  )
}
