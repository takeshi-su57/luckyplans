export function LabNotesSection() {
  return (
    <section id="research" className="research section" aria-labelledby="research-title">
      <div className="shell research-grid">
        <div className="research-copy">
          <p className="eyebrow">Strategy research</p>
          <h2 id="research-title">How strategies hold up on later data.</h2>
          <p className="section-description">
            The local BVIV workbench pairs Gains trader activity with Bitcoin implied volatility
            prices. It lets you combine signals, filters, position sizing, and exits, then backtest
            those rules on archived five-minute prices.
          </p>
          <details className="research-details">
            <summary>How the validation works</summary>
            <p>
              Search with Optuna or a grid, then take a fixed candidate into validation.
              Walk-forward scoring compares consecutive train and test segments. The robustness
              check measures stability across shifted windows.
            </p>
          </details>
        </div>
        <figure className="study">
          <figcaption>
            <h3>BVIV preset validation</h3>
            <p>
              <time dateTime="2026-11-25">November 25, 2026</time> · 2,772 five-minute validation
              bars
            </p>
          </figcaption>
          <div className="study-split">
            <span>70% parameter search</span>
            <span>30% validation</span>
          </div>
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
            Both presets cleared the 0.600 robustness threshold and fell short on walk-forward
            consistency. This run preceded the inclusion of financing costs in the research scores.
          </p>
        </figure>
      </div>
    </section>
  );
}
