import { FiLogOut } from "react-icons/fi";
import "./LogoutModal.css";

export default function LogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div className="confirm-icon"><FiLogOut /></div>
        <h2 id="logout-title">Log out of Moneta?</h2>
        <p>Are you sure you want to logout?</p>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="button button-danger" onClick={onConfirm}>Logout</button>
        </div>
      </section>
    </div>
  );
}
