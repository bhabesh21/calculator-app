import "./Primitives.css";

export function PageHeading({ eyebrow, title, description, action, children }) {
  return (
    <div className="page-heading">
      <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action || children}
    </div>
  );
}

export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && <div className="panel-heading"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{action}</div>}
      {children}
    </section>
  );
}

export function StatCard({ label, value, detail, icon: Icon, accent = "green", trend }) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <div className="stat-top"><span>{label}</span><span className="stat-icon">{Icon && <Icon />}</span></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-detail">{trend && <span className="stat-trend">{trend}</span>}{detail}</div>
    </article>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

export function EmptyState({ title, description }) {
  return <div className="empty-state"><span className="empty-state-mark">—</span><strong>{title}</strong><p>{description}</p></div>;
}

export function SelectField({ label, value, onChange, options, className = "" }) {
  return (
    <label className={`field-label ${className}`}>
      {label && <span>{label}</span>}
      <select value={value} onChange={onChange}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
