"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import ProfileModal from "../components/ProfileMenu/ProfileModal";
import { FinanceProvider, useFinance } from "../context/FinanceContext";
import "./DashboardLayout.css";

const pageTitles = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/salary": "Salary",
  "/savings": "Savings",
  "/reports": "Reports",
  "/categories": "Categories",
};

function DashboardFrame({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { toast, setToast } = useFinance();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast, setToast]);

  const confirmLogout = () => {
    window.localStorage.removeItem("moneta-auth");
    window.sessionStorage.removeItem("moneta-auth");
    window.sessionStorage.removeItem("moneta-session");
    setLogoutOpen(false);
    router.push("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <div className="main-column">
        <Header title={pageTitles[pathname] || "Workspace"} onMenu={() => setMenuOpen(!menuOpen)} onProfile={() => setProfileOpen(true)} onLogout={() => setLogoutOpen(true)} />
        <main className="main-content">{children}</main>
      </div>
      <LogoutModal open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={confirmLogout} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      {toast && <div className="toast" role="status"><FiCheck />{toast}</div>}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <FinanceProvider><DashboardFrame>{children}</DashboardFrame></FinanceProvider>;
}
