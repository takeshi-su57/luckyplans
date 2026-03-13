import { AppNavbar } from '@/components/app/app-navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
