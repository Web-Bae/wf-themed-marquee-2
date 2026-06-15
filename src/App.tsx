import { LogoMarquee } from './components/LogoMarquee/LogoMarquee'
import logo418 from './assets/logos/logoipsum-418.svg?raw'
import logo423 from './assets/logos/logoipsum-423.svg?raw'
import logo426 from './assets/logos/logoipsum-426.svg?raw'
import logo428 from './assets/logos/logoipsum-428.svg?raw'
import logo430 from './assets/logos/logoipsum-430.svg?raw'
import './App.css'

const logos = [logo418, logo423, logo426, logo428, logo430]

function App() {
  return (
    <main className="demo">
      <h1 className="demo__eyebrow">Trusted by teams everywhere</h1>

      <section className="demo__panel">
        <LogoMarquee speed={70} logoHeight={28} color="var(--text-h)">
          {logos.map((svg, i) => (
            <span key={i} dangerouslySetInnerHTML={{ __html: svg }} />
          ))}
        </LogoMarquee>
      </section>
    </main>
  )
}

export default App
