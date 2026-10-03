export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export const monthKey = (year, month) =>
  `${year}-${String(month).padStart(2, "0")}`;

export const monthLabel = (key, short = false) => {
  if (!key) return "";
  const [year, month] = key.split("-").map(Number);
  return `${short ? monthNames[month - 1].slice(0, 3) : monthNames[month - 1]} ${year}`;
};

export const expenseMonth = (expense) => expense.date?.slice(0, 7);

export const getMonthSummary = (key, salaries, expenses) => {
  const [year, month] = key.split("-").map(Number);
  const salaryRecord = salaries
    .filter((item) => item.year < year || (item.year === year && item.month <= month))
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .at(-1);
  const salary = salaryRecord ? Number(salaryRecord.salary) : 0;
  const monthExpenses = expenses.filter((item) => expenseMonth(item) === key);
  const totalExpenses = monthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const savings = salary - totalExpenses;
  return {
    key,
    salary,
    salaryRecord,
    totalExpenses,
    savings,
    savingPercent: salary ? (savings / salary) * 100 : 0,
    expensePercent: salary ? (totalExpenses / salary) * 100 : 0,
    expenses: monthExpenses,
  };
};

export const sortedSalaries = (salaries) =>
  [...salaries].sort((a, b) => b.year - a.year || b.month - a.month);

export const getPreviousSalary = (record, salaries) =>
  [...salaries]
    .filter((item) => item.year < record.year || (item.year === record.year && item.month < record.month))
    .sort((a, b) => b.year - a.year || b.month - a.month)[0];

export const availableMonths = (salaries, expenses) => {
  const keys = [
    ...salaries.map((item) => monthKey(item.year, item.month)),
    ...expenses.map(expenseMonth),
  ].filter(Boolean).sort();
  if (!keys.length) return [];
  const [startYear, startMonth] = keys[0].split("-").map(Number);
  const [endYear, endMonth] = keys[keys.length - 1].split("-").map(Number);
  const months = [];
  for (let year = startYear, month = startMonth; year < endYear || (year === endYear && month <= endMonth); ) {
    months.push(monthKey(year, month));
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
  }
  return months.reverse();
};

export const makeId = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
