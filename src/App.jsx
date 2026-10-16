import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Ledger from './components/Ledger'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SkipLink from './components/SkipLink'

export default function App() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="sadrzaj">
        <Hero />
        <Services />
        <Ledger />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
