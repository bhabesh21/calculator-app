"use client";

import { useMemo, useState } from "react";
import { FiEdit2, FiLayers, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import { Button, EmptyState, PageHeading, Panel } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { categoryColors } from "../../data/themeColors";
import "./Categories.css";

export default function Categories() {
  const { categories, setCategories, expenses, setExpenses, notify } = useFinance();
  const [dialog, setDialog] = useState(null);
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const categoryStats = useMemo(() => categories.map((category) => ({
    name: category,
    count: expenses.filter((item) => item.category === category).length,
    total: expenses.filter((item) => item.category === category).reduce((sum, item) => sum + Number(item.amount), 0),
  })), [categories, expenses]);

  const openAdd = () => { setDialog({ mode: "add" }); setName(""); };
  const openEdit = (category) => { setDialog({ mode: "edit", current: category }); setName(category); };
  const saveCategory = (event) => {
    event.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    const duplicate = categories.some((category) => category.toLowerCase() === clean.toLowerCase() && category !== dialog.current);
    if (duplicate) {
      notify("That category already exists.");
      return;
    }
    if (dialog.mode === "edit") {
      setCategories((current) => current.map((category) => category === dialog.current ? clean : category));
      setExpenses((current) => current.map((expense) => expense.category === dialog.current ? { ...expense, category: clean } : expense));
      notify("Category updated.");
    } else {
      setCategories((current) => [...current, clean]);
      notify("Category added.");
    }
    setDialog(null);
  };
  const removeCategory = () => {
    const inUse = expenses.some((expense) => expense.category === deleteTarget);
    if (inUse) {
      notify("This category has expenses. Move or remove them before deleting it.");
      setDeleteTarget(null);
      return;
    }
    if (categories.length <= 1) {
      notify("Keep at least one category for your expenses.");
      setDeleteTarget(null);
      return;
    }
    setCategories((current) => current.filter((category) => category !== deleteTarget));
    setDeleteTarget(null);
    notify("Category deleted.");
  };

  return (
    <div className="categories-page">
      <PageHeading eyebrow="MAKE IT YOURS" title="Categories" description="Organize spending in a way that makes sense to you."><Button onClick={openAdd}><FiPlus /> Add category</Button></PageHeading>
      <Panel className="categories-panel" title="Your categories" subtitle={`${categories.length} categories · edits update all linked expenses`}>
        {categoryStats.length ? <div className="category-grid">{categoryStats.map((category) => <article className="category-card" key={category.name}>
          <div className="category-card-top"><span className="category-card-icon" style={{ "--category-color": categoryColors[category.name] || "var(--primary-light)" }}><FiTag /></span><div className="action-group"><button className="icon-action" aria-label={`Edit ${category.name}`} onClick={() => openEdit(category.name)}><FiEdit2 /></button><button className="icon-action danger" aria-label={`Delete ${category.name}`} onClick={() => setDeleteTarget(category.name)}><FiTrash2 /></button></div></div>
          <strong>{category.name}</strong><div className="category-card-meta"><span>{category.count} {category.count === 1 ? "transaction" : "transactions"}</span><span>{category.total ? `₹${category.total.toLocaleString("en-IN")}` : "No spending yet"}</span></div>
        </article>)}</div> : <EmptyState title="No categories yet" description="Create categories to organize your spending." />}
      </Panel>
      <div className="categories-tip"><span><FiLayers /></span><p>Categories help you understand where your money goes. Changes to a category name are applied to the expenses already assigned to it.</p></div>
      {dialog && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}><form className="modal-form category-modal" onSubmit={saveCategory}><h2>{dialog.mode === "edit" ? "Edit category" : "Add a category"}</h2><label className="field-label"><span>Category name</span><input autoFocus required maxLength="30" placeholder="e.g. Subscriptions" value={name} onChange={(event) => setName(event.target.value)} /></label><div className="form-actions"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button type="submit">{dialog.mode === "edit" ? "Save changes" : "Add category"}</Button></div></form></div>}
      {deleteTarget && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}><section className="confirm-modal" role="dialog" aria-modal="true"><div className="confirm-icon danger-icon"><FiTrash2 /></div><h2>Delete {deleteTarget}?</h2><p>Categories with existing expenses cannot be deleted. Rename one to preserve its history.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={removeCategory}>Delete category</Button></div></section></div>}
    </div>
  );
}
