import { Footer } from './components/landing/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { LabNotesSection } from './components/landing/LabNotesSection';
import { McpSection } from './components/landing/McpSection';
import { Navbar } from './components/landing/Navbar';
import { ProofSection } from './components/landing/ProofSection';

export function App() {
  return (
    <div id="top">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProofSection />
        <LabNotesSection />
        <McpSection />
      </main>
      <Footer />
    </div>
  );
}
