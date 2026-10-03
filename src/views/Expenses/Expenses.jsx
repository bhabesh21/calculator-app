"use client";

import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Button, EmptyState, PageHeading, Panel, SelectField, StatCard } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { categoryColors, paymentClasses } from "../../data/themeColors";
import { currency, expenseMonth, makeId, monthLabel } from "../../utils/finance";
import "./Expenses.css";

const blankExpense = (category) => ({
  date: new Date().toISOString().slice(0, 10),
  category: category || "Other",
  description: "",
  amount: "",
  paymentMethod: "UPI",
  notes: "",
});

export default function Expenses() {
  const { expenses, setExpenses, categories, selectedMonth, setSelectedMonth, months, notify } = useFinance();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankExpense(categories[0]));
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => [...expenses]
    .filter((item) => expenseMonth(item) === selectedMonth)
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) => !dateFilter || item.date === dateFilter)
    .filter((item) => `${item.description} ${item.category} ${item.notes}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [expenses, selectedMonth, categoryFilter, dateFilter, query]);
  const monthTotal = expenses.filter((item) => expenseMonth(item) === selectedMonth).reduce((total, item) => total + Number(item.amount), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = expenses.filter((item) => item.date === today).reduce((total, item) => total + Number(item.amount), 0);
  const allTotal = expenses.reduce((total, item) => total + Number(item.amount), 0);

  const openNew = () => { setEditing("new"); setForm(blankExpense(categories[0])); };
  const openEdit = (expense) => { setEditing(expense.id); setForm({ ...expense }); };
  const saveExpense = (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0) {
      notify("Add a description and a valid amount.");
      return;
    }
    const isEditing = editing !== "new";
    const record = { ...form, id: isEditing ? editing : makeId(), amount };
    setExpenses((current) => isEditing ? current.map((item) => item.id === editing ? record : item) : [record, ...current]);
    setEditing(null);
    notify(isEditing ? "Expense updated." : "Expense added.");
  };
  const confirmDelete = () => {
    setExpenses((current) => current.filter((item) => item.id !== deleteTarget));
    setDeleteTarget(null);
    notify("Expense deleted.");
  };

  return (
    <div className="expenses-page">
      <PageHeading eyebrow="SPENDING" title="Expenses" description="Every purchase, accounted for.">
        <Button onClick={openNew}><FiPlus /> Add expense</Button>
      </PageHeading>
      <div className="stat-grid expense-stat-grid">
        <StatCard label="Today's expenses" value={currency(todayTotal)} detail={todayTotal ? "Across all categories" : "No spending recorded today"} accent="amber" />
        <StatCard label="This month's expenses" value={currency(monthTotal)} detail={monthLabel(selectedMonth)} accent="amber" />
        <StatCard label="All-time expenses" value={currency(allTotal)} detail={`${expenses.length} recorded transactions`} accent="blue" />
        <StatCard label="Transactions this month" value={expenses.filter((item) => expenseMonth(item) === selectedMonth).length.toLocaleString("en-IN")} detail="Keep every rupee in view" accent="blue" />
      </div>
      <Panel className="expenses-table-panel" title="Expense transactions" subtitle={`${filtered.length} records in ${monthLabel(selectedMonth)}`} action={<div className="expense-filters">
        <label className="search-field"><FiSearch /><input aria-label="Search expenses" placeholder="Search expenses" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <SelectField label="" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} options={months.map((month) => ({ value: month, label: monthLabel(month) }))} />
        <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
        <input className="date-filter" aria-label="Filter by date" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
      </div>}>
        {filtered.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Payment</th><th>Amount</th><th aria-label="Actions" /></tr></thead><tbody>
          {filtered.map((expense) => <tr key={expense.id}><td>{new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td><span className="category-badge" style={{ "--category-color": categoryColors[expense.category] || "var(--primary-light)" }}><i className="category-dot" />{expense.category}</span></td><td><span className="expense-description">{expense.description}</span>{expense.notes && <small className="table-note">{expense.notes}</small>}</td><td><span className={`payment-badge ${paymentClasses[expense.paymentMethod] || "payment-other"}`}>{expense.paymentMethod}</span></td><td className="amount-cell">{currency(expense.amount)}</td><td><div className="action-group"><button className="icon-action" aria-label={`Edit ${expense.description}`} onClick={() => openEdit(expense)}><FiEdit2 /></button><button className="icon-action danger" aria-label={`Delete ${expense.description}`} onClick={() => setDeleteTarget(expense.id)}><FiTrash2 /></button></div></td></tr>)}
        </tbody></table></div> : <EmptyState title={query || dateFilter || categoryFilter !== "all" ? "No matching expenses" : "Nothing spent this month"} description="Try adjusting the filters, or add your first expense." />}
      </Panel>

      {editing && editing !== "new" && (
        <ExpenseFormModal title="Edit expense" form={form} setForm={setForm} categories={categories} onClose={() => setEditing(null)} onSubmit={saveExpense} />
      )}
      {deleteTarget && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}><section className="confirm-modal" role="dialog" aria-modal="true"><div className="confirm-icon danger-icon"><FiTrash2 /></div><h2>Delete this expense?</h2><p>This transaction will be permanently removed.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></div></section></div>}
      {editing === "new" && <ExpenseFormModal title="Add expense" form={form} setForm={setForm} categories={categories} onClose={() => setEditing(null)} onSubmit={saveExpense} />}
    </div>
  );
}

function ExpenseFormModal({ title, form, setForm, categories, onClose, onSubmit }) {
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal-form" onSubmit={onSubmit}>
        <h2>{title}</h2>
        <div className="form-grid">
          <label className="field-label"><span>Date</span><input type="date" required value={form.date} onChange={update("date")} /></label>
          <label className="field-label"><span>Category</span><select value={form.category} onChange={update("category")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="field-label"><span>Description</span><input required maxLength="90" placeholder="e.g. Weekly groceries" value={form.description} onChange={update("description")} /></label>
          <label className="field-label"><span>Amount (₹)</span><input type="number" min="1" step="0.01" required placeholder="0.00" value={form.amount} onChange={update("amount")} /></label>
          <label className="field-label"><span>Payment method</span><select value={form.paymentMethod} onChange={update("paymentMethod")}><option>UPI</option><option>Card</option><option>Cash</option><option>Bank transfer</option><option>Other</option></select></label>
          <label className="field-label field-wide"><span>Notes (optional)</span><textarea maxLength="300" placeholder="Add a note for later…" value={form.notes} onChange={update("notes")} /></label>
        </div>
        <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">{title.startsWith("Edit") ? "Save changes" : "Add expense"}</Button></div>
      </form>
    </div>
  );
}
