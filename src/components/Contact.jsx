import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <section id="kontakt" className="px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="overflow-hidden rounded-3xl bg-linear-to-br from-orange to-orange-soft shadow-2xl shadow-orange/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-7 sm:p-10 lg:p-14">
              <p className="mb-3 text-sm font-medium tracking-[0.2em] text-white/80 uppercase">
                Kontakt
              </p>
              <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
                Dođite u posetu
              </h2>
              <p className="mt-4 max-w-sm text-white/85 leading-relaxed">
                Nalazimo se u Kicevskoj ulici, u srcu Vračara. Radujemo se vašoj poseti.
              </p>

              <ul className="mt-10 space-y-5">
                <li className="flex items-start gap-4 text-white">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <p className="font-medium">Kicevska ulica</p>
                    <p className="text-sm text-white/75">Vračar, Beograd</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-white">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <p className="font-medium">Pon – Pet: 08 – 19</p>
                    <p className="text-sm text-white/75">Sub: 08 – 14</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-white">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <p className="font-medium">011 / XXX-XXXX</p>
                    <p className="text-sm text-white/75">Pozovite nas</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative min-h-[280px] bg-white/10 lg:min-h-0">
              <iframe
                title="JACKET lokacija — Kicevska ulica, Vračar"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.5!2d20.469!3d44.797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ3JzUwLjgiTiAyMMKwMjgnMDguNCJF!5e0!3m2!1ssr!2srs!4v1"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
