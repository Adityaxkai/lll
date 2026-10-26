import React, { useState, useEffect } from "react";
import { ProfileStorage } from "../services/profileStorage";
import { sounds } from "../audio/soundEffects";
import { 
  Shield, Key, Unlock, Image as ImageIcon, Music, Gift, 
  Save, RotateCcw, X, Upload, CheckCircle, Trash2,
  MessageSquare, Heart, Mail, Clock, Copy, Check, RefreshCw, Send
} from "lucide-react";

export default function AdminPanel({ onClose }) {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");

  const [activePersona, setActivePersona] = useState("anubha"); // "anubha" or "anayka"
  const [activeTab, setActiveTab] = useState("photos"); // "photos", "song", "gift", "messages"
  const [profiles, setProfiles] = useState(() => ProfileStorage.getAllProfiles());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Written messages by her
  const [whispers, setWhispers] = useState(() => ProfileStorage.getWhispers());
  const [messageFilter, setMessageFilter] = useState("all"); // "all", "anubha", "anayka", "fountain", "gate"
  const [copiedId, setCopiedId] = useState(null);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === "1512" || pin === "admin" || pin === "aditya") {
      sounds.playUnlock();
      setIsUnlocked(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN! Hint: Aditya's birth date (1512) 🔐");
    }
  };

  const currentProfile = profiles ? profiles[activePersona] : null;

  // Handle image upload and compression to base64
  const handlePhotoUpload = (slotIdx, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

        // Update profile
        setProfiles(prev => {
          const updated = JSON.parse(JSON.stringify(prev));
          updated[activePersona].leftRoute.photos[slotIdx].imageUrl = compressedBase64;
          return updated;
        });
        sounds.playChime();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (slotIdx) => {
    setProfiles(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[activePersona].leftRoute.photos[slotIdx].imageUrl = "";
      return updated;
    });
  };

  const handleSaveAll = () => {
    if (!profiles) return;
    ProfileStorage.saveAllProfiles(profiles);
    sounds.playCelebration();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all photos and text back to defaults?")) {
      const reset = ProfileStorage.resetDefaults();
      setProfiles(reset);
      sounds.playChime();
    }
  };

  // Whisper actions
  const handleCopy = (id, text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteWhisper = (id) => {
    const updated = ProfileStorage.deleteWhisper(id);
    setWhispers(updated);
    sounds.playChime();
  };

  const handleClearAllWhispers = () => {
    if (window.confirm("Are you sure you want to delete all written messages and whispers?")) {
      const empty = ProfileStorage.clearAllWhispers();
      setWhispers(empty);
      sounds.playChime();
    }
  };

  const handleRefreshWhispers = () => {
    setWhispers(ProfileStorage.getWhispers());
    sounds.playChime();
  };

  const handleAddSampleWhisper = (personaName) => {
    const sampleText = personaName === "Anayka"
      ? "Aditya, I love how you care for every little detail and make me feel like the luckiest girl in the world! ✨"
      : "Aditya, the way you listen to my stories and make me laugh when I'm tired is what I adore most about you! 💕";
    ProfileStorage.saveWhisper(personaName, sampleText, "fountain");
    setWhispers(ProfileStorage.getWhispers());
    sounds.playCelebration();
  };

  if (!isUnlocked) {
    return (
      <div className="modal-backdrop">
        <div className="admin-pin-card">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="pin-icon-wrap">
            <Shield size={38} className="text-pink-400" />
          </div>
          <h2>Aditya’s Control Center</h2>
          <p>Please enter your secret 4-digit PIN to access content controls.</p>

          <form onSubmit={handlePinSubmit} className="pin-form">
            <div className="pin-input-group">
              <Key size={18} className="pin-key-icon" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            {pinError && <div className="pin-error-text">{pinError}</div>}
            <button type="submit" className="pin-submit-btn">
              <Unlock size={18} /> Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!currentProfile) return null;

  return (
    <div className="modal-backdrop">
      <div className="admin-panel-card">
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <Shield size={24} className="text-pink-400" />
            <div>
              <h3>Aditya's Love Garden Manager</h3>
              <span>Customise photos, songs, and main gifts for Anubha & Anayka</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Persona Selector Toggle */}
        <div className="persona-toggle-bar">
          <button
            className={`persona-tab-btn ${activePersona === "anubha" ? "active-persona" : ""}`}
            onClick={() => setActivePersona("anubha")}
          >
            🌸 Edit Anubha's Universe
          </button>
          <button
            className={`persona-tab-btn ${activePersona === "anayka" ? "active-persona" : ""}`}
            onClick={() => setActivePersona("anayka")}
          >
            🌷 Edit Anayka's Universe
          </button>
        </div>

        {/* Sub-Tabs: Left (Photos), Right (Song), Center (Gift), Messages (Written by Her) */}
        <div className="admin-subtabs">
          <button
            className={`subtab-btn ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            <ImageIcon size={16} /> ⬅️ Left: Photos & Quotes
          </button>
          <button
            className={`subtab-btn ${activeTab === "song" ? "active" : ""}`}
            onClick={() => setActiveTab("song")}
          >
            <Music size={16} /> ➡️ Right: Dedicated Song
          </button>
          <button
            className={`subtab-btn ${activeTab === "gift" ? "active" : ""}`}
            onClick={() => setActiveTab("gift")}
          >
            <Gift size={16} /> ⬆️ Center: Main Surprise Gift
          </button>
          <button
            className={`subtab-btn messages-subtab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("messages");
              setWhispers(ProfileStorage.getWhispers());
            }}
          >
            <MessageSquare size={16} /> 💌 Messages From Her
            {whispers.length > 0 && <span className="admin-msg-badge">{whispers.length}</span>}
          </button>
        </div>

        {/* Tab 1: Left Route (Photos & Pretty Quotes) */}
        {activeTab === "photos" && (
          <div className="admin-tab-content">
            <div className="content-intro">
              <h4>Uploaded Photos & Quotes for {currentProfile.name}</h4>
              <p>Upload real photos from your phone or PC. They will appear on the 3D Polaroid frames in the Blossom Grove!</p>
            </div>

            <div className="photo-slots-grid">
              {currentProfile.leftRoute.photos.map((photo, idx) => (
                <div key={photo.id} className="photo-slot-card">
                  <div className="photo-preview-box">
                    {photo.imageUrl ? (
                      <div className="image-preview-wrap">
                        <img src={photo.imageUrl} alt={`Memory ${idx + 1}`} />
                        <button
                          className="remove-photo-btn"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Remove photo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-placeholder-label">
                        <Upload size={24} className="text-pink-400" />
                        <span>Click to Upload Photo #{idx + 1}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handlePhotoUpload(idx, e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  <div className="photo-form-fields">
                    <label>
                      <span>Memory Title:</span>
                      <input
                        type="text"
                        value={photo.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfiles(prev => {
                            const updated = JSON.parse(JSON.stringify(prev));
                            updated[activePersona].leftRoute.photos[idx].title = val;
                            return updated;
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Pretty Quote:</span>
                      <textarea
                        rows={2}
                        value={photo.quote}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfiles(prev => {
                            const updated = JSON.parse(JSON.stringify(prev));
                            updated[activePersona].leftRoute.photos[idx].quote = val;
                            return updated;
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Aditya's Caption / Story:</span>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfiles(prev => {
                            const updated = JSON.parse(JSON.stringify(prev));
                            updated[activePersona].leftRoute.photos[idx].caption = val;
                            return updated;
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Right Route (Dedicated Song) */}
        {activeTab === "song" && (
          <div className="admin-tab-content">
            <div className="content-intro">
              <h4>Song Dedicated to {currentProfile.name}</h4>
              <p>Configure the melody, lyrics, and heartfelt dedication note she hears in the Melody Gazebo.</p>
            </div>

            <div className="admin-form-group">
              <label>Song Title:</label>
              <input
                type="text"
                value={currentProfile.rightRoute.songTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].rightRoute.songTitle = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>YouTube Song Link (Paste your YouTube video or song URL):</label>
              <input
                type="text"
                value={currentProfile.rightRoute.youtubeUrl || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].rightRoute.youtubeUrl = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>Artist / Attribution:</label>
              <input
                type="text"
                value={currentProfile.rightRoute.artist}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].rightRoute.artist = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>Aditya's Song Dedication Note to {currentProfile.name}:</label>
              <textarea
                rows={4}
                value={currentProfile.rightRoute.dedicationMessage}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].rightRoute.dedicationMessage = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>Favorite Lyrics Excerpt:</label>
              <input
                type="text"
                value={currentProfile.rightRoute.lyricsExcerpt}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].rightRoute.lyricsExcerpt = val;
                    return updated;
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Center Route (The Main Surprise Gift) */}
        {activeTab === "gift" && (
          <div className="admin-tab-content">
            <div className="content-intro">
              <h4>The Grand Rooftop Gift & Letter for {currentProfile.name}</h4>
              <p>Customize the wax-sealed love letter and proposal promise inside the giant golden gift box.</p>
            </div>

            <div className="admin-form-group">
              <label>Letter Heading:</label>
              <input
                type="text"
                value={currentProfile.centerRoute.letterHeading}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].centerRoute.letterHeading = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>Love Letter Paragraphs (Edit or rewrite each section):</label>
              {currentProfile.centerRoute.paragraphs.map((para, pIdx) => (
                <textarea
                  key={pIdx}
                  rows={2}
                  style={{ marginBottom: "0.5rem" }}
                  value={para}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfiles(prev => {
                      const updated = JSON.parse(JSON.stringify(prev));
                      updated[activePersona].centerRoute.paragraphs[pIdx] = val;
                      return updated;
                    });
                  }}
                />
              ))}
            </div>

            <div className="admin-form-group">
              <label>Proposal / Promise Question:</label>
              <input
                type="text"
                value={currentProfile.centerRoute.proposalPrompt}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].centerRoute.proposalPrompt = val;
                    return updated;
                  });
                }}
              />
            </div>

            <div className="admin-form-group">
              <label>Celebration Button Text:</label>
              <input
                type="text"
                value={currentProfile.centerRoute.yesButtonText}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfiles(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated[activePersona].centerRoute.yesButtonText = val;
                    return updated;
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Messages & Text Written by Her */}
        {activeTab === "messages" && (
          <div className="admin-tab-content messages-tab-content">
            <div className="messages-header-row">
              <div className="content-intro">
                <h4>💌 Words & Messages Written by Her</h4>
                <p>Messages whispered into the fountain, answers to security questions, and her love notes for Aditya.</p>
              </div>

              <div className="messages-header-actions">
                <button 
                  className="msg-action-btn refresh-btn"
                  onClick={handleRefreshWhispers}
                  title="Reload new messages"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
                {whispers.length > 0 && (
                  <button 
                    className="msg-action-btn clear-all-btn"
                    onClick={handleClearAllWhispers}
                    title="Delete all messages"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills */}
            <div className="messages-filter-bar">
              <span className="filter-label">Filter:</span>
              <button 
                className={`filter-pill ${messageFilter === "all" ? "active" : ""}`}
                onClick={() => setMessageFilter("all")}
              >
                All Messages ({whispers.length})
              </button>
              <button 
                className={`filter-pill ${messageFilter === "anubha" ? "active" : ""}`}
                onClick={() => setMessageFilter("anubha")}
              >
                🌸 From Anubha ({whispers.filter(w => (w.from || "").toLowerCase().includes("anubha")).length})
              </button>
              <button 
                className={`filter-pill ${messageFilter === "anayka" ? "active" : ""}`}
                onClick={() => setMessageFilter("anayka")}
              >
                🌷 From Anayka ({whispers.filter(w => (w.from || "").toLowerCase().includes("anayka")).length})
              </button>
              <button 
                className={`filter-pill ${messageFilter === "fountain" ? "active" : ""}`}
                onClick={() => setMessageFilter("fountain")}
              >
                🌊 Whispering Fountain ({whispers.filter(w => w.category === "fountain").length})
              </button>
              <button 
                className={`filter-pill ${messageFilter === "gate" ? "active" : ""}`}
                onClick={() => setMessageFilter("gate")}
              >
                🔐 Gate Answers ({whispers.filter(w => w.category === "gate").length})
              </button>
            </div>

            {/* Messages Content */}
            {(() => {
              const filteredWhispers = whispers.filter(w => {
                if (messageFilter === "anubha") return (w.from || "").toLowerCase().includes("anubha");
                if (messageFilter === "anayka") return (w.from || "").toLowerCase().includes("anayka");
                if (messageFilter === "fountain") return w.category === "fountain";
                if (messageFilter === "gate") return w.category === "gate";
                return true;
              });

              if (filteredWhispers.length === 0) {
                return (
                  <div className="empty-messages-card">
                    <div className="empty-msg-icon">
                      <Mail size={44} className="text-pink-400" />
                    </div>
                    <h3>No written messages found here yet!</h3>
                    <p>
                      Whenever Anubha or Anayka writes what she loves most about Aditya at the <strong>Whispering Fountain</strong>, or submits her answers at the <strong>Security Gate</strong>, her exact words will appear here instantly!
                    </p>
                  </div>
                );
              }

              return (
                <div className="whispers-list-grid">
                  {filteredWhispers.map((whisper) => {
                    const isAnubha = (whisper.from || "").toLowerCase().includes("anubha");
                    const isAnayka = (whisper.from || "").toLowerCase().includes("anayka");

                    return (
                      <div key={whisper.id} className="whisper-item-card">
                        <div className="whisper-card-header">
                          <div className="whisper-meta-left">
                            <span className={`sender-tag ${isAnubha ? "tag-anubha" : isAnayka ? "tag-anayka" : "tag-default"}`}>
                              {isAnubha ? "🌸 Anubha" : isAnayka ? "🌷 Anayka" : `💕 ${whisper.from}`}
                            </span>
                            <span className={`category-tag cat-${whisper.category || "fountain"}`}>
                              {whisper.category === "gate" && "🔐 Security Gate Answer"}
                              {whisper.category === "fountain" && "🌊 Whispering Fountain"}
                              {whisper.category === "proposal" && "💍 Proposal Accepted!"}
                              {!whisper.category && "💌 Secret Note"}
                            </span>
                          </div>

                          <div className="whisper-meta-right">
                            <span className="whisper-date">
                              <Clock size={12} /> {whisper.timestamp}
                            </span>
                            <button 
                              className="msg-card-icon-btn copy-btn"
                              onClick={() => handleCopy(whisper.id, whisper.message)}
                              title="Copy message text"
                            >
                              {copiedId === whisper.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                            <button 
                              className="msg-card-icon-btn delete-btn"
                              onClick={() => handleDeleteWhisper(whisper.id)}
                              title="Delete this message"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="whisper-quote-bubble">
                          <div className="quote-mark-icon">“</div>
                          <div className="whisper-main-text">
                            {whisper.message}
                          </div>
                        </div>

                        {whisper.details && (
                          <div className="whisper-details-chips">
                            {whisper.details.favoriteThing && (
                              <div className="detail-chip">
                                <span className="chip-label">💖 What Aditya loves in her:</span>
                                <span className="chip-val">"{whisper.details.favoriteThing}"</span>
                              </div>
                            )}
                            {whisper.details.food && (
                              <div className="detail-chip">
                                <span className="chip-label">🍽️ Favorite non-veg:</span>
                                <span className="chip-val">"{whisper.details.food}"</span>
                              </div>
                            )}
                            {whisper.details.dob && (
                              <div className="detail-chip">
                                <span className="chip-label">🎂 Birthday entered:</span>
                                <span className="chip-val">"{whisper.details.dob}"</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Success toast */}
        {saveSuccess && (
          <div className="admin-success-banner">
            <CheckCircle size={18} />
            <span>All changes for {currentProfile.name} saved successfully!</span>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="admin-bottom-actions">
          <div className="left-actions">
            <button className="reset-btn" onClick={handleResetDefaults}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="right-actions">
            <button className="save-all-btn" onClick={handleSaveAll}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
