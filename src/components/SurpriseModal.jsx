import React, { useState } from "react";
import confetti from "canvas-confetti";
import { sounds } from "../audio/soundEffects";
import { 
  X, Heart, Sparkles, Play, Pause, 
  ChevronRight, ChevronLeft, Volume2, Disc, Flower2, Quote, Maximize2, Send, Waves
} from "lucide-react";

import { ProfileStorage } from "../services/profileStorage";

// Helper to extract YouTube video ID and timestamp (e.g. t=63)
function parseYouTubeUrl(url) {
  if (!url) return null;
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (!idMatch) return null;

  let startSec = 0;
  const tMatch = url.match(/[?&](?:t|start)=([0-9mhys]+)/);
  if (tMatch) {
    const val = tMatch[1];
    if (/^\d+$/.test(val)) {
      startSec = parseInt(val, 10);
    } else {
      const mins = val.match(/(\d+)m/);
      const secs = val.match(/(\d+)s/);
      startSec = (mins ? parseInt(mins[1], 10) * 60 : 0) + (secs ? parseInt(secs[1], 10) : 0);
    }
  }

  return {
    id: idMatch[1],
    start: startSec > 0 ? startSec : null
  };
}

export default function SurpriseModal({ surpriseType, profile, onClose }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);
  const [activeReasonIdx, setActiveReasonIdx] = useState(0);
  const [groveTab, setGroveTab] = useState("photos"); // "photos" or "quotes"
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [hasAcceptedProposal, setHasAcceptedProposal] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Whisper box state
  const [whisperMsg, setWhisperMsg] = useState("");
  const [whisperSent, setWhisperSent] = useState(false);

  // Confetti helper
  const fireLoveConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff4081", "#ff80ab", "#ffd54f", "#e040fb", "#ffffff"]
    });
  };

  const handleToggleSong = () => {
    if (isPlayingSong) {
      sounds.stopBackgroundMusic();
      setIsPlayingSong(false);
    } else {
      sounds.startBackgroundMusic();
      sounds.playChime();
      setIsPlayingSong(true);
    }
  };

  const handleAcceptProposal = () => {
    sounds.playCelebration();
    setHasAcceptedProposal(true);
    ProfileStorage.saveWhisper(profile?.name, "💍 Accepted Aditya's Proposal Promise with 'YES, A MILLION TIMES YES!' 💖", "proposal");
    fireLoveConfetti();
    setTimeout(fireLoveConfetti, 400);
    setTimeout(fireLoveConfetti, 800);
  };

  const handleSendWhisper = (e) => {
    e.preventDefault();
    if (!whisperMsg.trim()) return;
    ProfileStorage.saveWhisper(profile?.name, whisperMsg, "fountain");
    sounds.playChime();
    setWhisperSent(true);
    fireLoveConfetti();
  };

  const photos = profile?.leftRoute?.photos || [];
  const activePhoto = photos[activePhotoIdx] || {};
  const prettyQuotes = profile?.leftRoute?.prettyQuotes || [];
  const fountainReasons = profile?.fountainRoute?.reasons || [];
  const activeReason = fountainReasons[activeReasonIdx] || {};

  const ytInfo = parseYouTubeUrl(profile?.rightRoute?.youtubeUrl);

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-card">
          {/* Close Button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>

          {/* =========================================================================
              ⬅️ LEFT ROUTE: BLOSSOM GROVE OF PHOTOS & PRETTY QUOTES
             ========================================================================= */}
          {surpriseType === "photos" && (
            <div className="surprise-content memories-view">
              <div className="surprise-header">
                <span className="room-tag">⬅️ Left Route • Blossom Grove</span>
                <h2>Moments & Quotes For {profile.name}</h2>
                <span className="memory-date">Aditya's Cherished Collection 🌸</span>
              </div>

              {/* Toggle between Photos & Aditya's Quotes */}
              <div className="grove-tab-bar">
                <button
                  className={`grove-tab-btn ${groveTab === "photos" ? "active" : ""}`}
                  onClick={() => setGroveTab("photos")}
                >
                  <Flower2 size={15} /> Real Photos ({photos.length})
                </button>
                {prettyQuotes.length > 0 && (
                  <button
                    className={`grove-tab-btn ${groveTab === "quotes" ? "active" : ""}`}
                    onClick={() => setGroveTab("quotes")}
                  >
                    <Quote size={15} /> Aditya's Love Quotes ({prettyQuotes.length})
                  </button>
                )}
              </div>

              {/* TAB 1: Real Photos (Uncropped & Full Size) */}
              {groveTab === "photos" && (
                <>
                  <div className="polaroid-wrapper">
                    <div className="polaroid-frame fullsize-polaroid">
                      <div 
                        className="polaroid-art-fullsize"
                        onClick={() => activePhoto.imageUrl && setLightboxImg(activePhoto.imageUrl)}
                      >
                        {activePhoto.imageUrl ? (
                          <div className="photo-container-rel">
                            <img 
                              src={activePhoto.imageUrl} 
                              alt={activePhoto.title} 
                              className="uploaded-polaroid-img-contain"
                            />
                            <div className="tap-to-expand-badge">
                              <Maximize2 size={13} /> Tap for Fullscreen
                            </div>
                          </div>
                        ) : (
                          <div className="empty-photo-placeholder">
                            <Heart size={56} className="fill-pink-500 text-pink-500 animate-pulse" />
                            <div className="polaroid-quote">
                              "{activePhoto.quote}"
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="polaroid-caption">
                        <div className="polaroid-top-meta">
                          <h4>{activePhoto.title}</h4>
                          <span className="photo-tag-date">{activePhoto.date}</span>
                        </div>
                        <p className="photo-quote-text">"{activePhoto.quote}"</p>
                        <p className="photo-story-text">{activePhoto.caption}</p>
                        <span className="badge-chip">
                          <Flower2 size={13} /> For {profile.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation between photos */}
                  <div className="memory-nav">
                    <button 
                      className="nav-btn"
                      onClick={() => setActivePhotoIdx(idx => (idx > 0 ? idx - 1 : photos.length - 1))}
                    >
                      <ChevronLeft size={18} /> Previous
                    </button>
                    <span className="nav-counter">
                      Photo {activePhotoIdx + 1} of {photos.length}
                    </span>
                    <button 
                      className="nav-btn"
                      onClick={() => setActivePhotoIdx(idx => (idx + 1) % photos.length)}
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* TAB 2: Pretty Quotes */}
              {groveTab === "quotes" && (
                <div className="pretty-quotes-chamber">
                  <div className="quote-display-card">
                    <Quote size={32} className="quote-big-icon" />
                    <blockquote className="quote-body-text">
                      "{prettyQuotes[activeQuoteIdx]?.quote}"
                    </blockquote>
                    <span className="quote-author-tag">
                      {prettyQuotes[activeQuoteIdx]?.from}
                    </span>
                  </div>

                  <div className="memory-nav">
                    <button 
                      className="nav-btn"
                      onClick={() => setActiveQuoteIdx(idx => (idx > 0 ? idx - 1 : prettyQuotes.length - 1))}
                    >
                      <ChevronLeft size={18} /> Previous Quote
                    </button>
                    <span className="nav-counter">
                      Quote {activeQuoteIdx + 1} of {prettyQuotes.length}
                    </span>
                    <button 
                      className="nav-btn"
                      onClick={() => setActiveQuoteIdx(idx => (idx + 1) % prettyQuotes.length)}
                    >
                      Next Quote <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              ➡️ RIGHT ROUTE: MELODY GAZEBO (DEDICATED SONG FOR MY GIRLFRIEND)
             ========================================================================= */}
          {surpriseType === "song" && (
            <div className="surprise-content song-view">
              <div className="surprise-header">
                <span className="room-tag">➡️ Right Route • Melody Gazebo</span>
                <h2>A Song Dedicated To {profile.name}</h2>
                <p className="chef-subtitle">Played straight from Aditya's heart</p>
              </div>

              {/* If YouTube video ID is present, embed YouTube player */}
              {ytInfo ? (
                <div className="youtube-player-wrapper">
                  <iframe
                    width="100%"
                    height="270"
                    src={`https://www.youtube.com/embed/${ytInfo.id}?autoplay=1&rel=0${ytInfo.start ? `&start=${ytInfo.start}` : ""}`}
                    title="Dedicated Song for My Girlfriend"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="youtube-iframe"
                  ></iframe>
                </div>
              ) : (
                /* Vinyl Record & Synthesizer Player */
                <div className="music-player-card">
                  <div className={`vinyl-record ${isPlayingSong ? "spinning" : ""}`}>
                    <Disc size={90} className="vinyl-disc-icon" />
                    <div className="vinyl-center-art">
                      <Heart size={20} className="fill-pink-500 text-pink-500" />
                    </div>
                  </div>

                  <div className="track-details">
                    <span className="track-tag">Special Track for {profile.name}</span>
                    <h3 className="track-title">{profile.rightRoute?.songTitle || "Our Special Song"}</h3>
                    <span className="track-artist">{profile.rightRoute?.artist || "Dedicated by Aditya"}</span>

                    {/* Equalizer animation */}
                    <div className="equalizer-bars">
                      <span className={`bar ${isPlayingSong ? "animating" : ""}`}></span>
                      <span className={`bar ${isPlayingSong ? "animating" : ""}`}></span>
                      <span className={`bar ${isPlayingSong ? "animating" : ""}`}></span>
                      <span className={`bar ${isPlayingSong ? "animating" : ""}`}></span>
                      <span className={`bar ${isPlayingSong ? "animating" : ""}`}></span>
                    </div>
                  </div>

                  <button className="play-pause-btn" onClick={handleToggleSong}>
                    {isPlayingSong ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                </div>
              )}

              {/* Lyrics Excerpt */}
              {profile.rightRoute?.lyricsExcerpt && (
                <div className="lyrics-box">
                  <span className="lyrics-tag">Favorite Lyrics:</span>
                  <p>"{profile.rightRoute?.lyricsExcerpt}"</p>
                </div>
              )}

              {/* Aditya's Personal Song Dedication Note */}
              <div className="dedication-letter-box">
                <div className="dedication-header">
                  <Volume2 size={18} className="text-pink-400" />
                  <h4>Aditya's Dedication to {profile.name}</h4>
                </div>
                <p className="dedication-text">
                  "{profile.rightRoute?.dedicationMessage}"
                </p>
                <span className="dedication-signature">— With all my love, Aditya</span>
              </div>
            </div>
          )}

          {/* =========================================================================
              🌸 4TH ROUTE: THE WHISPERING FOUNTAIN (WHAT SHE LOVES IN ADITYA)
             ========================================================================= */}
          {surpriseType === "fountain" && (
            <div className="surprise-content fountain-view">
              <div className="surprise-header">
                <span className="room-tag fountain-tag">🌸 4th Route • Whispering Fountain</span>
                <h2>What You Adores Most In Aditya</h2>
                <p className="chef-subtitle">{profile.fountainRoute?.subtitle || "Echoes of Love"}</p>
              </div>

              {/* Reason Card */}
              <div className="fountain-reason-card">
                <div className="fountain-icon-badge">
                  <Waves size={24} className="text-cyan-300" />
                </div>
                <h3>{activeReason.title}</h3>
                <p>{activeReason.description}</p>
                <span className="reason-stamp">Reason #{activeReasonIdx + 1} of {fountainReasons.length}</span>
              </div>

              {/* Reason Navigator */}
              <div className="memory-nav">
                <button 
                  className="nav-btn"
                  onClick={() => setActiveReasonIdx(idx => (idx > 0 ? idx - 1 : fountainReasons.length - 1))}
                >
                  <ChevronLeft size={18} /> Previous Reason
                </button>
                <span className="nav-counter">
                  {activeReasonIdx + 1} of {fountainReasons.length}
                </span>
                <button 
                  className="nav-btn"
                  onClick={() => setActiveReasonIdx(idx => (idx + 1) % fountainReasons.length)}
                >
                  Next Reason <ChevronRight size={18} />
                </button>
              </div>

              {/* Whisper Box */}
              <div className="whisper-box-wrapper">
                <h4>✨ Whisper Something into the Fountain for Aditya:</h4>
                {whisperSent ? (
                  <div className="whisper-sent-success">
                    <Heart size={24} className="text-pink-500 fill-pink-500 animate-bounce" />
                    <span>Your sweet whisper has been delivered to Aditya's heart! 💕</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendWhisper} className="whisper-form">
                    <textarea
                      rows={2}
                      value={whisperMsg}
                      onChange={(e) => setWhisperMsg(e.target.value)}
                    />
                    <button type="submit" className="whisper-send-btn">
                      <Send size={15} /> Drop into Fountain
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              ⬆️ CENTER ROUTE: THE STARLIGHT PAVILION (THE GRAND MAIN GIFT)
             ========================================================================= */}
          {surpriseType === "gift" && (
            <div className="surprise-content letter-view">
              <div className="surprise-header">
                <span className="room-tag final-tag">⬆️ Center Route • The Main Gift</span>
                <h2>{profile.centerRoute?.letterHeading}</h2>
                <span className="letter-date">{profile.centerRoute?.letterDate}</span>
              </div>

              {/* Wax-Sealed Letter */}
              <div className="letter-paper">
                <div className="wax-seal">
                  <Heart size={20} className="fill-white text-white" />
                </div>
                <div className="letter-text">
                  {profile.centerRoute?.paragraphs?.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                  <div className="letter-sign">{profile.centerRoute?.signature}</div>
                </div>
              </div>

              {/* Proposal / Forever Promise Box */}
              <div className="proposal-box">
                <h3>{profile.centerRoute?.proposalPrompt}</h3>
                {hasAcceptedProposal ? (
                  <div className="celebration-box animate-fade-in">
                    <Heart size={38} className="text-pink-500 fill-pink-500 animate-bounce mx-auto" />
                    <h4>{profile.centerRoute?.celebrationText}</h4>
                    <p className="forever-promise">Forever locked with Aditya ❤️🔒</p>
                  </div>
                ) : (
                  <button className="yes-forever-btn" onClick={handleAcceptProposal}>
                    <Sparkles size={20} /> {profile.centerRoute?.yesButtonText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX OVERLAY */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close-btn" onClick={() => setLightboxImg(null)}>
            <X size={26} />
          </button>
          <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} alt="Fullscreen View" className="lightbox-img" />
          </div>
        </div>
      )}
    </>
  );
}
