export function LabNotesSection() {
  return (
    <section id="research" className="research section" aria-labelledby="research-title">
      <div className="shell research-grid">
        <div>
          <p className="eyebrow">Separate research workbench</p>
          <h2 id="research-title">Test strategies on BVIV.</h2>
          <p className="section-description">
            The local workbench charts Gains trader activity alongside BTC implied-volatility
            prices. Build strategies from signals, filters, sizing, and exits, then backtest them on
            an archived five-minute price series.
          </p>
          <p className="section-description">
            Search parameters with Optuna or a grid. Take a candidate from the Pareto front into
            walk-forward and shifted-window robustness checks on a separate validation partition.
          </p>
          <details className="research-details">
            <summary>How the validation works</summary>
            <p>
              Search uses the first 70% of the discovery archive. Validation runs a fixed candidate
              on the final 30%. Walk-forward scoring compares results across consecutive train and
              test segments. The robustness check measures stability across shifted windows.
            </p>
          </details>
        </div>
        <figure className="study">
          <figcaption>
            <h3>BVIV preset validation</h3>
            <p>November 25, 2026 · 2,772 five-minute validation bars</p>
          </figcaption>
          <table>
            <thead>
              <tr>
                <th scope="col">Preset</th>
                <th scope="col">Walk-forward</th>
                <th scope="col">Robustness</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">EMA</th>
                <td>
                  <span className="score fail">0.285 · Fail</span>
                </td>
                <td>
                  <span className="score pass">0.648 · Pass</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Donchian</th>
                <td>
                  <span className="score fail">0.000 · Fail</span>
                </td>
                <td>
                  <span className="score pass">0.606 · Pass</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="study-note">
            Each check required a score of 0.600. Both presets fell short on walk-forward
            consistency.
          </p>
        </figure>
      </div>
    </section>
  );
}
