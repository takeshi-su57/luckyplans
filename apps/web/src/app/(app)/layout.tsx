import { AppProviders } from '@/providers/app-providers';
import { AppNavbar } from '@/components/app/app-navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <div className="min-h-screen bg-white">
        <AppNavbar />
        <main>{children}</main>
      </div>
    </AppProviders>
  );
}
