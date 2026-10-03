"use client";

import { useState } from "react";
import { FiArrowUpRight, FiFlag, FiTarget, FiTrendingUp } from "react-icons/fi";
import { Button, PageHeading, Panel, SelectField, StatCard } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { currency, monthLabel } from "../../utils/finance";
import "./Savings.css";

export default function Savings() {
  const { summary, totalSavings, goal, setGoal, selectedMonth, setSelectedMonth, months, notify } = useFinance();
  const [goalInput, setGoalInput] = useState(String(goal));
  const [editingGoal, setEditingGoal] = useState(false);
  const goalProgress = goal > 0 ? (totalSavings / goal) * 100 : 0;

  const saveGoal = (event) => {
    event.preventDefault();
    const nextGoal = Number(goalInput);
    if (!Number.isFinite(nextGoal) || nextGoal <= 0) {
      notify("Enter a savings goal greater than zero.");
      return;
    }
    setGoal(nextGoal);
    setEditingGoal(false);
    notify("Savings goal updated.");
  };

  return (
    <div className="savings-page">
      <PageHeading eyebrow="BUILDING YOUR FUTURE" title="Savings" description="Small choices today, more freedom tomorrow.">
        <SelectField className="month-picker" label="" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} options={months.map((month) => ({ value: month, label: monthLabel(month) }))} />
      </PageHeading>
      <div className="stat-grid">
        <StatCard label="This month's savings" value={currency(summary.savings)} detail={monthLabel(selectedMonth)} icon={FiTrendingUp} />
        <StatCard label="Total accumulated" value={currency(totalSavings)} detail={`Through ${monthLabel(selectedMonth)}`} icon={FiArrowUpRight} />
        <StatCard label="Savings rate" value={`${summary.savingPercent.toFixed(1)}%`} detail={summary.salary ? `${currency(summary.savings)} of ${currency(summary.salary)} salary` : "Add a salary record"} icon={FiTarget} />
        <StatCard label="Savings goal" value={currency(goal)} detail={goalProgress >= 100 ? "Goal reached — amazing work!" : `${Math.max(0, 100 - goalProgress).toFixed(1)}% still to go`} icon={FiFlag} accent="amber" />
      </div>

      <div className="savings-content">
        <Panel className="goal-panel" title="Your savings goal" subtitle="Every month gets you a little closer">
          <div className="goal-amounts"><div><span>Current savings</span><strong>{currency(totalSavings)}</strong></div><div className="goal-target"><span>Target</span><strong>{currency(goal)}</strong></div></div>
          <div className="goal-track" role="progressbar" aria-label="Savings goal progress" aria-valuenow={Math.min(goalProgress, 100)} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${Math.min(Math.max(goalProgress, 0), 100)}%` }} /></div>
          <div className="goal-progress-label"><span>{goalProgress.toFixed(1)}% complete</span><span>{currency(Math.max(goal - totalSavings, 0))} to go</span></div>
          <div className="goal-message"><span className="goal-message-icon"><FiFlag /></span><div><strong>{goalProgress >= 100 ? "You did it." : "You’re making progress."}</strong><p>{goalProgress >= 100 ? "Your savings goal has been reached. Set a new one whenever you're ready." : `Keep going — your ${monthLabel(selectedMonth)} savings bring you closer to the things that matter.`}</p></div></div>
          {editingGoal ? <form className="goal-edit-form" onSubmit={saveGoal}><label className="field-label"><span>New goal amount (₹)</span><input autoFocus type="number" min="1" step="1" value={goalInput} onChange={(event) => setGoalInput(event.target.value)} required /></label><div><Button type="button" variant="secondary" onClick={() => setEditingGoal(false)}>Cancel</Button><Button type="submit">Save goal</Button></div></form> : <Button className="goal-edit-button" variant="secondary" onClick={() => { setGoalInput(String(goal)); setEditingGoal(true); }}>Adjust savings goal</Button>}
        </Panel>
        <Panel className="monthly-saving-panel" title={`${monthLabel(selectedMonth)} breakdown`} subtitle="Salary less expenses equals your savings">
          <div className="saving-equation"><span>Monthly salary</span><strong>{currency(summary.salary)}</strong></div>
          <div className="saving-equation expense-equation"><span>Total expenses</span><strong>− {currency(summary.totalExpenses)}</strong></div>
          <div className="equation-divider" />
          <div className="saving-equation savings-equation"><span>Monthly savings</span><strong>{currency(summary.savings)}</strong></div>
          <div className="savings-rate-box"><span>Saving rate</span><strong>{summary.savingPercent.toFixed(1)}%</strong><span className="rate-context">of monthly salary</span></div>
          <div className="saving-tip"><FiTrendingUp /><p>Your savings are calculated from this month’s salary and expenses. Other months stay separate.</p></div>
        </Panel>
      </div>
    </div>
  );
}
