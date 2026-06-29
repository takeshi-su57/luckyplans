import { Footer } from './components/landing/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { LabNotesSection } from './components/landing/LabNotesSection';
import { Navbar } from './components/landing/Navbar';
import { ProblemSection } from './components/landing/ProblemSection';
import { ProofSection } from './components/landing/ProofSection';
import { StatsSection } from './components/landing/StatsSection';
import { TeamSection } from './components/landing/TeamSection';

export function App() {
  return (
    <div className="min-h-screen bg-default-50 text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <ProofSection />
        <TeamSection />
        <LabNotesSection />
      </main>
      <Footer />
    </div>
  );
}
