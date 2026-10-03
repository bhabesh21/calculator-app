"use client";

import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import "./ProfileMenu.css";

export default function ProfileMenu({ onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);
  return (
    <div className="profile-menu" ref={ref}>
      <button className="profile-trigger" type="button" onClick={() => setOpen(!open)} aria-label="Open profile menu" aria-expanded={open}>
        <FiUser />
      </button>
      {open && (
        <div className="profile-dropdown">
          <button type="button" onClick={() => { setOpen(false); onProfile(); }}><FiUser />Profile</button>
          <button type="button" onClick={() => { setOpen(false); onLogout(); }}><FiLogOut />Logout</button>
        </div>
      )}
    </div>
  );
}
