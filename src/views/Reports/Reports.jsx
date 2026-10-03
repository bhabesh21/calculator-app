"use client";

import { useMemo, useState } from "react";
import { FiBarChart2, FiDownload } from "react-icons/fi";
import { TrendChart } from "../../components/Charts/FinanceCharts";
import { Button, EmptyState, PageHeading, Panel, SelectField, StatCard } from "../../components/Common/Primitives";
import { useFinance } from "../../context/FinanceContext";
import { categoryColors } from "../../data/themeColors";
import { currency, getMonthSummary, monthLabel, monthNames } from "../../utils/finance";
import "./Reports.css";

export default function Reports() {
  const { salaries, expenses, categories, months, selectedMonth } = useFinance();
  const yearChoices = [...new Set([...salaries.map((item) => item.year), ...expenses.map((item) => Number(item.date.slice(0, 4)))])].sort((a, b) => b - a);
  const [year, setYear] = useState(String(selectedMonth.slice(0, 4) || yearChoices[0] || new Date().getFullYear()));
  const [month, setMonth] = useState("all");

  const reportMonths = useMemo(() => {
    const keys = months.filter((key) => key.startsWith(`${year}-`) && (month === "all" || Number(key.slice(5)) === Number(month)));
    return [...keys].sort();
  }, [months, year, month]);
  const reportData = reportMonths.map((key) => getMonthSummary(key, salaries, expenses));
  const totalSalary = reportData.reduce((sum, item) => sum + item.salary, 0);
  const totalExpenses = reportData.reduce((sum, item) => sum + item.totalExpenses, 0);
  const totalSaved = reportData.reduce((sum, item) => sum + item.savings, 0);
  const savingPercent = totalSalary ? (totalSaved / totalSalary) * 100 : 0;
  const expensePercent = totalSalary ? (totalExpenses / totalSalary) * 100 : 0;
  const expenseCategoryTotals = categories.map((category) => ({
    category,
    amount: reportData.flatMap((item) => item.expenses).filter((expense) => expense.category === category).reduce((sum, item) => sum + Number(item.amount), 0),
  })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  const title = month === "all" ? `${year} annual report` : `${monthNames[Number(month) - 1]} ${year} report`;
  const downloadCsv = () => {
    const rows = [["Month", "Salary", "Expenses", "Savings", "Saving %", "Expense %"], ...reportData.map((item) => [monthLabel(item.key), item.salary, item.totalExpenses, item.savings, item.savingPercent.toFixed(2), item.expensePercent.toFixed(2)])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `moneta-report-${year}-${month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <PageHeading eyebrow="YOUR MONEY, IN PERSPECTIVE" title="Reports" description="Understand how income and spending move together.">
        <Button variant="secondary" onClick={downloadCsv}><FiDownload /> Export CSV</Button>
      </PageHeading>
      <Panel className="report-filter-panel">
        <div className="report-filter-intro"><div><span className="eyebrow">REPORT PERIOD</span><strong>{title}</strong></div><div className="report-selects">
          <SelectField label="Month" value={month} onChange={(event) => setMonth(event.target.value)} options={[{ value: "all", label: "Full year" }, ...monthNames.map((name, index) => ({ value: String(index + 1), label: name }))]} />
          <SelectField label="Year" value={year} onChange={(event) => setYear(event.target.value)} options={yearChoices.map((item) => ({ value: String(item), label: String(item) }))} />
        </div></div>
      </Panel>
      <div className="stat-grid report-stats">
        <StatCard label={month === "all" ? "Total salary" : "Monthly salary"} value={currency(totalSalary)} detail={`${reportData.length} ${reportData.length === 1 ? "month" : "months"} in report`} accent="purple" />
        <StatCard label="Total expenses" value={currency(totalExpenses)} detail={`${expensePercent.toFixed(1)}% of income`} accent="amber" />
        <StatCard label="Total savings" value={currency(totalSaved)} detail={`${savingPercent.toFixed(1)}% saving rate`} />
        <StatCard label="Average monthly savings" value={currency(reportData.length ? totalSaved / reportData.length : 0)} detail={month === "all" ? `During ${year}` : "For selected month"} accent="purple" />
      </div>

      <div className="reports-grid">
        <Panel className="report-chart-panel" title="Monthly comparison" subtitle="Income, expenses and savings at a glance">
          {reportData.length ? <TrendChart months={reportData.map((item) => item.key)} series={[
            { name: "Salary", values: reportData.map((item) => item.salary) },
            { name: "Expenses", values: reportData.map((item) => item.totalExpenses) },
            { name: "Savings", values: reportData.map((item) => item.savings) },
          ]} /> : <EmptyState title="No data for this period" description="Add salary or expense records to generate a report." />}
        </Panel>
        <Panel className="category-breakdown-panel" title="Spending by category" subtitle={`Where the money went · ${currency(totalExpenses)}`}>
          {expenseCategoryTotals.length ? <div className="category-breakdown">{expenseCategoryTotals.map((item) => <div className="breakdown-row" key={item.category}><div className="breakdown-label"><span className="category-badge" style={{ "--category-color": categoryColors[item.category] || "var(--primary-light)" }}><i className="category-dot" />{item.category}</span><strong>{currency(item.amount)}</strong></div><div className="breakdown-track"><span style={{ width: `${totalExpenses ? (item.amount / totalExpenses) * 100 : 0}%` }} /></div><small>{totalExpenses ? ((item.amount / totalExpenses) * 100).toFixed(1) : "0.0"}% of expenses</small></div>)}</div> : <EmptyState title="No expenses to break down" description="Category totals appear as you record expenses." />}
        </Panel>
      </div>
      <Panel className="report-table-panel" title="Monthly details" subtitle="A clear breakdown of each month in this report" action={<span className="report-table-icon"><FiBarChart2 /></span>}>
        {reportData.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Month</th><th>Salary</th><th>Expenses</th><th>Savings</th><th>Saving %</th><th>Expense %</th></tr></thead><tbody>{[...reportData].reverse().map((item) => <tr key={item.key}><td>{monthLabel(item.key)}</td><td>{currency(item.salary)}</td><td>{currency(item.totalExpenses)}</td><td className={item.savings >= 0 ? "positive" : "negative"}>{currency(item.savings)}</td><td>{item.savingPercent.toFixed(1)}%</td><td>{item.expensePercent.toFixed(1)}%</td></tr>)}</tbody></table></div> : <EmptyState title="No monthly details" description="Choose another period or add some finance records." />}
      </Panel>
    </div>
  );
}
