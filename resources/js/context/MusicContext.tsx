// resources/js/contexts/MusicContext.tsx
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

// Create the audio element ONCE, outside of any component
const globalAudio = new Audio();
globalAudio.src = "/media/music/music.mp3";
globalAudio.preload = "auto";

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state directly from localStorage to prevent a flicker
  const [isPlaying, setIsPlaying] = useState(() => {
    return localStorage.getItem("musicPlaying") === "true";
  });

  // This effect runs ONLY ONCE when the provider first mounts
  useEffect(() => {
    // 1. Restore the previous playback position
    const savedCurrentTime = localStorage.getItem("musicCurrentTime");
    if (savedCurrentTime) {
      // Wait for metadata to load before setting the time
      const handleLoadedMetadata = () => {
        globalAudio.currentTime = parseFloat(savedCurrentTime);
        globalAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
      globalAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
      // If metadata is already loaded, the event might not fire, so we set it directly as a fallback
      if (globalAudio.readyState >= 1) {
        globalAudio.currentTime = parseFloat(savedCurrentTime);
      }
    }

    // 2. If music should be playing, try to resume it on the first user interaction
    if (localStorage.getItem("musicPlaying") === "true") {
      const resumeMusic = () => {
        globalAudio
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.error("Music autoplay failed:", e));
        // Clean up the listener after it runs once
        document.removeEventListener("click", resumeMusic);
        document.removeEventListener("touchstart", resumeMusic);
      };
      // Add listeners for the very next interaction
      document.addEventListener("click", resumeMusic, { once: true });
      document.addEventListener("touchstart", resumeMusic, { once: true });
    }

    // 3. Set up persistent event listeners on the global audio element
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
      // IMPORTANT: Save the current time when pausing
      localStorage.setItem(
        "musicCurrentTime",
        globalAudio.currentTime.toString()
      );
    };
    const handleEnded = () => {
      setIsPlaying(false);
      localStorage.setItem("musicPlaying", "false");
      localStorage.setItem("musicCurrentTime", "0");
    };
    const handleTimeUpdate = () => {
      // Save the time periodically while playing
      localStorage.setItem(
        "musicCurrentTime",
        globalAudio.currentTime.toString()
      );
    };

    globalAudio.addEventListener("play", handlePlay);
    globalAudio.addEventListener("pause", handlePause);
    globalAudio.addEventListener("ended", handleEnded);
    globalAudio.addEventListener("timeupdate", handleTimeUpdate);

    // 4. Cleanup function (runs when the app fully unmounts)
    return () => {
      globalAudio.removeEventListener("play", handlePlay);
      globalAudio.removeEventListener("pause", handlePause);
      globalAudio.removeEventListener("ended", handleEnded);
      globalAudio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []); // Empty dependency array is KEY - it runs only once

  // Update localStorage whenever the playing state changes
  useEffect(() => {
    localStorage.setItem("musicPlaying", isPlaying.toString());
  }, [isPlaying]);

  // The toggle function controls the global audio element
  const toggleMusic = () => {
    if (isPlaying) {
      globalAudio.pause();
    } else {
      globalAudio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Play failed:", error));
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};
