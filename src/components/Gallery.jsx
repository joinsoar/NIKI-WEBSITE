import { useCallback, useEffect, useRef } from "react";
import "./Gallery.css";

const IMAGES = Array.from(
  { length: 47 },
  (_, i) => `/${String(i + 1).padStart(2, "0")}.png`
);

const MOBILE_BREAKPOINT = 600;
const CARD_WIDTH_DESKTOP = 220;
const CARD_WIDTH_MOBILE = 160;
const AUTO_SCROLL_SPEED = 0.5;

function getCardWidth() {
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? CARD_WIDTH_MOBILE
    : CARD_WIDTH_DESKTOP;
}

export default function Gallery({ running }) {
  const viewportRef = useRef(null);
  const cardsRef = useRef([]);
  const cardWidthRef = useRef(getCardWidth());
  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rafId: null,
  });

  const animate = useCallback(() => {
    const s = stateRef.current;
    const cards = cardsRef.current;

    if (!s.isDragging) {
      s.targetScroll += s.velocity;
      s.velocity *= 0.95;
      s.targetScroll += AUTO_SCROLL_SPEED;
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.1;

    const cardWidth = cardWidthRef.current;
    const totalSetWidth = IMAGES.length * cardWidth;

    cards.forEach((card, index) => {
      if (!card) return;

      let virtualIndex = index * cardWidth - s.currentScroll;

      while (virtualIndex < -totalSetWidth / 2) virtualIndex += totalSetWidth;
      while (virtualIndex > totalSetWidth / 2) virtualIndex -= totalSetWidth;

      if (Math.abs(virtualIndex) < window.innerWidth) {
        card.style.display = "block";

        const progress = virtualIndex / (window.innerWidth / 1.5);
        const x = virtualIndex;
        const z = -Math.pow(Math.abs(progress), 2) * 500;
        const rotateY = progress * 45;

        card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
        card.style.opacity = 1 - Math.pow(Math.abs(progress), 3);
      } else {
        card.style.display = "none";
      }
    });

    s.rafId = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!running) return;

    const s = stateRef.current;
    s.rafId = requestAnimationFrame(animate);

    return () => {
      if (s.rafId) cancelAnimationFrame(s.rafId);
    };
  }, [running, animate]);

  useEffect(() => {
    const onResize = () => {
      cardWidthRef.current = getCardWidth();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mouse events
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const s = stateRef.current;

    const onMouseDown = (e) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.velocity = 0;
      viewport.style.cursor = "grabbing";
    };

    const onMouseUp = () => {
      s.isDragging = false;
      viewport.style.cursor = "grab";
    };

    const onMouseMove = (e) => {
      if (!s.isDragging) return;
      const delta = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };

    viewport.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      viewport.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Touch events
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const s = stateRef.current;

    const onTouchStart = (e) => {
      s.isDragging = true;
      s.lastX = e.touches[0].clientX;
      s.velocity = 0;
    };

    const onTouchEnd = () => {
      s.isDragging = false;
    };

    const onTouchMove = (e) => {
      if (!s.isDragging) return;
      const x = e.touches[0].clientX;
      const delta = x - s.lastX;
      s.lastX = x;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };

    viewport.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="gallery-viewport" ref={viewportRef}>
      <div className="strip-container">
        {IMAGES.map((src, index) => (
          <div
            key={src}
            className="card"
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <img
              src={src}
              alt={`Gallery image ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
