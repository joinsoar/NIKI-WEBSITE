import { useEffect, useRef, useCallback } from 'react'
import './Gallery.css'

const IMAGE_IDS = [
  '1493246507139-91e8fad9978e',
  '1516035069371-29a1b244cc32',
  '1507643179173-39db30be83d3',
  '1519750783826-e2420f4d687f',
  '1494438639946-1ebd1d20bf85',
  '1500462918059-b1a0cb512f1d',
  '1486718448742-1643916ef44d',
  '1493514789931-5f7514745154',
  '1530099486328-e021101a494a',
  '1496747611176-843222e1e57c',
  '1491895200230-24e84424a737',
  '1520698115663-8a9d060f606e',
  '1449247709948-96350937c885',
  '1462331940187-285b04fb854f',
  '1464822759023-fed622ff2c3b',
]

const CARD_WIDTH = 220
const AUTO_SCROLL_SPEED = 0.5

export default function Gallery({ running }) {
  const viewportRef = useRef(null)
  const cardsRef = useRef([])
  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rafId: null,
  })

  const animate = useCallback(() => {
    const s = stateRef.current
    const cards = cardsRef.current

    if (!s.isDragging) {
      s.targetScroll += s.velocity
      s.velocity *= 0.95
      s.targetScroll += AUTO_SCROLL_SPEED
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.1

    const totalSetWidth = IMAGE_IDS.length * CARD_WIDTH

    cards.forEach((card, index) => {
      if (!card) return

      let virtualIndex = index * CARD_WIDTH - s.currentScroll

      while (virtualIndex < -totalSetWidth / 2) virtualIndex += totalSetWidth
      while (virtualIndex > totalSetWidth / 2) virtualIndex -= totalSetWidth

      if (Math.abs(virtualIndex) < window.innerWidth) {
        card.style.display = 'block'

        const progress = virtualIndex / (window.innerWidth / 1.5)
        const x = virtualIndex
        const z = -Math.pow(Math.abs(progress), 2) * 500
        const rotateY = progress * 45

        card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`
        card.style.opacity = 1 - Math.pow(Math.abs(progress), 3)
      } else {
        card.style.display = 'none'
      }
    })

    s.rafId = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!running) return

    const s = stateRef.current
    s.rafId = requestAnimationFrame(animate)

    return () => {
      if (s.rafId) cancelAnimationFrame(s.rafId)
    }
  }, [running, animate])

  // Mouse events
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const s = stateRef.current

    const onMouseDown = (e) => {
      s.isDragging = true
      s.lastX = e.clientX
      s.velocity = 0
      viewport.style.cursor = 'grabbing'
    }

    const onMouseUp = () => {
      s.isDragging = false
      viewport.style.cursor = 'grab'
    }

    const onMouseMove = (e) => {
      if (!s.isDragging) return
      const delta = e.clientX - s.lastX
      s.lastX = e.clientX
      s.targetScroll -= delta * 1.5
      s.velocity = -delta * 0.5
    }

    viewport.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      viewport.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  // Touch events
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const s = stateRef.current

    const onTouchStart = (e) => {
      s.isDragging = true
      s.lastX = e.touches[0].clientX
      s.velocity = 0
    }

    const onTouchEnd = () => {
      s.isDragging = false
    }

    const onTouchMove = (e) => {
      if (!s.isDragging) return
      const x = e.touches[0].clientX
      const delta = x - s.lastX
      s.lastX = x
      s.targetScroll -= delta * 1.5
      s.velocity = -delta * 0.5
    }

    viewport.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchmove', onTouchMove)

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="gallery-viewport" ref={viewportRef}>
      <div className="strip-container">
        {IMAGE_IDS.map((id, index) => (
          <div
            key={id}
            className="card"
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <img
              src={`https://images.unsplash.com/photo-${id}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`}
              alt={`Gallery image ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
