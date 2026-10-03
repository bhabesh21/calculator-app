"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2, FiGrid, FiHome, FiLayers, FiPieChart, FiTrendingUp,
} from "react-icons/fi";
import "./Sidebar.css";

const navigation = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/expenses", label: "Expenses", icon: FiGrid },
  { href: "/salary", label: "Salary", icon: FiTrendingUp },
  { href: "/savings", label: "Savings", icon: FiPieChart },
  { href: "/reports", label: "Reports", icon: FiBarChart2 },
  { href: "/categories", label: "Categories", icon: FiLayers },
];

export default function Sidebar({ open, onNavigate }) {
  const pathname = usePathname();
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <Link className="brand" href="/" onClick={onNavigate}>
        <span className="brand-mark">m</span>
        <span className="brand-name">moneta<span>.</span></span>
      </Link>
      <div className="sidebar-label">MENU</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              className={`nav-link ${active ? "nav-link-active" : ""}`}
              href={href}
              key={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {active && <span className="nav-active-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-mini-card">
          <span className="mini-card-icon"><FiTrendingUp /></span>
          <div><strong>Money, mindful.</strong><span>One step at a time.</span></div>
        </div>
        <span className="sidebar-version">PERSONAL FINANCE · 2026</span>
      </div>
    </aside>
  );
}
