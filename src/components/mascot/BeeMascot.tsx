import React, { useState } from 'react';
import { retroAudio } from '../effects/SoundEffects';

interface BeeMascotProps {
  size?: number;
  className?: string;
  showTrail?: boolean;
  interactive?: boolean;
}

export const BeeMascot: React.FC<BeeMascotProps> = ({
  size = 48,
  className = '',
  showTrail = false,
  interactive = true,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsSpinning(true);
    retroAudio.playBlip(880, 'triangle', 0.12);
    setTimeout(() => setIsSpinning(false), 600);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title={interactive ? "Bzz! I'm Beezy, the Beehost mascot!" : undefined}
    >
      {/* Light glow behind mascot */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40 transition-opacity duration-300 group-hover:opacity-80"
        style={{
          background: 'radial-gradient(circle, #FFD633 0%, rgba(35, 217, 255, 0.4) 60%, transparent 100%)',
          transform: 'scale(1.2)',
        }}
      />

      {/* Sparkle trail if enabled */}
      {showTrail && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex space-x-1 opacity-70 pointer-events-none">
          <span className="w-1.5 h-1.5 bg-[#FFD633] rounded-none animate-twinkle"></span>
          <span className="w-1 h-1 bg-[#23D9FF] rounded-none animate-twinkle" style={{ animationDelay: '0.4s' }}></span>
          <span className="w-1 h-1 bg-white rounded-none animate-twinkle" style={{ animationDelay: '0.8s' }}></span>
        </div>
      )}

      {/* Pixel Bee Mascot SVG */}
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={`pixelated transition-transform duration-500 ${
          isSpinning ? 'rotate-[360deg] scale-125' : 'group-hover:scale-110'
        } animate-bee-float`}
        shapeRendering="crispEdges"
      >
        {/* Animated Wings */}
        <g className="animate-wing">
          {/* Left Wing */}
          <rect x="7" y="3" width="5" height="3" fill="#23D9FF" opacity="0.85" />
          <rect x="6" y="5" width="7" height="4" fill="#FFFFFF" opacity="0.95" />
          <rect x="7" y="7" width="5" height="2" fill="#E0F7FF" />
          {/* Right Wing */}
          <rect x="17" y="3" width="5" height="3" fill="#23D9FF" opacity="0.85" />
          <rect x="16" y="5" width="7" height="4" fill="#FFFFFF" opacity="0.95" />
          <rect x="17" y="7" width="5" height="2" fill="#E0F7FF" />
        </g>

        {/* Antennae */}
        <rect x="10" y="8" width="2" height="2" fill="#07152F" />
        <rect x="8" y="9" width="2" height="2" fill="#07152F" />
        <rect x="7" y="8" width="2" height="2" fill="#FFD633" />

        <rect x="20" y="8" width="2" height="2" fill="#07152F" />
        <rect x="22" y="9" width="2" height="2" fill="#07152F" />
        <rect x="23" y="8" width="2" height="2" fill="#FFD633" />

        {/* Stinger */}
        <rect x="4" y="18" width="2" height="2" fill="#07152F" />
        <rect x="3" y="19" width="1" height="1" fill="#07152F" />

        {/* Dark Body Outline */}
        <rect x="5" y="12" width="22" height="15" fill="#07152F" />

        {/* Inner Yellow Body */}
        <rect x="6" y="13" width="20" height="13" fill="#FFD633" />

        {/* Black Stripes */}
        <rect x="11" y="13" width="4" height="13" fill="#0A2148" />
        <rect x="18" y="13" width="4" height="13" fill="#0A2148" />

        {/* Shiny Highlights */}
        <rect x="7" y="14" width="3" height="2" fill="#FFF275" />
        <rect x="7" y="23" width="18" height="2" fill="#F4B400" opacity="0.4" />

        {/* Eyes (Cute pixel black eyes with catchlight) */}
        <rect x="22" y="16" width="3" height="4" fill="#07152F" />
        <rect x="22" y="16" width="1" height="2" fill="#FFFFFF" />

        {/* Sweet Rosy Cheek */}
        <rect x="22" y="21" width="3" height="2" fill="#FF8A32" opacity="0.8" />

        {/* Cute Smile */}
        <rect x="25" y="19" width="1" height="1" fill="#07152F" />
      </svg>
    </div>
  );
};
