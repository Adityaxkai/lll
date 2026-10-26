import React from "react";
import { Volume2, VolumeX, Heart, MapPin, Sparkles, Shield } from "lucide-react";

export default function HUD({ 
  profile,
  currentGardenArea, 
  visitedRoutes, 
  isMusicMuted, 
  onToggleMusic,
  nearbySurprise,
  onInteract,
  onOpenAdmin
}) {
  const progressCount = Object.values(visitedRoutes).filter(Boolean).length;

  // Garden Location Labels
  const getAreaName = () => {
    switch (currentGardenArea) {
      case "left":
        return { name: "The Blossom Grove", sub: "Photos & Pretty Quotes" };
      case "right":
        return { name: "The Melody Gazebo", sub: "Her Dedicated Song" };
      case "fountain":
        return { name: "The Whispering Fountain", sub: "What She Loves Most in Aditya" };
      case "center":
        return { name: "The Starlight Pavilion", sub: "The Grand Main Gift" };
      default:
        return { name: "Enchanted Garden Entrance", sub: "Choose Your Path: Left, Right, Fountain or Straight" };
    }
  };

  const area = getAreaName();

  return (
    <div className="hud-overlay">
      {/* Top Header Bar */}
      <header className="hud-top-bar">
        <div className="hud-brand">
          <div className="heart-pulse-box">
            <Heart size={20} className="fill-pink-500 text-pink-500" />
          </div>
          <div>
            <h1 className="brand-title">Aditya’s Heart Garden</h1>
            <span className="brand-partner">For {profile?.name || "My Love"} 🌸</span>
          </div>
        </div>

        {/* Current Garden Location */}
        <div className="hud-room-indicator">
          <MapPin size={16} className="text-pink-400" />
          <div>
            <div className="hud-room-name">{area.name}</div>
            <div className="hud-room-sub">{area.sub}</div>
          </div>
        </div>

        {/* Right tools: Progress, Sound & Admin */}
        <div className="hud-tools">
          <div className="hud-counter">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Discoveries: {progressCount}/4</span>
          </div>

          <button 
            className="sound-toggle-btn"
            onClick={onToggleMusic}
            aria-label="Toggle background music"
            title={isMusicMuted ? "Play Music" : "Mute Music"}
          >
            {isMusicMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-pink-400" />}
          </button>

          <button
            className="admin-hud-btn"
            onClick={onOpenAdmin}
            title="Open Admin Panel"
          >
            <Shield size={16} />
          </button>
        </div>
      </header>

      {/* Interactive prompt banner when near a surprise station */}
      {nearbySurprise && (
        <div className="nearby-prompt-banner animate-slide-up">
          <div className="prompt-content">
            <Sparkles size={20} className="text-pink-400 animate-spin-slow" />
            <span>You found: <strong>{nearbySurprise.label}</strong>!</span>
          </div>
          <button className="prompt-interact-btn" onClick={onInteract}>
            Open Surprise (Press [E])
          </button>
        </div>
      )}

      {/* Desktop Controls Bar at bottom */}
      <div className="desktop-controls-hint">
        <span>⬅️ <strong>Left Path</strong>: Photos & Quotes</span>
        <span>➡️ <strong>Right Path</strong>: Your Dedicated Song</span>
        <span>⬆️ <strong>Center Path</strong>: The Grand Gift</span>
        <span>✨ Walk: <strong>W, A, S, D</strong> • Interact: <strong>[E] / Space</strong></span>
      </div>
    </div>
  );
}
