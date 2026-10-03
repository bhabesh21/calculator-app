"use client";

import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import "../../src/views/Login/Login.css";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="login-page">
      <section className="login-card">
        <span className="login-brand-mark">m</span>
        <span className="login-brand-name">moneta<span>.</span></span>
        <div className="login-eyebrow">PERSONAL FINANCE</div>
        <h1>Your money,<br />in a better place.</h1>
        <p>This personal workspace is ready whenever you are. Your finance data stays saved in this browser.</p>
        <button className="login-action" onClick={() => router.push("/")} type="button">Continue to dashboard <FiArrowRight /></button>
        <small>PRIVATE BY DESIGN · STORED LOCALLY</small>
      </section>
      <div className="login-decoration" aria-hidden="true"><span /><span /><span /></div>
    </main>
  );
}
