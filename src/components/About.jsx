import { motion, useReducedMotion } from 'framer-motion'
import { useA11y } from '../a11y'
import { useI18n } from '../i18n'

export default function About() {
  const { t } = useI18n()
  const { calm } = useA11y()
  const reduce = useReducedMotion() || calm
  const stats = [
    { value: '30+', label: t('godina rada', 'years of work') },
    { value: t('isti', 'the same'), label: t('klijenti se vraćaju', 'clients come back') },
    { value: '24h', label: t('brza usluga', 'fast service') },
    { value: '★', label: t('poverenje koje traje', 'trust that lasts') },
  ]

  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-10">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-peach-light/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          className="mb-10 text-sm font-medium tracking-[0.2em] text-orange uppercase"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('O nama', 'About us')}
        </motion.p>

        <motion.div
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-white/80 p-6 text-center backdrop-blur-sm ring-1 ring-peach/30"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <p className="font-serif text-3xl text-orange">{stat.value}</p>
              <p className="mt-1 text-xs tracking-wide text-warm-muted uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
