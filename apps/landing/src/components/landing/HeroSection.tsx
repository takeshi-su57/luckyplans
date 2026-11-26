import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { appUrl } from '../../config/public-site-urls';

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <picture className="hero-art">
        <img src="/research-hero.webp" alt="" fetchPriority="high" />
      </picture>
      <div className="shell hero-content">
        <p className="eyebrow">Perpetual DEX research</p>
        <h1 id="hero-title">
          Test the trade <span className="hero-accent">before you copy it.</span>
        </h1>
        <p className="hero-description">
          Replay historical trader activity, compare follower results after modeled costs, and see
          how portfolio limits change the outcome.
        </p>
        <div className="actions">
          <a className="button button-primary" href={appUrl}>
            Open app <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="button button-outline" href="#workflow">
            Explore the workflow <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
