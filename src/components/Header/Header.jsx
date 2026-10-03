"use client";

import { FiMenu } from "react-icons/fi";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import "./Header.css";

export default function Header({ title, onMenu, onProfile, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-button" type="button" onClick={onMenu} aria-label="Open navigation"><FiMenu /></button>
        <div className="breadcrumb"><span>Workspace</span><i>/</i><strong>{title}</strong></div>
      </div>
      <ProfileMenu onProfile={onProfile} onLogout={onLogout} />
    </header>
  );
}
