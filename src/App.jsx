import React, { useState, useCallback } from "react";
import SecurityGate from "./components/SecurityGate";
import ThreeCanvas from "./components/ThreeCanvas";
import HUD from "./components/HUD";
import VirtualJoystick from "./components/VirtualJoystick";
import SurpriseModal from "./components/SurpriseModal";
import AdminPanel from "./components/AdminPanel";
import { ProfileStorage } from "./services/profileStorage";
import { sounds } from "./audio/soundEffects";
import "./App.css";

export default function App() {
  const [activeProfile, setActiveProfile] = useState(() => ProfileStorage.getProfile("anubha"));
  const [isVerified, setIsVerified] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [currentGardenArea, setCurrentGardenArea] = useState("entrance");
  const [visitedRoutes, setVisitedRoutes] = useState({
    left_photos: false,
    right_song: false,
    fountain: false,
    center_gift: false
  });

  const [nearbySurprise, setNearbySurprise] = useState(null);
  const [activeSurpriseModal, setActiveSurpriseModal] = useState(null);
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [isMusicMuted, setIsMusicMuted] = useState(true); // Default muted as requested!

  // Called when girl is verified in SecurityGate
  const handleVerified = (profile) => {
    setActiveProfile(profile);
    setIsVerified(true);
  };

  // Called from Admin panel to launch preview as Anubha or Anayka immediately
  const handleLaunchPreview = (personaKey) => {
    const profile = ProfileStorage.getProfile(personaKey);
    setActiveProfile(profile);
    setIsVerified(true);
    setIsAdminOpen(false);
  };

  // Proximity callback from 3D Garden
  const handleProximityChange = useCallback((nearestStation, charPos) => {
    setNearbySurprise(nearestStation);

    // Determine current garden area
    if (charPos.z <= -12) {
      setCurrentGardenArea("center");
    } else if (charPos.x <= -6) {
      setCurrentGardenArea("left");
    } else if (charPos.x >= 6 && charPos.z <= 2) {
      setCurrentGardenArea("right");
    } else if (charPos.x >= 5 && charPos.z > 2) {
      setCurrentGardenArea("fountain");
    } else {
      setCurrentGardenArea("entrance");
    }
  }, []);

  // Trigger interaction
  const handleTriggerInteract = useCallback(() => {
    if (nearbySurprise) {
      sounds.playChime();
      setActiveSurpriseModal(nearbySurprise.type);
      setVisitedRoutes(prev => ({ ...prev, [nearbySurprise.id]: true }));
    }
  }, [nearbySurprise]);

  const handleCloseModal = () => {
    setActiveSurpriseModal(null);
  };

  const handleToggleMusic = () => {
    const isNowPlaying = sounds.toggleMusic();
    setIsMusicMuted(!isNowPlaying);
  };

  return (
    <div className="app-viewport">
      {/* 1. Gatekeeper Verification Screen */}
      {!isVerified ? (
        <SecurityGate 
          onVerified={handleVerified} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      ) : (
        <div className="world-container">
          {/* 2. Top HUD Header & Indicators */}
          <HUD
            profile={activeProfile}
            currentGardenArea={currentGardenArea}
            visitedRoutes={visitedRoutes}
            isMusicMuted={isMusicMuted}
            onToggleMusic={handleToggleMusic}
            nearbySurprise={nearbySurprise}
            onInteract={handleTriggerInteract}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* 3. The 3D Enchanted Garden Canvas */}
          <ThreeCanvas
            onProximityChange={handleProximityChange}
            joystickInput={joystickInput}
            onTriggerInteract={handleTriggerInteract}
          />

          {/* 4. Mobile Joystick & Action Button */}
          <VirtualJoystick
            onMove={(input) => setJoystickInput(input)}
            onInteract={handleTriggerInteract}
            canInteract={Boolean(nearbySurprise)}
            currentSurpriseLabel={nearbySurprise?.label}
          />

          {/* 5. Surprise Modals for each of the 3 routes */}
          {activeSurpriseModal && (
            <SurpriseModal
              surpriseType={activeSurpriseModal}
              profile={activeProfile}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}

      {/* 6. Aditya's Admin Panel (PIN: 1512) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
