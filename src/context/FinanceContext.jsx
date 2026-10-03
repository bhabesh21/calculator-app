"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultCategories, initialExpenses, initialSalaries } from "../data/initialData";
import { availableMonths, getMonthSummary } from "../utils/finance";

const STORAGE_KEY = "moneta-finance-v1";
const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [salaries, setSalaries] = useState(initialSalaries);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [categories, setCategories] = useState(defaultCategories);
  const [goal, setGoal] = useState(500000);
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (Array.isArray(data.salaries)) setSalaries(data.salaries);
          if (Array.isArray(data.expenses)) setExpenses(data.expenses);
          if (Array.isArray(data.categories)) setCategories(data.categories);
          if (Number.isFinite(data.goal)) setGoal(data.goal);
          if (typeof data.selectedMonth === "string") setSelectedMonth(data.selectedMonth);
        }
      } catch (error) {
        console.error("Unable to load saved finance data.", error);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ salaries, expenses, categories, goal, selectedMonth }),
      );
    } catch (error) {
      console.error("Unable to save finance data.", error);
    }
  }, [salaries, expenses, categories, goal, selectedMonth, ready]);

  const months = useMemo(() => availableMonths(salaries, expenses), [salaries, expenses]);
  const summary = useMemo(
    () => getMonthSummary(selectedMonth, salaries, expenses),
    [selectedMonth, salaries, expenses],
  );
  const totalSavings = useMemo(
    () =>
      months
        .filter((key) => key <= selectedMonth)
        .reduce((total, key) => total + getMonthSummary(key, salaries, expenses).savings, 0),
    [months, selectedMonth, salaries, expenses],
  );
  const notify = (message) => setToast(message);

  const value = {
    salaries,
    setSalaries,
    expenses,
    setExpenses,
    categories,
    setCategories,
    goal,
    setGoal,
    selectedMonth,
    setSelectedMonth,
    months,
    summary,
    totalSavings,
    ready,
    toast,
    setToast,
    notify,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within a FinanceProvider.");
  return context;
}
