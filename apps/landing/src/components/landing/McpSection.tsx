import { Terminal } from 'lucide-react';

export function McpSection() {
  return (
    <section className="section shell" aria-labelledby="mcp-title">
      <div className="integration">
        <div className="integration-copy">
          <span className="step-icon">
            <Terminal size={20} aria-hidden="true" />
          </span>
          <h2 id="mcp-title">Connect a research agent</h2>
          <p className="section-description">
            Use Model Context Protocol (MCP) to check configurations, compare simulations, and read
            reports. With write access, an agent can start research runs and cancel its own runs.
          </p>
        </div>
        <details className="research-details integration-details">
          <summary>Connection details</summary>
          <p>Use a Streamable HTTP client and send an admin-issued token as a Bearer credential.</p>
          <code>https://v0.api.luckyplans.xyz/mcp</code>
        </details>
      </div>
    </section>
  );
}
