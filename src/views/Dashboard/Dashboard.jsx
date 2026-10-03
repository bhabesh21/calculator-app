"use client";

import Link from "next/link";
import { FiArrowDownRight, FiArrowUpRight, FiCalendar, FiCreditCard, FiDollarSign, FiPlus, FiTrendingUp } from "react-icons/fi";
import { BarChart, TrendChart } from "../../components/Charts/FinanceCharts";
import { EmptyState, PageHeading, Panel, SelectField, StatCard } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { categoryColors } from "../../data/themeColors";
import { currency, getMonthSummary, monthLabel, sortedSalaries, getPreviousSalary } from "../../utils/finance";
import "./Dashboard.css";

export default function Dashboard() {
  const { salaries, expenses, selectedMonth, setSelectedMonth, months, summary, totalSavings, ready } = useFinance();
  const currentRecord = summary.salaryRecord;
  const previousSalary = currentRecord ? getPreviousSalary(currentRecord, salaries) : null;
  const increment = previousSalary ? currentRecord.salary - previousSalary.salary : 0;
  const incrementPercent = previousSalary?.salary ? (increment / previousSalary.salary) * 100 : 0;
  const priorMonth = [...months].filter((month) => month < selectedMonth).sort().at(-1);
  const previousSummary = priorMonth ? getMonthSummary(priorMonth, salaries, expenses) : null;
  const compareExpense = previousSummary ? summary.totalExpenses - previousSummary.totalExpenses : 0;
  const orderedMonths = [...months].sort().slice(-6);
  const trend = orderedMonths.map((month) => getMonthSummary(month, salaries, expenses));
  const salaryRows = sortedSalaries(salaries).slice(0, 5).reverse();
  const increments = salaryRows.map((row) => {
    const prior = getPreviousSalary(row, salaries);
    return { label: monthLabel(`${row.year}-${String(row.month).padStart(2, "0")}`, true).split(" ")[0], value: prior ? Math.max(0, row.salary - prior.salary) : 0 };
  });
  const recent = [...summary.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  if (!ready) return <div className="dashboard-loading"><span className="loading-dot" />Loading your finances…</div>;

  return (
    <div className="dashboard-page">
      <PageHeading eyebrow="YOUR FINANCIAL OVERVIEW" title="Good morning." description="Here’s what’s happening with your money.">
        <SelectField className="month-picker" label="" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} options={months.map((month) => ({ value: month, label: monthLabel(month) }))} />
      </PageHeading>

      <div className="stat-grid">
        <StatCard label="Current salary" value={currency(summary.salary)} detail={currentRecord ? `Effective ${new Date(`${currentRecord.effectiveDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "No salary record"} icon={FiDollarSign} accent="purple" />
        <StatCard label="Monthly expenses" value={currency(summary.totalExpenses)} detail={`${summary.expensePercent.toFixed(1)}% of salary`} icon={FiCreditCard} accent="amber" />
        <StatCard label="Monthly savings" value={currency(summary.savings)} detail={`${summary.savingPercent.toFixed(1)}% savings rate`} icon={FiTrendingUp} />
        <StatCard label="Total savings" value={currency(totalSavings)} detail={`Through ${monthLabel(selectedMonth)}`} icon={FiCalendar} accent="blue" />
      </div>

      <div className="overview-strip">
        <div className="overview-item"><span className="overview-icon"><FiTrendingUp /></span><div><span>Salary increment</span><strong>{previousSalary ? `${increment >= 0 ? "+" : "−"}${currency(Math.abs(increment))}` : "First recorded salary"}</strong></div><small>{previousSalary ? `${incrementPercent.toFixed(2)}% since ${monthLabel(`${previousSalary.year}-${String(previousSalary.month).padStart(2, "0")}`, true)}` : "Add a previous month"}</small></div>
        <div className="overview-item"><span className="overview-icon overview-icon-muted"><FiCalendar /></span><div><span>Previous month</span><strong>{previousSummary ? currency(previousSummary.savings) : "No comparison yet"}</strong></div><small>{previousSummary ? `${monthLabel(priorMonth)} savings` : "Add a prior month to compare"}</small></div>
        <div className="overview-item"><span className="overview-icon overview-icon-muted">{compareExpense > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}</span><div><span>Expense change</span><strong className={compareExpense > 0 ? "negative" : "positive"}>{previousSummary ? `${compareExpense > 0 ? "+" : "−"}${currency(Math.abs(compareExpense))}` : "—"}</strong></div><small>{previousSummary ? "vs. previous available month" : "No comparison yet"}</small></div>
      </div>

      <div className="dashboard-grid">
        <Panel className="trend-panel" title="Your money, over time" subtitle="Salary, expenses and savings by month">
          {trend.length ? <TrendChart months={orderedMonths} series={[
            { name: "Salary", values: trend.map((item) => item.salary) },
            { name: "Expenses", values: trend.map((item) => item.totalExpenses) },
            { name: "Savings", values: trend.map((item) => item.savings) },
          ]} /> : <EmptyState title="No history yet" description="Add salary and expense records to see your trends." />}
        </Panel>
        <Panel className="increment-panel" title="Salary growth" subtitle="Increment amount by month">
          {increments.length ? <BarChart items={increments} /> : <EmptyState title="No salary history" description="Add salary records to track your growth." />}
          <Link href="/salary" className="text-link">View salary history <span>→</span></Link>
        </Panel>
      </div>

      <Panel className="recent-panel" title="Recent expenses" subtitle={`Your latest spending in ${monthLabel(selectedMonth)}`} action={<Link href="/expenses" className="text-link">View all <span>→</span></Link>}>
        {recent.length ? (
          <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead><tbody>
            {recent.map((expense) => <tr key={expense.id}><td>{new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td><td><span className="category-badge" style={{ "--category-color": categoryColors[expense.category] || "var(--primary-light)" }}><i className="category-dot" />{expense.category}</span></td><td>{expense.description}</td><td className="amount-cell">{currency(expense.amount)}</td></tr>)}
          </tbody></table></div>
        ) : <EmptyState title="A fresh start" description="No expenses recorded for this month yet." />}
      </Panel>
      <Link href="/expenses" className="dashboard-fab" aria-label="Add expense"><FiPlus /> Add expense</Link>
    </div>
  );
}
