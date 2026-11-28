import { ArrowRight, ChartNoAxesCombined, Cpu, Database, ListTodo } from 'lucide-react';

const exampleWindows = ['Window A', 'Window B', 'Window C'];

export function PlatformSection() {
  return (
    <section id="platform" className="platform section" aria-labelledby="platform-title">
      <div className="shell">
        <div className="platform-intro">
          <div>
            <p className="eyebrow">Platform architecture</p>
            <h2 id="platform-title">From on-chain trades to a portfolio replay.</h2>
          </div>
          <p className="section-description">
            LuckyPlans indexes trade events from perpetual DEXs and reconstructs each trader’s
            position history. Workers score candidates across simulation windows in parallel, using
            trade history from before each window starts.
          </p>
        </div>

        <ol className="architecture-flow" role="list" aria-label="Copy-trading simulation flow">
          <li className="architecture-stage">
            <span className="step-icon">
              <Database size={19} aria-hidden="true" />
            </span>
            <h3>Indexed DEX trades</h3>
            <p>Position opens, updates, and closes</p>
            <ArrowRight className="architecture-arrow" size={17} aria-hidden="true" />
          </li>
          <li className="architecture-stage architecture-scheduler">
            <span className="step-icon">
              <ListTodo size={19} aria-hidden="true" />
            </span>
            <h3>Scheduler</h3>
            <p>Queues evaluation tasks by window</p>
          </li>
          <li className="architecture-workers">
            <h3>Parallel evaluator workers</h3>
            <ul className="architecture-windows" role="list" aria-label="Example window tasks">
              {exampleWindows.map((windowLabel) => (
                <li key={windowLabel}>
                  <Cpu size={16} aria-hidden="true" />
                  {windowLabel}
                </li>
              ))}
            </ul>
          </li>
          <li className="architecture-stage architecture-replay">
            <span className="step-icon">
              <ChartNoAxesCombined size={19} aria-hidden="true" />
            </span>
            <h3>Portfolio replay</h3>
            <p>Replays the follower ledger in time order</p>
          </li>
        </ol>

        <div className="platform-notes">
          <p className="section-description">
            The simulation engine uses the selected traders to build a follower ledger with your
            copy direction, position sizing, and modeled fees. The portfolio replay applies your
            rules to that ledger as one account. Each accepted trade can change the capital and
            exposure available to the next one.
          </p>
          <details className="research-details">
            <summary>How workers share the load</summary>
            <p>
              The scheduler queues work based on available worker capacity. A worker needs cached
              history for the venue and date range before it can claim a task. Heartbeats renew the
              claim, and unfinished evaluations can return to the queue if the claim expires.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
