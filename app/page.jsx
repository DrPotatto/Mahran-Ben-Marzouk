import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SkipLink from '../components/layout/SkipLink';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Showroom from '../components/sections/Showroom';
import Services from '../components/sections/Services';
import Portfolio from '../components/sections/Portfolio';
import Process from '../components/sections/Process';
import Quality from '../components/sections/Quality';
import Estimator from '../components/sections/Estimator';
import Contact from '../components/sections/Contact';
import ScrollProgress from '../components/ui/ScrollProgress';

// Server component: composes the page. Each section is a client component because
// it reads the active language; heavy 3D code is loaded dynamically inside them.
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Showroom />
        <Services />
        <Portfolio />
        <Process />
        <Quality />
        <Estimator />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
