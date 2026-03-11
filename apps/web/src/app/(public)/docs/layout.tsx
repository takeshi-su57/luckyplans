import { getPageMap } from 'nextra/page-map';
import { DocsNavbar } from '@/components/docs/DocsNavbar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs');

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <DocsNavbar />
      <div className="mx-auto flex max-w-7xl">
        <DocsSidebar pageMap={pageMap} />
        <main className="min-w-0 flex-1 px-8 py-10">
          <article className="docs-prose">{children}</article>
        </main>
      </div>
    </div>
  );
}
