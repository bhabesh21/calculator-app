import { monthLabel } from "../../utils/finance";
import "./FinanceCharts.css";

const chartColors = ["var(--primary)", "var(--warning)", "var(--success)"];

export function TrendChart({ months, series }) {
  const width = 700;
  const height = 220;
  const padding = { top: 18, right: 18, bottom: 35, left: 50 };
  const values = series.flatMap((item) => item.values);
  const max = Math.max(...values, 1) * 1.12;
  const x = (index) => padding.left + (months.length < 2 ? 0 : (index / (months.length - 1)) * (width - padding.left - padding.right));
  const y = (value) => height - padding.bottom - (value / max) * (height - padding.top - padding.bottom);
  const chartHeight = height - padding.top - padding.bottom;
  return (
    <div className="chart-wrap">
      <div className="chart-legend">{series.map((item, index) => <span key={item.name}><i style={{ background: chartColors[index] }} />{item.name}</span>)}</div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Monthly salary, expenses, and savings trend">
        {[0, 0.33, 0.66, 1].map((ratio) => {
          const value = max * (1 - ratio);
          const label = value >= 1000 ? `${Math.round(value / 1000)}k` : Math.round(value);
          return <g key={ratio}><line x1={padding.left} x2={width - padding.right} y1={padding.top + chartHeight * ratio} y2={padding.top + chartHeight * ratio} className="chart-gridline" /><text x={padding.left - 10} y={padding.top + chartHeight * ratio + 3} textAnchor="end" className="chart-axis-label">{label}</text></g>;
        })}
        {series.map((item, seriesIndex) => (
          <g key={item.name}>
            <polyline fill="none" stroke={chartColors[seriesIndex]} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")} />
            {item.values.map((value, index) => <circle key={`${item.name}-${index}`} cx={x(index)} cy={y(value)} r="3.2" fill={chartColors[seriesIndex]} stroke="var(--bg-card)" strokeWidth="2"><title>{`${monthLabel(months[index], true)}: ₹${value.toLocaleString("en-IN")}`}</title></circle>)}
          </g>
        ))}
        {months.map((month, index) => <text key={month} x={x(index)} y={height - 10} textAnchor="middle" className="chart-axis-label">{monthLabel(month, true).split(" ")[0]}</text>)}
      </svg>
    </div>
  );
}

export function BarChart({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="bar-chart" role="img" aria-label="Salary increment history">
      {items.map((item) => (
        <div className="bar-column" key={item.label}>
          <strong>{item.value ? `₹${Math.round(item.value / 1000)}k` : "—"}</strong>
          <div className="bar-track"><span style={{ height: `${Math.max(item.value ? (item.value / max) * 100 : 0, item.value ? 5 : 0)}%` }} /></div>
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
