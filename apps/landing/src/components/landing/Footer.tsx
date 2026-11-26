import { ArrowUpRight } from 'lucide-react';
import { appUrl, docsUrl } from '../../config/public-site-urls';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-content">
        <a className="brand" href="#top">
          <img src="/brand.png" alt="" width="32" height="32" />
          LuckyPlans
        </a>
        <nav aria-label="Footer navigation">
          <a href={docsUrl}>Docs</a>
          <a href="https://github.com/takeshi-su57/luckyplans">GitHub</a>
          <a href={appUrl}>
            Open app <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
