import { BlogFooter } from '@/components/blog/BlogFooter';
import { BlogNavbar } from '@/components/blog/BlogNavbar';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#37352f]">
      <BlogNavbar />
      <main>{children}</main>
      <BlogFooter />
    </div>
  );
}
