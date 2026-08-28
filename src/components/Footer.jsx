export default function Footer() {
  return (
    <footer className="border-t border-peach/30 px-6 py-10 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-serif text-lg text-warm">JACKET</p>
        <p className="text-sm text-warm-muted">
          Kicevska ulica · Vračar · Beograd
        </p>
        <p className="text-xs text-warm-muted/70">
          © {new Date().getFullYear()} JACKET hemijsko čišćenje
        </p>
      </div>
    </footer>
  )
}
