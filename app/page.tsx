import SmoothScroll from "@/components/SmoothScroll";
import BackgroundFX from "@/components/BackgroundFX";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import TerminalPlayground from "@/components/TerminalPlayground";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <BackgroundFX />
        <ScrollProgress />
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <TerminalPlayground />
        <Leadership />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
