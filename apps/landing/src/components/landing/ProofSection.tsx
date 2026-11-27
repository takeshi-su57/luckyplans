import { ArrowRight, ChartNoAxesCombined, ScanSearch, SlidersHorizontal } from 'lucide-react';
import { docsUrl } from '../../config/public-site-urls';

const steps = [
  {
    title: 'Find traders',
    body: 'Filter by venue, activity, and trading history. Use a historical cutoff to rank traders on the information available at the time.',
    Icon: ScanSearch,
    previewTitle: 'Selection criteria',
    previewRows: [
      ['Venue', 'Gains Network'],
      ['Selection cutoff', 'Sep 30'],
      ['Signal basis', 'Directional PnL'],
    ],
  },
  {
    title: 'Replay the trades',
    body: 'Mirror the leader or take the opposite side. Review trade-level PnL and fees in the follower ledger to see what drove the result.',
    Icon: ChartNoAxesCombined,
    previewTitle: 'Follower ledger',
    previewRows: [
      ['Direction', 'Reverse copy'],
      ['Directional PnL', '+$520'],
      ['Modeled fees', '−$140'],
    ],
  },
  {
    title: 'Test portfolio limits',
    body: 'Replay trades as one account with a starting bankroll and exposure limits. See which entries are rejected and how realized drawdown changes.',
    Icon: SlidersHorizontal,
    previewTitle: 'Portfolio replay',
    previewRows: [
      ['Starting bankroll', '$10,000'],
      ['Exposure per market side', '30% of equity'],
      ['Rejected entries', '8'],
    ],
  },
];

export function ProofSection() {
  return (
    <section id="workflow" className="section shell" aria-labelledby="workflow-title">
      <div className="section-intro">
        <p className="eyebrow">Copy-trading workflow</p>
        <h2 id="workflow-title">From trader history to portfolio risk.</h2>
        <p className="section-description">
          See how a trader’s historical positions translate into follower results under your rules.
        </p>
      </div>
      <ol className="workflow-grid" role="list">
        {steps.map(({ title, body, Icon, previewTitle, previewRows }, index) => (
          <li className="workflow-card" key={title}>
            <div className="workflow-step">
              <span className="step-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span className="step-number" aria-hidden="true">
                Step {index + 1}
              </span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <figure className="step-preview">
              <figcaption>
                <span>{previewTitle}</span>
                <span className="step-example">Example</span>
              </figcaption>
              <dl>
                {previewRows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </figure>
          </li>
        ))}
      </ol>
      <div className="workflow-note">
        <p>
          In the portfolio replay, an optional collateral cap limits realized losses. Modeling
          liquidation while a trade is open requires a historical price path.
        </p>
        <a className="text-link" href={`${docsUrl.replace(/\/$/, '')}/guides/create-simulation`}>
          Read the simulation guide <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
