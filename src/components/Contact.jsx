import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'
import Navigator from './Navigator'
import { useI18n } from '../i18n'

export default function Contact() {
  const { t } = useI18n()

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
                {t('Kontakt', 'Contact')}
              </p>
              <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
                Kičevska 8
              </h2>
              <p className="soft-on-orange mt-4 max-w-sm leading-relaxed">
                {t(
                  'Hemijsko čišćenje na Vračaru. Radno vreme, telefon i mapa.',
                  'Dry cleaning in Vračar. Hours, phone and the map.',
                )}
              </p>

              <ul className="mt-10 space-y-5">
                <li className="flex items-start gap-4 text-white">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <p className="font-medium">Kičevska 8</p>
                    <p className="soft-on-orange text-sm">{t('Vračar, Beograd', 'Vračar, Belgrade')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-white">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <p className="font-medium">{t('Pon – Pet: 08 – 20', 'Mon – Fri: 08 – 20')}</p>
                    <p className="soft-on-orange text-sm">{t('Sub: 08 – 15', 'Sat: 08 – 15')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-white">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
                  <div>
                    <a href="tel:+381638471002" className="text-lg font-medium">
                      063 847 1002
                    </a>
                    <p className="soft-on-orange text-sm">{t('Pozovite nas', 'Call us')}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative h-full min-h-[440px]">
              <Navigator />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
