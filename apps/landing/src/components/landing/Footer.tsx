const docsUrl = 'https://docs.luckyplans.xyz';
const appUrl = 'https://app.luckyplans.xyz';
const blogUrl = '/blog';

export function Footer() {
  return (
    <footer className="border-t border-default-200 bg-content1">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <img src="/brand.png" alt="LuckyPlans" width={24} height={24} className="rounded-lg" />
            <span className="text-sm font-semibold text-foreground">Lucky Plans</span>
          </div>
          <p className="mt-2 text-sm text-default-500">
            Alpha landing page for the copy-trading, execution, and simulation product.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-default-600">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Docs
          </a>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Open App
          </a>
          <a href={blogUrl} className="transition-colors hover:text-foreground">
            Updates
          </a>
          <a
            href="https://github.com/takeshi-su57/luckyplans"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
