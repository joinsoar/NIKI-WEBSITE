import { useState } from 'react'
import './WaitlistForm.css'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('You have been added to the queue.')
    setEmail('')
  }

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
  )
}
