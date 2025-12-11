
import React, { useRef, useEffect } from 'react';
import { SkipForward } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

// Video URL provided in the requirements
const INTRO_VIDEO_URL = "https://cdn.qwenlm.ai/output/47ecfc84-3e76-4778-a37c-f5a478f18a99/t2v/0573c145-655f-4b90-884a-ec082e506cba/ffc0c6e2-86ce-4862-a353-2136193ef358.mp4?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiNDdlY2ZjODQtM2U3Ni00Nzc4LWEzN2MtZjVhNDc4ZjE4YTk5IiwicmVzb3VyY2VfaWQiOiJmZmMwYzZlMi04NmNlLTQ4NjItYTM1My0yMTM2MTkzZWYzNTgiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.Z-Yakc9GEgbo8mJVdDZXlL7q_qZXujTzfUwEKOepX4U&download=true";

const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt autoplay on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay prevented by browser policy:", err);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* 
        Video Player
        - muted: required for autoplay in most browsers
        - playsInline: required for iOS
        - onEnded: triggers transition when video finishes
        - onError: skips video if it fails to load
      */}
        <video
  ref={videoRef}
  src={INTRO_VIDEO_URL}
  className="w-full h-full object-contain"
  muted
  playsInline
  preload="auto"
  autoPlay
  onCanPlay={() => videoRef.current?.play()}
  onEnded={onComplete}
  onError={() => {
      console.warn("Video failed to load, skipping intro.");
      onComplete();
  }}
/>
    

      {/* Skip Button - Bottom Right */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-md transition-all border border-white/20 group"
      >
        <span className="font-bold tracking-wider text-sm">SKIP</span>
        <SkipForward size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default IntroVideo;
