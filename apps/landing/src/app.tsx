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
    <div className="min-h-screen bg-white text-[#37352f]">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <InfrastructureSection />
        <ChainsSection />
        <PrinciplesSection />
        <BuildersSection />
        <ProofSection />
        <TeamSection />
        <LabNotesSection />
      </main>
      <Footer />
    </div>
  );
}
