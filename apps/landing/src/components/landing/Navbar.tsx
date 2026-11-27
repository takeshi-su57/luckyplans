import { ArrowUpRight } from 'lucide-react';
import { appUrl, docsUrl } from '../../config/public-site-urls';

export function Navbar() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="shell nav" aria-label="Main navigation">
        <a className="brand" href="#top">
          <img src="/brand.png" alt="" width="32" height="32" />
          LuckyPlans
        </a>
        <div className="nav-sections">
          <a href="#workflow">Workflow</a>
          <a href="#research">Research</a>
          <a href={docsUrl}>Docs</a>
        </div>
        <a className="button button-outline nav-cta" href={appUrl}>
          Open app <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
