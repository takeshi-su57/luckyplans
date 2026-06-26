import { BuildersSection } from './components/landing/BuildersSection';
import { ChainsSection } from './components/landing/ChainsSection';
import { Footer } from './components/landing/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { InfrastructureSection } from './components/landing/InfrastructureSection';
import { LabNotesSection } from './components/landing/LabNotesSection';
import { Navbar } from './components/landing/Navbar';
import { PrinciplesSection } from './components/landing/PrinciplesSection';
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
        <InfrastructureSection />
        <ProofSection />
        <BuildersSection />
        <ChainsSection />
        <PrinciplesSection />
        <TeamSection />
        <LabNotesSection />
      </main>
      <Footer />
    </div>
  );
}
