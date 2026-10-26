// ==============================================================================
// 🌸 ADITYA'S DUAL-PERSONA STORAGE (ANUBHA & ANAYKA)
// Stores photos, pretty quotes, songs, and main gifts with localStorage persistence
// ==============================================================================

const STORAGE_KEY = "aditya_love_garden_profiles_v6";

const DEFAULT_PROFILES = {
  anubha: {
    id: "anubha",
    name: "Anubha",
    nickname: "My Precious Anubha",
    partnerTitle: "Queen of Aditya's Heart",
    tagline: "The Girl Who Brings Spring into My Life 🌸",
    
    // Security verification
    dobAnswers: ["15 12 2002", "15/12/2002", "15-12-2002", "15 12", "15/12", "15 dec 2002", "15 december 2002", "2002-12-15"],
    foodAnswers: ["fish", "fish fry", "fish curry", "fried fish", "machli", "pomfret", "salmon"],
    favoriteThingKeywords: ["smile", "eyes", "laugh", "heart", "caring", "voice", "everything", "cute", "cuteness", "hair"],

    // ⬅️ LEFT ROUTE: Pretty Photos & Quotes
    leftRoute: {
      title: "The Blossom Grove of Memories & Quotes",
      subtitle: "Sacred moments & pure love captured for Anubha",
      photos: [
        {
          id: 1,
          title: "Blessings by the Holy Ganga",
          date: "Varanasi Ghats",
          quote: "By the sacred holy river, barefoot and soul-bound, my heart only prayed for one lifelong blessing: You, Anubha.",
          caption: "Standing beside you as the temple bells echoed, I knew our love was written by the universe itself.",
          imageUrl: "/photos/anubha/photo1_ghat.jpg"
        },
        {
          id: 2,
          title: "My Cute & Playful Rockstar",
          date: "Candid Joy",
          quote: "You can try all your silly pouts and funny rock signs, but to Aditya, you are always the most breathtaking girl alive.",
          caption: "Under the tree shade, making goofy faces and laughing until our stomachs hurt.",
          imageUrl: "/photos/anubha/photo2_cute_selfie.jpg"
        },
        {
          id: 3,
          title: "My Peace in a Chaotic World",
          date: "Sweet Moments Together",
          quote: "When my head rests next to yours, the entire world goes quiet. In your gentle warmth, I found my forever home.",
          caption: "No filters, no noise — just Aditya and his favorite person with soft smiles under the sun.",
          imageUrl: "/photos/anubha/photo3_loving_smile.jpg"
        },
        {
          id: 4,
          title: "Under the Dome of Peace",
          date: "Shanti Stupa Journey",
          quote: "Standing before the monument of peace, holding the girl who brought serenity and colors into my life.",
          caption: "With my arm around you, every single destination feels magical, Anubha.",
          imageUrl: "/photos/anubha/photo4_peace_stupa.jpg"
        },
        {
          id: 5,
          title: "Side by Side Across Time",
          date: "Eternal Ganga Walk",
          quote: "Some love stories are written for a season, but ours was carved into the stone steps of eternity.",
          caption: "Wherever life takes us, my hand will always reach out for yours, Anubha.",
          imageUrl: "/photos/anubha/photo5_ganga_walk.jpg"
        }
      ],
      // ✨ Extra section of pretty quotes from Aditya for Anubha
      prettyQuotes: [
        {
          id: 1,
          quote: "If I had a flower for every time you crossed my mind, Anubha, I could walk through an endless garden forever.",
          from: "— Aditya's Daily Thought"
        },
        {
          id: 2,
          quote: "You don't need makeup, fancy lights, or perfection. The way your eyes sparkle when you're happy is the purest beauty in the world.",
          from: "— What Aditya Admires"
        },
        {
          id: 3,
          quote: "Loving you isn't just something I do; it's the most natural, effortless thing my heart has ever known.",
          from: "— A Promise to Anubha"
        },
        {
          id: 4,
          quote: "You are my morning smile, my midnight comfort, my favorite travel partner, and my dream come true.",
          from: "— Forever Yours, Aditya"
        }
      ]
    },

    // ➡️ RIGHT ROUTE: Song Dedicated to Her
    rightRoute: {
      title: "The Melody Gazebo",
      subtitle: "A Song Aditya Plays Only for Anubha",
      songTitle: "Anubha's Dedicated Melody",
      artist: "Dedicated with All of Aditya's Love",
      youtubeUrl: "https://youtu.be/zWEOx7TSM6I?list=RDzWEOx7TSM6I&t=63",
      lyricsExcerpt: "Whenever this song plays, every beat and lyric feels like it was written just to describe you, Anubha.",
      dedicationMessage: "Anubha, this song is my heart's rhythm whenever I think of you. Every note reminds me of our walks by the ghats, our smiles, and how blessed I am to have you."
    },

    // 🌸 4TH ROUTE: The Whispering Fountain (What She Loves Most in Aditya)
    fountainRoute: {
      title: "The Whispering Fountain",
      subtitle: "What Anubha Adores Most in Aditya ⛲💕",
      reasons: [
        {
          id: 1,
          title: "His Caring & Protective Nature",
          description: "The way Aditya constantly checks up on you, makes sure you've eaten, and holds you safe in crowded streets."
        },
        {
          id: 2,
          title: "His Warm, Tight Hugs",
          description: "How one single hug from Aditya makes every worry, stress, and tired feeling vanish into thin air."
        },
        {
          id: 3,
          title: "How He Teases You Playfully",
          description: "Making silly jokes and playful teasing just to see your adorable pout, followed by your sweet smile."
        },
        {
          id: 4,
          title: "His Pure Eyes When He Looks at You",
          description: "That unmistakable loving gaze where Aditya looks at you like you are the only girl in the entire universe."
        },
        {
          id: 5,
          title: "His Midnight Calls & Endless Talks",
          description: "Staying up late listening to everything on your mind, laughing together until the morning comes."
        }
      ],
      whisperPrompt: "Whisper what you love most about Aditya into the fountain:"
    },

    // ⬆️ CENTER ROUTE: The Grand Surprise Gift
    centerRoute: {
      title: "The Starlight Pavilion",
      giftBoxTitle: "Aditya's Golden Heart Box for Anubha",
      letterHeading: "To My Dearest Anubha,",
      letterDate: "A Promise Under the Stars",
      paragraphs: [
        "My beloved Anubha, as you walk to the center of this enchanted garden, I want you to know how deeply you are loved.",
        "You are my calm in every storm, the brightest light in my day, and my favorite reason to smile. No virtual flowers and no words could ever equal the beauty you bring to my life.",
        "I cherish your laughter, I cherish your sweet moods, and I cherish the bond we share. Thank you for choosing me and for letting me love you.",
        "Forever and always yours,"
      ],
      signature: "— Your Aditya ❤️",
      proposalPrompt: "Will you promise to walk hand-in-hand through every garden of life with Aditya forever?",
      yesButtonText: "YES! Aditya, I Am Yours Forever! 💍❤️",
      celebrationText: "Anubha & Aditya: Forever United in Love! ✨🎉"
    }
  },

  anayka: {
    id: "anayka",
    name: "Anayka",
    nickname: "My Sweet Anayka",
    partnerTitle: "Goddess of Aditya's World",
    tagline: "The Sunshine That Lights Up My Soul 🌷",

    // Security verification
    dobAnswers: ["15 12 2002", "15/12/2002", "15-12-2002", "15 12", "15/12", "15 dec 2002", "15 december 2002", "2002-12-15"],
    foodAnswers: ["fish", "fish fry", "fish curry", "fried fish", "machli", "pomfret", "salmon"],
    favoriteThingKeywords: ["smile", "eyes", "laugh", "heart", "caring", "voice", "everything", "cute", "cuteness", "hair"],

    // ⬅️ LEFT ROUTE: Pretty Photos & Quotes
    leftRoute: {
      title: "The Blossom Grove of Memories & Quotes",
      subtitle: "Sacred moments & pure love captured for Anayka",
      photos: [
        {
          id: 1,
          title: "Lost in Your Eyes",
          date: "Heart to Heart",
          quote: "In a world of billions of distractions, my eyes will always get lost in yours, Anayka.",
          caption: "The moment our eyes lock, words become unnecessary. My heart speaks directly to yours.",
          imageUrl: "/photos/anayka/photo1_eye_contact.jpg"
        },
        {
          id: 2,
          title: "Twins in Red, Partners in Soul",
          date: "Matching Cuteness",
          quote: "You make every ordinary day feel like a festival, Anayka. Being close to you is my happiest place.",
          caption: "Matching in red, smiling with all our hearts. Holding you tight will always be my favorite feeling.",
          imageUrl: "/photos/anayka/photo2_red_selfie.jpg"
        },
        {
          id: 3,
          title: "Golden Hour at the Holy Temple",
          date: "Sacred Blessings",
          quote: "Under the golden temple sky, I silently thanked God for bringing the most pure-hearted angel into my life: You, Anayka.",
          caption: "Golden sunlight, temple bells, and the prettiest smile that outshines every sunset.",
          imageUrl: "/photos/anayka/photo3_temple_sun.jpg"
        },
        {
          id: 4,
          title: "Ganga Ghats with My Angel",
          date: "Varanasi Journey",
          quote: "By the holy waters of time, standing beside the girl who turned my life into a beautiful pilgrimage of love.",
          caption: "Every single step by the river felt sacred because I was walking it beside you, Anayka.",
          imageUrl: "/photos/anayka/photo4_ghat_yellow.jpg"
        },
        {
          id: 5,
          title: "Midnight Ocean Whispers",
          date: "Waves of Love",
          quote: "Under the velvet midnight sky, listening to the ocean waves whisper our story to the stars.",
          caption: "Cold sand beneath our feet, warm love in our hearts. Forever by your side, Anayka.",
          imageUrl: "/photos/anayka/photo5_night_beach.jpg"
        }
      ],
      // ✨ Extra section of pretty quotes from Aditya for Anayka
      prettyQuotes: [
        {
          id: 1,
          quote: "If loving you was a journey, Anayka, I would walk it a thousand times without ever looking back.",
          from: "— Aditya's Heart Truth"
        },
        {
          id: 2,
          quote: "Your eyes carry a quiet magic that can heal my heaviest, most tiring days in a single heartbeat.",
          from: "— What Aditya Cherishes"
        },
        {
          id: 3,
          quote: "You are my favorite thought at sunrise and my safest comfort at midnight, Anayka.",
          from: "— Daily Thought"
        },
        {
          id: 4,
          quote: "With you, every little dream feels possible and every breath feels like sweet poetry.",
          from: "— Forever Yours, Aditya"
        }
      ]
    },

    // ➡️ RIGHT ROUTE: Song Dedicated to Her
    rightRoute: {
      title: "The Melody Gazebo",
      subtitle: "A Melody Crafted Specially for Anayka",
      songTitle: "Anayka's Dedicated Melody",
      artist: "Dedicated with All of Aditya's Love",
      youtubeUrl: "https://youtu.be/3CQUoHo7epE?list=RD3CQUoHo7epE&t=87",
      lyricsExcerpt: "No song in the world can sing as sweetly as your voice, Anayka.",
      dedicationMessage: "Anayka, this song is my secret tribute to your beauty and soul. Whenever it plays, know that Aditya is thinking of you with all his heart."
    },

    // 🌸 4TH ROUTE: The Whispering Fountain (What She Loves Most in Aditya)
    fountainRoute: {
      title: "The Whispering Fountain",
      subtitle: "What Anayka Adores Most in Aditya ⛲💕",
      reasons: [
        {
          id: 1,
          title: "His Unconditional Care & Loyalty",
          description: "The way Aditya always puts you first, protecting your peace and caring for you without holding back."
        },
        {
          id: 2,
          title: "His Comforting Tight Hugs",
          description: "How one warm embrace from Aditya makes you feel like the safest, most cherished girl in the universe."
        },
        {
          id: 3,
          title: "How He Looks At You",
          description: "That deep, loving look in his eyes where you know you have his entire heart forever."
        },
        {
          id: 4,
          title: "His Playful Smiles & Teasing",
          description: "Bringing an instant giggle to your face, making every ordinary second fun and lighthearted."
        },
        {
          id: 5,
          title: "His Dedication To You",
          description: "How proud he is to hold your hand, stand beside you, and call you his forever soulmate."
        }
      ],
      whisperPrompt: "Whisper what you love most about Aditya into the fountain:"
    },

    // ⬆️ CENTER ROUTE: The Grand Surprise Gift
    centerRoute: {
      title: "The Starlight Pavilion",
      giftBoxTitle: "Aditya's Golden Heart Box for Anayka",
      letterHeading: "To My Beautiful Anayka,",
      letterDate: "An Eternal Bond",
      paragraphs: [
        "My sweetest Anayka, walking to the heart of this garden brings you to my true promise to you.",
        "You are so uniquely precious to me. Your kindness, your laughter, and the way you care about the smallest things makes me fall for you more every day.",
        "Thank you for being my anchor, my sweetest joy, and my biggest dream come true. You will always have Aditya's heart entirely and unconditionally.",
        "Forever yours,"
      ],
      signature: "— With Infinite Love, Aditya ❤️",
      proposalPrompt: "Will you hold Aditya's hand and let him love you forever, Anayka?",
      yesButtonText: "YES! Aditya, I Love You Forever! 💍❤️",
      celebrationText: "Anayka & Aditya: Two Hearts, One Soul! ✨🎉"
    }
  }
};

