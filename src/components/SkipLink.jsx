import { useI18n } from '../i18n'

export default function SkipLink() {
  const { t } = useI18n()
  return (
    <a href="#sadrzaj" className="skip-link">
      {t('Preskoči na sadržaj', 'Skip to content')}
    </a>
  )
}
