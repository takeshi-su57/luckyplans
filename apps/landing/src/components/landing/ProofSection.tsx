import { ChartNoAxesCombined, ListChecks, ScanSearch } from 'lucide-react';

const steps = [
  {
    title: 'Choose which traders to follow',
    body: 'Rank traders from data available at the time of selection. Compare a net signal that includes costs with a directional signal that isolates trade PnL.',
    Icon: ScanSearch,
  },
  {
    title: 'Replay follower trades',
    body: 'Replay copy or reverse-copy rules, then inspect the follower ledger for directional PnL, fees, weekly results, and the effect of removing the largest positions.',
    Icon: ChartNoAxesCombined,
  },
  {
    title: 'Apply portfolio limits',
    body: 'Replay the ledger as one follower account. Test bankroll, leverage, exposure and loss limits, then compare realized-equity drawdown and rejected entries.',
    Icon: ListChecks,
  },
];

export function ProofSection() {
  return (
    <section id="workflow" className="section shell" aria-labelledby="workflow-title">
      <p className="eyebrow">Copy-trading workflow</p>
      <h2 id="workflow-title">See what a follower would have experienced.</h2>
      <div className="workflow-grid">
        {steps.map(({ title, body, Icon }) => (
          <article className="workflow-card" key={title}>
            <Icon className="workflow-icon" size={24} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <p className="method-note">
        The optional collateral loss cap limits realized losses in the portfolio replay. Intratrade
        liquidation requires a price path.
      </p>
      <div className="mcp-card">
        <div>
          <h3>Agent access through MCP</h3>
          <p>
            Use an admin-issued token to validate configurations, compare simulations, and read
            research reports. A write-scoped token can start research and cancel runs it created.
          </p>
        </div>
        <details className="research-details">
          <summary>Connection details</summary>
          <p>
            Point a Streamable HTTP MCP client at <code>https://v0.api.luckyplans.xyz/mcp</code> and
            send the admin-issued token as a Bearer credential. Read scope covers reports and
            configuration checks. Write scope also enables research creation and cancellation.
          </p>
        </details>
      </div>
    </section>
  );
}
