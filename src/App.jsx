import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Ledger from './components/Ledger'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
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
