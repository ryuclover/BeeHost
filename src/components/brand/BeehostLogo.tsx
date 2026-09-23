import React from 'react';
import { BeeMascot } from '../mascot/BeeMascot';

interface BeehostLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showMascot?: boolean;
  className?: string;
}

export const BeehostLogo: React.FC<BeehostLogoProps> = ({
  size = 'md',
  showMascot = true,
  className = '',
}) => {
  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { text: 'text-lg', mascot: 24, gap: 'gap-2' };
      case 'md':
        return { text: 'text-2xl', mascot: 32, gap: 'gap-2.5' };
      case 'lg':
        return { text: 'text-3xl sm:text-4xl', mascot: 44, gap: 'gap-3' };
      case 'xl':
        return { text: 'text-4xl sm:text-5xl', mascot: 52, gap: 'gap-4' };
      case 'hero':
        return { text: 'text-5xl sm:text-6xl md:text-7xl lg:text-[76px]', mascot: 64, gap: 'gap-4' };
      default:
        return { text: 'text-2xl', mascot: 32, gap: 'gap-2.5' };
    }
  };

  const config = getSizes();

  if (size === 'hero') {
    return (
      <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
        {showMascot && <BeeMascot size={config.mascot} showTrail={true} interactive={true} />}
        <div className="flex items-baseline font-extrabold tracking-tight" style={{ fontFamily: "'Silkscreen', 'Press Start 2P', system-ui, sans-serif" }}>
          {/* 'Bee' in white with 3D retro gaming block shadow */}
          <span
            className="text-[#FFFFFF]"
            style={{
              textShadow: '3px 3px 0px #07152F, 5px 5px 0px #0A2148, 7px 7px 0px rgba(7, 21, 47, 0.8)',
            }}
          >
            Bee
          </span>
          {/* 'host' in yellow #FFD633 with 3D drop shadow */}
          <span
            className="text-[#FFD633]"
            style={{
              textShadow: '3px 3px 0px #8B4F24, 5px 5px 0px #3C1E09, 7px 7px 0px rgba(7, 21, 47, 0.8)',
            }}
          >
            host
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
      {showMascot && <BeeMascot size={config.mascot} showTrail={false} interactive={true} />}
      <div className={`flex items-baseline font-bold tracking-tight ${config.text}`} style={{ fontFamily: "'Silkscreen', 'Press Start 2P', system-ui, sans-serif" }}>
        <span
          className="text-[#FFFFFF]"
          style={{
            textShadow: '1.5px 1.5px 0px #07152F, 2.5px 2.5px 0px #0A2148',
          }}
        >
          Bee
        </span>
        <span
          className="text-[#FFD633]"
          style={{
            textShadow: '1.5px 1.5px 0px #8B4F24, 2.5px 2.5px 0px #07152F',
          }}
        >
          host
        </span>
      </div>
    </div>
  );
};
