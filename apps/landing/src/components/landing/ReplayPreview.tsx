import { LineChart } from 'lucide-react';
import { useEffect, useRef } from 'react';

const chartWidth = 560;
const chartHeight = 154;
const chartMax = 500;
const chartMin = -250;
const chartZero = (chartMax / (chartMax - chartMin)) * chartHeight;
const series = [
  {
    color: '#9daba3',
    values: [
      0, -17, 24, -9, 16, -36, -21, 58, 19, 32, -42, -21, -73, -58, -101, -73, -86, -143, -111,
      -131, -111, -170, -134, -177, -152, -204, -137, -154, -100, -120,
    ],
  },
  {
    color: '#08734f',
    values: [
      0, 52, 23, 79, 64, 113, 102, 21, 49, 14, 109, 77, 176, 155, 202, 160, 185, 230, 202, 284, 263,
      313, 284, 341, 311, 401, 350, 377, 353, 380,
    ],
    shaded: true,
  },
];

function EquityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.setTransform(2, 0, 0, 2, 0, 0);
    context.clearRect(0, 0, chartWidth, chartHeight);

    for (const { color, values, shaded } of series) {
      const points = new Path2D();
      points.moveTo(1, ((chartMax - values[0]) / (chartMax - chartMin)) * chartHeight);
      values.slice(1).forEach((value, index) => {
        points.lineTo(
          ((index + 1) / (values.length - 1)) * (chartWidth - 2) + 1,
          ((chartMax - value) / (chartMax - chartMin)) * chartHeight,
        );
      });

      if (shaded) {
        const area = new Path2D(points);
        area.lineTo(chartWidth - 1, chartZero);
        area.lineTo(1, chartZero);
        area.closePath();
        const gradient = context.createLinearGradient(0, 0, 0, chartZero);
        gradient.addColorStop(0, '#3aaf7450');
        gradient.addColorStop(1, '#3aaf7400');
        context.fillStyle = gradient;
        context.fill(area);
      }

      context.lineWidth = shaded ? 2.5 : 1.5;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.strokeStyle = color;
      context.stroke(points);
    }
  }, []);

  return (
    <div className="equity-chart" aria-hidden="true">
      <div className="chart-axis">
        <span>$500</span>
        <span>$250</span>
        <span>$0</span>
        <span>−$250</span>
      </div>
      <div className="chart-plot">
        <div className="chart-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
        <canvas ref={canvasRef} width={chartWidth * 2} height={chartHeight * 2} />
      </div>
      <div className="chart-dates">
        <span>Oct 1</span>
        <span>Oct 10</span>
        <span>Oct 20</span>
        <span>Oct 30</span>
      </div>
    </div>
  );
}

export function ReplayPreview() {
  return (
    <figure className="hero-visual" aria-labelledby="preview-title">
      <div className="preview-window">
        <div className="preview-top">
          <div>
            <LineChart size={16} aria-hidden="true" />
            <span>Simulation overview</span>
          </div>
          <span className="example-label">Illustrative data</span>
        </div>
        <div className="preview-content">
          <figcaption id="preview-title" className="preview-title">
            Reverse-copy backtest
          </figcaption>
          <p className="preview-subtitle">Oct 1–30 · Realized PnL after modeled fees</p>
          <dl className="preview-metrics">
            <div>
              <dt>Follower net PnL</dt>
              <dd className="positive">+$380</dd>
            </div>
            <div>
              <dt>Leader net PnL</dt>
              <dd>−$120</dd>
            </div>
            <div>
              <dt>Follower trades</dt>
              <dd>48</dd>
            </div>
          </dl>
          <EquityChart />
          <div className="chart-legend">
            <span className="legend-follower">Follower</span>
            <span>Leader</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
