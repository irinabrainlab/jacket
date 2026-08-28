import { motion } from 'framer-motion'

export default function About() {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-10">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-peach-light/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-3 text-sm font-medium tracking-[0.2em] text-orange uppercase">
              O nama
            </p>
            <h2 className="font-serif text-4xl leading-tight text-warm md:text-5xl">
              <span className="text-warm">Dugo smo tu.</span>{' '}
              <span className="italic text-orange">Zato se vraćaju.</span>
            </h2>
            <span className="mt-5 block h-px w-12 bg-gold" />
            <p className="mt-6 text-lg leading-relaxed text-warm-muted text-balance">
              JACKET je hemijsko čišćenje u Kicevskoj ulici. Radimo dugo, klijenti
              ostaju — odela, kuće i poverenje prelaze s kolena na koleno.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { value: '30+', label: 'godina rada' },
              { value: 'isti', label: 'klijenti se vraćaju' },
              { value: '24h', label: 'brza usluga' },
              { value: '★', label: 'poverenje koje traje' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl bg-white/80 p-6 text-center backdrop-blur-sm ring-1 ring-peach/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <p className="font-serif text-3xl text-orange">{stat.value}</p>
                <p className="mt-1 text-xs tracking-wide text-warm-muted uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
