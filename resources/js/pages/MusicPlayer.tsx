// resources/js/components/MusicPlayer.tsx
import { useMusic } from "@/context/MusicContext";
import { useEffect, useRef } from "react";

interface MusicPlayerProps {
  bg?: string;
}

export function MusicPlayer({ bg }: MusicPlayerProps) {
  const { isPlaying, toggleMusic } = useMusic();
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (gifRef.current) {
      if (isPlaying) {
        gifRef.current.style.animation = "spin 2s linear infinite";
      } else {
        gifRef.current.style.animation = "none";
      }
    }
  }, [isPlaying]);

  return (
    <>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <button
        ref={gifRef}
        onClick={toggleMusic}
        className={`fixed right-4 bottom-4 z-[50] flex aspect-square w-13 cursor-pointer items-center justify-center rounded-full border p-1 transition-transform duration-200 hover:scale-110 ${
          bg === "black"
            ? "border-black/30 bg-black/20"
            : "border-white/30 bg-white/20"
        }`}
        aria-label="Toggle music"
      >
        <div
          className={`absolute h-3 w-3 rounded-full ${
            bg === "black" ? "bg-white" : "bg-black"
          }`}
        ></div>
        <img
          src="/media/landing-page/music.gif"
          className="h-full w-full rounded-full object-cover"
          alt="Music toggle"
        />
      </button>
    </>
  );
}
