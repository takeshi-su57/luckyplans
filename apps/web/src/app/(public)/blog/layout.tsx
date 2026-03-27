import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#37352f]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
