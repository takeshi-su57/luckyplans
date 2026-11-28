import { ArrowUpRight } from 'lucide-react';
import { appUrl, docsUrl } from '../../config/public-site-urls';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-cta">
          <div>
            <h2>Run your own replay.</h2>
            <p>Start with a trader, a date range, and a rule you want to test.</p>
          </div>
          <a className="button button-primary" href={appUrl}>
            Open app <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-content">
          <a className="brand" href="#top">
            <img src="/brand.png" alt="" width="32" height="32" />
            LuckyPlans
          </a>
          <nav aria-label="Footer navigation">
            <a href="#workflow">Workflow</a>
            <a href="#platform">Platform</a>
            <a href="#research">Research</a>
            <a href={docsUrl}>Docs</a>
            <a href="https://github.com/takeshi-su57/luckyplans">GitHub</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
