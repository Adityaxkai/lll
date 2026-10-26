import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { ProfileStorage } from "../services/profileStorage";
import { sounds } from "../audio/soundEffects";
import { 
  Heart, Sparkles, HelpCircle, AlertCircle, ArrowRight, CheckCircle2, Shield, User, Music, Volume2, Play, Disc
} from "lucide-react";

export default function SecurityGate({ onVerified, onOpenAdmin }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [food, setFood] = useState("");
  const [favoriteThing, setFavoriteThing] = useState("");

  const [errors, setErrors] = useState({});
  const [showHint, setShowHint] = useState({ dob: false, food: false, fav: false });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  // Step 1: Verification requires playing the video
  const [hasStartedVideo, setHasStartedVideo] = useState(false);

  const playerRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStartVideoVerification = () => {
    sounds.init();
    setHasStartedVideo(true);
    setIsPlayingAudio(true);

    if (playerRef.current) {
      try {
        playerRef.current.seekTo(6, true);
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
        playerRef.current.playVideo();
      } catch (e) {
        console.warn("Could not play video immediately:", e);
      }
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ff4081", "#ff80ab", "#ffd54f", "#e040fb"]
    });
  };

  // Initialize official YouTube Iframe Player
  useEffect(() => {
    let player = null;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      const targetEl = document.getElementById("login-yt-player");
      if (!targetEl) return;

      try {
        player = new window.YT.Player("login-yt-player", {
          videoId: "qoq8B8ThgEM",
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            start: 6,
            playsinline: 1,
            rel: 0,
            controls: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              playerRef.current = event.target;
              event.target.seekTo(6, true);
              try {
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
                setIsPlayingAudio(true);
              } catch (e) {
                // If browser restricts unmuted, start muted so video rolls immediately
                event.target.mute();
                event.target.playVideo();
                setIsPlayingAudio(false);
              }

              // Also retry unmuting after short delay
              setTimeout(() => {
                try {
                  event.target.unMute();
                  event.target.setVolume(100);
                  event.target.playVideo();
                } catch (e) {}
              }, 800);
            },
            onStateChange: (event) => {
              if (event.data === 1) { // 1 = YT.PlayerState.PLAYING
                try {
                  if (event.target.isMuted && !event.target.isMuted()) {
                    setIsPlayingAudio(true);
                  }
                } catch (e) {}
              }
            }
          }
        });
        playerRef.current = player;
      } catch (err) {
        console.warn("YouTube Player initialization warning:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevHandler) prevHandler();
        createPlayer();
      };
    }

    // Any touch, click, or key anywhere immediately guarantees sound plays
    const handleGesture = () => {
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
          setIsPlayingAudio(true);
        } catch (e) {}
      }
    };

    window.addEventListener("click", handleGesture, { passive: true });
    window.addEventListener("touchstart", handleGesture, { passive: true });
    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("keydown", handleGesture, { passive: true });

    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch (e) {}
      }
    };
  }, []);

  // Dynamic persona detection
  const detectedKey = name.toLowerCase().trim().includes("anayka") ? "anayka" : "anubha";
  const currentProfile = ProfileStorage.getProfile(detectedKey);

  // Verification Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    sounds.init();
    const newErrors = {};

    // 0. Name check
    const cleanName = name.trim().toLowerCase();
    if (!cleanName) {
      newErrors.name = "Please enter your name to begin (Anubha or Anayka) 🌸";
    } else if (!cleanName.includes("anubha") && !cleanName.includes("anayka")) {
      newErrors.name = "Aditya's heart only knows two special names: Anubha or Anayka 💕";
    }

    // 1. DOB check (Aditya's birthday: 15 12 2002)
    const cleanDob = dob.trim().toLowerCase();
    const dobMatch = currentProfile.dobAnswers.some(ans => 
      cleanDob.includes(ans.toLowerCase()) || ans.toLowerCase().includes(cleanDob)
    );
    if (!cleanDob) {
      newErrors.dob = "Please enter Aditya's birthdate 🎂";
    } else if (!dobMatch) {
      newErrors.dob = `Think carefully ${currentProfile.name}! When does your boy celebrate his birthday? ✨`;
    }

    // 2. Non-Veg food check (Fish)
    const cleanFood = food.trim().toLowerCase();
    const foodMatch = currentProfile.foodAnswers.some(ans =>
      cleanFood.includes(ans.toLowerCase()) || ans.toLowerCase().includes(cleanFood)
    );
    if (!cleanFood) {
      newErrors.food = "Please tell us your favorite non-veg dish 🍽️";
    } else if (!foodMatch) {
      newErrors.food = "Aditya's foodie detector says: Think of your ultimate seafood craving! 😋";
    }

    // 3. Favorite thing check
    const cleanFav = favoriteThing.trim().toLowerCase();
    const favMatch = currentProfile.favoriteThingKeywords.some(keyword =>
      cleanFav.includes(keyword.toLowerCase())
    );
    if (!cleanFav) {
      newErrors.fav = "What does Aditya love most about you? 💕";
    } else if (!favMatch) {
      newErrors.fav = `Think deeply ${currentProfile.name}! What makes Aditya stare at you with pure love? 🥰`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success!
    setErrors({});
    setIsVerifying(true);
    setVerifiedProfile(currentProfile);
    sounds.playUnlock();

    // Stop YouTube audio and video immediately upon verification
    if (playerRef.current && playerRef.current.stopVideo) {
      try {
        playerRef.current.stopVideo();
      } catch (e) {}
    }

    // Save her written responses for Aditya's Admin Panel
    ProfileStorage.saveGateEntry({
      name: currentProfile.name,
      dob: cleanDob,
      food: cleanFood,
      favoriteThing: cleanFav
    });

    // Launch romantic confetti
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ["#ff4081", "#ff79b0", "#ffd54f", "#e040fb", "#ffffff"]
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
      onVerified(currentProfile);
    }, 2200);
  };

  return (
    <div className="security-screen">
      {/* Floating background lights */}
      <div className="floating-glow glow-1"></div>
      <div className="floating-glow glow-2"></div>
      <div className="floating-glow glow-3"></div>

      <div className="security-container">
        {/* Top Control Bar with Admin button */}
        <div className="security-top-meta">
          <div className="security-badge">
            <Heart className="badge-icon pulse-heart" size={16} />
            <span>Aditya's Enchanted Garden</span>
          </div>

          <button 
            type="button" 
            className="admin-access-btn"
            onClick={onOpenAdmin}
            title="Aditya's Admin Control Panel (PIN: 1512)"
          >
            <Shield size={14} /> Admin
          </button>
        </div>

        <h1 className="security-title">
          Aditya’s Heart Garden
        </h1>
        <p className="security-subtitle">
          Identity Verification Required: Enter your name to enter your tailored 3D paradise.
        </p>

        {verifiedProfile ? (
          <div className="verification-success-card">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} className="text-pink-400 animate-bounce" />
            </div>
            <h2>Identity Verified! 👑</h2>
            <p>Welcome to Your Garden, <strong>{verifiedProfile.name}</strong>.</p>
            <p className="subtext">{verifiedProfile.tagline}</p>
            <div className="loading-bar">
              <div className="loading-fill"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Login Screen Romantic Video (pre-mounted and revealed on Step 1) */}
            <div 
              className="login-video-card"
              style={{ display: hasStartedVideo ? "block" : "none" }}
            >
              <div className="login-video-header">
                <div className="login-song-title">
                  <Music size={15} className="text-pink-400" />
                  <span>Step 1 Verified • Tujh Mein Rab Dikhta Hai</span>
                </div>
                <button
                  type="button"
                  className={`song-audio-toggle ${isPlayingAudio ? "active" : "pulse-attention"}`}
                  onClick={() => {
                    if (playerRef.current) {
                      try {
                        playerRef.current.unMute();
                        playerRef.current.setVolume(100);
                        playerRef.current.playVideo();
                        setIsPlayingAudio(true);
                      } catch (e) {}
                    }
                  }}
                  title="Play audio with sound"
                >
                  <Volume2 size={13} /> {isPlayingAudio ? "Playing Audio 🎵" : "Tap for Sound 🔊"}
                </button>
              </div>
              <div className="login-video-frame">
                <div id="login-yt-player"></div>
              </div>
            </div>

            {/* VERY FIRST VERIFICATION: PLAY THE VIDEO */}
            {!hasStartedVideo ? (
              <div className="video-verification-prompt-card">
                <div className="prompt-badge">
                  <Music size={15} className="text-pink-400" />
                  <span>Verification Step 1 • Required</span>
                </div>

                <div className="prompt-disc-animation">
                  <div className="disc-spin-wrap">
                    <Disc size={64} className="text-pink-400 rotating-vinyl" />
                    <Heart size={20} className="disc-heart-center pulse-heart" />
                  </div>
                </div>

                <h2>Step 1: Play Aditya's Love Song</h2>
                <p>
                  Your very first verification is to listen to our melody. Press play below to start the song and unlock your garden questions! 🎶
                </p>

                <button
                  type="button"
                  className="start-verification-play-btn"
                  onClick={handleStartVideoVerification}
                >
                  <Play size={18} className="fill-white" />
                  <span>Play Our Song to Begin (Starts at 0:06) 💕</span>
                </button>
              </div>
            ) : (
              <>
                <div className="step2-badge-banner">
                  <span>🌸 Step 2: Answer Verification Questions</span>
                </div>

                <form onSubmit={handleSubmit} className="security-form">
            {/* Field 0: Name */}
            <div className="form-group">
              <div className="label-row">
                <label>
                  <span>🌸 Who is entering Aditya's Heart? (Your Name)</span>
                </label>
              </div>
              <div className="input-with-icon">
                <User size={16} className="input-prefix-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "input-error" : ""}
                />
              </div>
              {errors.name && (
                <div className="error-text">
                  <AlertCircle size={14} /> {errors.name}
                </div>
              )}
            </div>

            {/* Field 1: DOB */}
            <div className="form-group">
              <div className="label-row">
                <label>
                  <span>1. Confirm Aditya's Date of Birth</span>
                </label>
                <button
                  type="button"
                  className="hint-btn"
                  onClick={() => setShowHint(h => ({ ...h, dob: !h.dob }))}
                >
                  <HelpCircle size={14} /> Hint
                </button>
              </div>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={errors.dob ? "input-error" : ""}
              />
              {showHint.dob && (
                <div className="hint-box">
                  <Sparkles size={14} /> A chilly winter month, mid-December 2002... a boy was born just to love you! 🎂
                </div>
              )}
              {errors.dob && (
                <div className="error-text">
                  <AlertCircle size={14} /> {errors.dob}
                </div>
              )}
            </div>

            {/* Field 2: Non-Veg Food */}
            <div className="form-group">
              <div className="label-row">
                <label>
                  <span>2. What is your favorite Non-Veg food?</span>
                </label>
                <button
                  type="button"
                  className="hint-btn"
                  onClick={() => setShowHint(h => ({ ...h, food: !h.food }))}
                >
                  <HelpCircle size={14} /> Hint
                </button>
              </div>
              <input
                type="text"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                className={errors.food ? "input-error" : ""}
              />
              {showHint.food && (
                <div className="hint-box">
                  <Sparkles size={14} /> It swims in the water, tastes heavenly when fried, and makes your tummy the happiest! 🌊🍽️
                </div>
              )}
              {errors.food && (
                <div className="error-text">
                  <AlertCircle size={14} /> {errors.food}
                </div>
              )}
            </div>

            {/* Field 3: Favorite Thing */}
            <div className="form-group">
              <div className="label-row">
                <label>
                  <span>3. What does Aditya admire most about you?</span>
                </label>
                <button
                  type="button"
                  className="hint-btn"
                  onClick={() => setShowHint(h => ({ ...h, fav: !h.fav }))}
                >
                  <HelpCircle size={14} /> Hint
                </button>
              </div>
              <input
                type="text"
                value={favoriteThing}
                onChange={(e) => setFavoriteThing(e.target.value)}
                className={errors.fav ? "input-error" : ""}
              />
              {showHint.fav && (
                <div className="hint-box">
                  <Sparkles size={14} /> Think of what lights up your face whenever you see Aditya, or your cute expression! (Or is it simply... everything?) 💕
                </div>
              )}
              {errors.fav && (
                <div className="error-text">
                  <AlertCircle size={14} /> {errors.fav}
                </div>
              )}
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="unlock-btn"
            >
              <span>Enter My Enchanted Garden</span>
              <ArrowRight size={18} />
            </button>
                </form>
              </>
            )}
          </>
        )}

        {/* Footer shortcuts */}
        <div className="security-footer">
          <span>Protected with infinite affection • Made by Aditya</span>
        </div>
      </div>
    </div>
  );
}
