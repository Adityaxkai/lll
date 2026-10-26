import React, { useState, useRef } from "react";
import { Sparkles, Compass } from "lucide-react";

export default function VirtualJoystick({ onMove, onInteract, canInteract, currentSurpriseLabel }) {
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    setActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.min(Math.hypot(dx, dy), 45);
    const angle = Math.atan2(dy, dx);

    const normX = Math.cos(angle) * (distance / 45);
    const normY = Math.sin(angle) * (distance / 45);

    setTouchPos({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });

    onMove({ x: normX, y: normY });
  };

  const handleTouchEnd = () => {
    setActive(false);
    setTouchPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  return (
    <div className="mobile-controls-layer">
      {/* Joystick base on left */}
      <div 
        ref={containerRef}
        className={`joystick-base ${active ? 'active' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="joystick-knob"
          style={{ transform: `translate(${touchPos.x}px, ${touchPos.y}px)` }}
        >
          <Compass size={18} className="knob-icon" />
        </div>
      </div>

      {/* Action / Interact Button on right */}
      <div className="action-button-wrapper">
        <button
          className={`interact-action-btn ${canInteract ? 'pulse-glow' : 'disabled'}`}
          onClick={onInteract}
          disabled={!canInteract}
        >
          <Sparkles size={24} />
          <span>{canInteract ? currentSurpriseLabel || "Open" : "Walk Near"}</span>
        </button>
      </div>
    </div>
  );
}
