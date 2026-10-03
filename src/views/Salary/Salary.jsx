"use client";

import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { Button, EmptyState, PageHeading, Panel, StatCard } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { currency, getPreviousSalary, makeId, monthNames, monthLabel } from "../../utils/finance";
import "./Salary.css";

const blankSalary = () => ({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), salary: "", effectiveDate: new Date().toISOString().slice(0, 10), notes: "" });

export default function Salary() {
  const { salaries, setSalaries, notify } = useFinance();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankSalary());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const chronological = useMemo(() => [...salaries].sort((a, b) => a.year - b.year || a.month - b.month), [salaries]);
  const latest = chronological.at(-1);
  const earliest = chronological[0];
  const totalGrowth = earliest && latest ? latest.salary - earliest.salary : 0;
  const averageSalary = salaries.length ? salaries.reduce((sum, item) => sum + Number(item.salary), 0) / salaries.length : 0;

  const openNew = () => { setEditing("new"); setForm(blankSalary()); };
  const openEdit = (record) => { setEditing(record.id); setForm({ ...record }); };
  const saveSalary = (event) => {
    event.preventDefault();
    const salary = Number(form.salary);
    if (!Number.isFinite(salary) || salary <= 0 || !form.effectiveDate) {
      notify("Enter a valid salary and effective date.");
      return;
    }
    const duplicate = salaries.find((item) => item.year === Number(form.year) && item.month === Number(form.month) && item.id !== (editing === "new" ? null : editing));
    if (duplicate) {
      notify("A salary record already exists for that month. Edit it instead.");
      return;
    }
    const isEditing = editing !== "new";
    const record = { ...form, id: isEditing ? editing : makeId(), month: Number(form.month), year: Number(form.year), salary };
    setSalaries((current) => isEditing ? current.map((item) => item.id === editing ? record : item) : [...current, record]);
    setEditing(null);
    notify(isEditing ? "Salary record updated." : "Salary record added.");
  };
  const removeSalary = () => {
    setSalaries((current) => current.filter((item) => item.id !== deleteTarget));
    setDeleteTarget(null);
    notify("Salary record deleted.");
  };

  return (
    <div className="salary-page">
      <PageHeading eyebrow="INCOME HISTORY" title="Salary" description="Your career growth, month by month."><Button onClick={openNew}><FiPlus /> Add salary</Button></PageHeading>
      <div className="stat-grid">
        <StatCard label="Latest monthly salary" value={latest ? currency(latest.salary) : currency(0)} detail={latest ? monthLabel(`${latest.year}-${String(latest.month).padStart(2, "0")}`) : "Add your first record"} icon={FiTrendingUp} accent="purple" />
        <StatCard label="Growth since first record" value={`${totalGrowth >= 0 ? "+" : "−"}${currency(Math.abs(totalGrowth))}`} detail={earliest && latest ? `${((totalGrowth / earliest.salary) * 100).toFixed(2)}% overall growth` : "Add more salary history"} accent="green" />
        <StatCard label="Average monthly salary" value={currency(averageSalary)} detail={`Across ${salaries.length} salary ${salaries.length === 1 ? "record" : "records"}`} accent="purple" />
        <StatCard label="Recorded months" value={salaries.length.toLocaleString("en-IN")} detail="Salary history entries" accent="blue" />
      </div>
      <Panel className="salary-history-panel" title="Salary history" subtitle="Increment and growth are calculated against the previous recorded month">
        {chronological.length ? <div className="data-table-wrap"><table className="data-table salary-table"><thead><tr><th>Month</th><th>Effective date</th><th>Salary</th><th>Increment</th><th>Increment %</th><th>Notes</th><th aria-label="Actions" /></tr></thead><tbody>
          {[...chronological].reverse().map((record) => {
            const previous = getPreviousSalary(record, salaries);
            const change = previous ? record.salary - previous.salary : null;
            const percentage = previous?.salary ? (change / previous.salary) * 100 : null;
            return <tr key={record.id}><td><strong className="salary-month">{monthLabel(`${record.year}-${String(record.month).padStart(2, "0")}`)}</strong></td><td>{new Date(`${record.effectiveDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td className="amount-cell">{currency(record.salary)}</td><td className={change > 0 ? "positive" : ""}>{change === null ? "—" : `${change > 0 ? "+" : ""}${currency(change)}`}</td><td>{percentage === null ? "—" : `${percentage.toFixed(2)}%`}</td><td className="salary-notes">{record.notes || "—"}</td><td><div className="action-group"><button className="icon-action" aria-label={`Edit salary for ${monthLabel(`${record.year}-${String(record.month).padStart(2, "0")}`)}`} onClick={() => openEdit(record)}><FiEdit2 /></button><button className="icon-action danger" aria-label={`Delete salary for ${monthLabel(`${record.year}-${String(record.month).padStart(2, "0")}`)}`} onClick={() => setDeleteTarget(record.id)}><FiTrash2 /></button></div></td></tr>;
          })}
        </tbody></table></div> : <EmptyState title="No salary history yet" description="Add your monthly salary to start tracking your growth and savings." />}
      </Panel>
      <div className="salary-footnote"><FiTrendingUp /><span>Salary changes take effect from the selected month and apply to future months until another salary record is added.</span></div>
      {editing && <SalaryFormModal title={editing === "new" ? "Add salary record" : "Edit salary record"} form={form} setForm={setForm} onClose={() => setEditing(null)} onSubmit={saveSalary} />}
      {deleteTarget && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}><section className="confirm-modal" role="dialog" aria-modal="true"><div className="confirm-icon danger-icon"><FiTrash2 /></div><h2>Delete this salary record?</h2><p>Your monthly calculations will be updated.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={removeSalary}>Delete</Button></div></section></div>}
    </div>
  );
}

function SalaryFormModal({ title, form, setForm, onClose, onSubmit }) {
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="modal-form" onSubmit={onSubmit}>
    <h2>{title}</h2><div className="form-grid">
      <label className="field-label"><span>Month</span><select value={form.month} onChange={update("month")}>{monthNames.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></label>
      <label className="field-label"><span>Year</span><input type="number" min="1900" max="2200" required value={form.year} onChange={update("year")} /></label>
      <label className="field-label"><span>Monthly salary (₹)</span><input type="number" min="1" step="0.01" required placeholder="e.g. 50000" value={form.salary} onChange={update("salary")} /></label>
      <label className="field-label"><span>Effective date</span><input type="date" required value={form.effectiveDate} onChange={update("effectiveDate")} /></label>
      <label className="field-label field-wide"><span>Notes (optional)</span><textarea maxLength="300" placeholder="Promotion, annual review…" value={form.notes} onChange={update("notes")} /></label>
    </div><div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save salary</Button></div>
  </form></div>;
}
