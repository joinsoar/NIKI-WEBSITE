import { useState, useEffect } from 'react'
import './LoadingOverlay.css'

export default function LoadingOverlay({ onComplete }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onComplete) onComplete()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`overlay ${!visible ? 'overlay--hidden' : ''}`}>
      <div className="loader-text">INITIALIZING GALLERY...</div>
    </div>
  )
}
