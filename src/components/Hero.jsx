import {
  easeInOut,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { Sparkles } from 'lucide-react'
import heroInterior from '../assets/hero-interior.jpg'
import heroWardrobe from '../assets/hero-wardrobe.jpg'
import { useRef } from 'react'
import { useA11y } from '../a11y'
import { useI18n } from '../i18n'

const services = [
  { sr: 'Odela', en: 'Suits' },
  { sr: 'Košulje', en: 'Shirts' },
  { sr: 'Jakne', en: 'Jackets' },
  { sr: 'Kaputi', en: 'Coats' },
  { sr: 'Haljine', en: 'Dresses' },
  { sr: 'Koža i krzno', en: 'Leather and fur' },
]

// Ormar se otvara i zatvara u petlji od CYCLE sekundi.
// Faze u udelu ciklusa: zatvoren (0–0.2), otvaranje (–0.38), otvoren (–0.72),
// zatvaranje (–0.9), zatvoren (–1).
const CYCLE = 10

// Sve se izvodi iz jednog sata, jer odvojene petlje po elementu iskliznu iz faze
// i onda natpisi vise preko zatvorenih vrata.
const DOOR_PHASE = [0, 0.2, 0.38, 0.72, 0.9, 1]
const LOGO_PHASE = [0, 0.18, 0.26, 0.9, 0.96, 1]

function ServicePill({ clock, index, title }) {
  const offset = index % 2 === 0 ? -28 : 28
  const enter = index * 0.015
  const phase = [0, 0.38 + enter, 0.46 + enter, 0.68, 0.74, 1]

  const opacity = useTransform(clock, phase, [0, 0, 1, 1, 0, 0])
  const x = useTransform(clock, phase, [offset, offset, 0, 0, offset, offset])
  const scale = useTransform(clock, phase, [0.8, 0.8, 1, 1, 0.8, 0.8])

  return (
    <motion.div
      className="w-fit rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-medium text-warm shadow-lg backdrop-blur-md sm:text-xs"
      style={{
        opacity,
        x,
        scale,
        marginLeft: index % 2 === 0 ? '0' : 'auto',
      }}
    >
      {title}
    </motion.div>
  )
}

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const { calm } = useA11y()
  const reduce = reduceMotion || calm
  const reduceRef = useRef(reduce)
  reduceRef.current = reduce
  const { t } = useI18n()

  // Uz uključeno "smanji kretanje" sat stoji na sredini ciklusa: ormar je
  // otvoren, natpisi vidljivi, logo skriven — sve bez pokreta.
  const clock = useMotionValue(reduce ? 0.55 : 0)

  useAnimationFrame((elapsed) => {
    if (reduceRef.current) {
      clock.set(0.55)
      return
    }
    clock.set(((elapsed / 1000) % CYCLE) / CYCLE)
  })

  const easeOptions = { ease: easeInOut }
  const leftDoor = useTransform(clock, DOOR_PHASE, [0, 0, -78, -78, 0, 0], easeOptions)
  const rightDoor = useTransform(clock, DOOR_PHASE, [0, 0, 78, 78, 0, 0], easeOptions)
  const interiorScale = useTransform(
    clock,
    DOOR_PHASE,
    [1.12, 1.12, 1, 1, 1.12, 1.12],
    easeOptions,
  )
  const logoOpacity = useTransform(clock, LOGO_PHASE, [1, 1, 0, 0, 1, 1])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers with parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroInterior}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-cream/30 via-transparent to-cream/90" />
        <div className="absolute inset-0 bg-linear-to-r from-cream/85 via-cream/20 to-peach-light/30" />
      </motion.div>

      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-orange/20 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -left-16 bottom-40 h-56 w-56 rounded-full bg-peach/40 blur-3xl"
            animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 pt-20 pb-8 sm:pt-24 sm:pb-16 lg:px-10 lg:pt-28 lg:pb-24">
        <div className="grid items-center gap-5 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="mb-4 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-orange uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className="h-4 w-4" />
              {t('Vračar · Beograd', 'Vračar · Belgrade')}
            </motion.p>

            <h1 className="font-serif text-4xl leading-[1.05] font-normal tracking-tight text-warm sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">{t('Čisto.', 'Clean.')}</span>
              <span className="block italic text-orange">{t('Od uvek.', 'Always.')}</span>
              <span className="block">JACKET.</span>
            </h1>
            <span className="mt-5 block h-px w-16 bg-gold" />

            <p className="mt-5 max-w-md leading-relaxed text-warm-muted text-balance sm:text-lg">
              {t(
                'Hemijsko čišćenje u srcu Vračara. Isti klijenti, već decenijama.',
                'Dry cleaning in the heart of Vračar. The same clients, for decades.',
              )}
            </p>

            <motion.div
              className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <a
                href="#usluge"
                className="rounded-full bg-orange px-6 py-3 text-sm font-medium tracking-wide text-white shadow-lg shadow-orange/25 transition hover:bg-orange/90 hover:shadow-orange/35 sm:px-8 sm:py-3.5"
              >
                {t('Naše usluge', 'Our services')}
              </a>
              <a
                href="#kontakt"
                className="rounded-full border border-warm/15 bg-white/60 px-6 py-3 text-sm font-medium tracking-wide text-warm backdrop-blur-sm transition hover:bg-white/90 sm:px-8 sm:py-3.5"
              >
                {t('Kontakt', 'Contact')}
              </a>
            </motion.div>
          </motion.div>

          {/* Wardrobe reveal animation */}
          <motion.div
            className="relative mx-auto w-full max-w-[min(17rem,28vh)] sm:max-w-sm lg:max-w-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Zajednička perspektiva daje vratima prirodnu dubinu na svim ekranima */}
            <div
              className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-2xl shadow-orange/10 ring-1 ring-white/50"
              style={{ perspective: '600px' }}
            >
              <motion.img
                src={heroWardrobe}
                alt={t('Garderober sa odećom', 'Wardrobe with clothes')}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: interiorScale }}
              />

              <motion.div
                className="absolute inset-y-0 left-0 z-10 w-1/2 origin-left bg-linear-to-r from-[#f7ebe2] to-[#e6cbba] shadow-[inset_-10px_0_20px_-8px_rgba(90,60,40,0.35)]"
                style={{ rotateY: leftDoor }}
              >
                <div className="absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange/40 shadow-inner" />
                <div className="absolute inset-4 rounded-2xl border border-white/30" />
              </motion.div>

              <motion.div
                className="absolute inset-y-0 right-0 z-10 w-1/2 origin-right bg-linear-to-l from-[#f7ebe2] to-[#e6cbba] shadow-[inset_10px_0_20px_-8px_rgba(90,60,40,0.35)]"
                style={{ rotateY: rightDoor }}
              >
                <div className="absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange/40 shadow-inner" />
                <div className="absolute inset-4 rounded-2xl border border-white/30" />
              </motion.div>

              {/* Monogram na zatvorenim vratima */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-2"
                style={{ opacity: logoOpacity }}
              >
                <span className="font-serif text-2xl tracking-[0.2em] text-warm/70 sm:text-3xl">
                  JACKET
                </span>
                <span className="h-px w-12 bg-orange/40 sm:w-16" />
                <span className="text-[0.6rem] tracking-[0.25em] text-warm-muted/70 uppercase sm:text-[0.65rem] sm:tracking-[0.3em]">
                  {t('hemijsko čišćenje', 'dry cleaning')}
                </span>
              </motion.div>

              {/* Service pills floating out */}
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center gap-1.5 p-3 sm:p-5">
                {services.map((s, i) => (
                  <ServicePill
                    key={s.sr}
                    clock={clock}
                    index={i}
                    title={t(s.sr, s.en)}
                  />
                ))}
              </div>
            </div>

            {/* Subtle float */}
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-peach/50 to-orange-soft/20 blur-2xl" />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block lg:bottom-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-warm/20 p-1.5">
            <div className="h-2 w-1 rounded-full bg-orange/60" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
