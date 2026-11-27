import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { appUrl } from '../../config/public-site-urls';
import { ReplayPreview } from './ReplayPreview';

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero-layout">
        <div className="hero-content">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" /> Perpetual DEX research
          </p>
          <h1 id="hero-title">
            Test trades
            <br />
            <span>before you copy.</span>
          </h1>
          <p className="hero-description">
            Find traders on decentralized perpetual futures exchanges, replay their historical
            trades, and see how fees and portfolio limits would have changed your results.
          </p>
          <div className="actions">
            <a className="button button-primary" href={appUrl}>
              Open app <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="button button-outline" href="#workflow">
              See the workflow <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <ReplayPreview />
      </div>
    </section>
  );
}
