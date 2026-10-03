# Moneta — Personal Finance

A responsive personal-finance dashboard built with Next.js, JavaScript, React, React Icons, and CSS. Track month-by-month salary history, expenses, savings goals, and reports.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `npm run lint` and `npm run build` to validate the app.

## Features

- Month-specific salary records, with increment amounts and percentages calculated against the prior salary.
- Expense creation, editing, deletion, search, and category, month, and date filters.
- Salary-minus-expenses savings calculations, including cumulative savings through the selected month.
- Savings goals, category management, annual and monthly reporting, and CSV export.
- Responsive dashboard navigation, profile menu, and logout confirmation.

The app starts with sample salary and expense history. Changes are stored in this browser using local storage; no backend or authentication service is configured.

## Routes

- `/` — Dashboard
- `/expenses` — Expense management
- `/salary` — Salary history
- `/savings` — Savings and goals
- `/reports` — Monthly and annual reports
- `/categories` — Expense categories
- `/login` — Local demo workspace entry
