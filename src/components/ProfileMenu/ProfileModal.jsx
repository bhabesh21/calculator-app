import { FiUser } from "react-icons/fi";
import { Button } from "../Common/Primitives";
import "./ProfileModal.css";

export default function ProfileModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <span className="profile-modal-icon"><FiUser /></span>
        <h2 id="profile-title">Profile</h2>
        <strong>Personal account</strong>
        <p>Your finance workspace is saved locally in this browser.</p>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </section>
    </div>
  );
}