export const ProfileStorage = {
  // Load profiles from localStorage or initialize with defaults
  getAllProfiles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
    // Save defaults
    this.saveAllProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  },

  saveAllProfiles(profiles) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  },

  getProfile(nameKey) {
    const profiles = this.getAllProfiles();
    const key = (nameKey || "").toLowerCase().trim();
    if (key.includes("anayka")) {
      return profiles.anayka;
    }
    return profiles.anubha;
  },

  updateProfile(nameKey, updatedProfile) {
    const profiles = this.getAllProfiles();
    const key = (nameKey || "").toLowerCase().trim().includes("anayka") ? "anayka" : "anubha";
    profiles[key] = updatedProfile;
    this.saveAllProfiles(profiles);
    return profiles[key];
  },

  resetDefaults() {
    this.saveAllProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  },

  // Save message whispered into the fountain or other garden interactions
  saveWhisper(senderName, text, category = "fountain") {
    const key = "aditya_whispers_v1";
    let list = this.getWhispers();
    const entry = {
      id: Date.now(),
      from: senderName || "My Love",
      category: category, // "fountain", "gate", "proposal", "custom"
      message: text.trim(),
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
    };
    list.unshift(entry);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save whisper:", e);
    }
    return entry;
  },

  // Save verification responses written by her at the security gate
  saveGateEntry({ name, dob, food, favoriteThing }) {
    const key = "aditya_whispers_v1";
    let list = this.getWhispers();
    const entry = {
      id: Date.now(),
      from: name || "Her",
      category: "gate",
      message: `Answered Gate Verification:
• What Aditya loves most: "${favoriteThing}"
• Her favorite non-veg dish: "${food}"
• Aditya's birthday entered: "${dob}"`,
      details: {
        favoriteThing,
        food,
        dob
      },
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
    };
    list.unshift(entry);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save gate entry:", e);
    }
    return entry;
  },

  getWhispers() {
    const key = "aditya_whispers_v1";
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load whispers:", e);
    }
    return [];
  },

  deleteWhisper(id) {
    const key = "aditya_whispers_v1";
    let list = this.getWhispers().filter(item => item.id !== id);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
    return list;
  },

  clearAllWhispers() {
    try {
      localStorage.removeItem("aditya_whispers_v1");
    } catch (e) {}
    return [];
  }
};
