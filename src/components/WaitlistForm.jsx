import { useState } from "react";
import "./WaitlistForm.css";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO(backend): Replace this client-only placeholder with a POST request to the existing backend waitlist endpoint.
    // TODO(backend): Read API base URL from environment variables (e.g. import.meta.env.VITE_API_URL) instead of hardcoding.
    // TODO(backend): Send payload shape expected by backend (likely { email }) and handle non-2xx responses.
    // TODO(backend): Add submission states (isSubmitting/success/error) and replace alert with inline UI feedback.
    // TODO(backend): Keep setEmail('') only after confirmed backend success.
    alert("You have been added to the queue.");
    setEmail("");
  };

  return (
    <div className="waitlist-container">
      <span className="waitlist-label">Request Access</span>
      <form className="input-group" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="submit-btn">
          Join
        </button>
      </form>
    </div>
  );
}
