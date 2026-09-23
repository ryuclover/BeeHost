import React from 'react';
import type { GameCategory } from '../../data/categories';
import { retroAudio } from '../effects/SoundEffects';

interface GameCardProps {
  category: GameCategory;
  isSelected?: boolean;
  onSelect: (category: GameCategory) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  category,
  isSelected = false,
  onSelect,
}) => {
  const renderPixelIcon = () => {
    switch (category.iconType) {
      case 'rpg':
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            <rect x="18" y="2" width="2" height="2" fill="#23D9FF" />
            <rect x="16" y="4" width="2" height="2" fill="#23D9FF" />
            <rect x="14" y="6" width="2" height="2" fill="#FFFFFF" />
            <rect x="12" y="8" width="2" height="2" fill="#23D9FF" />
            <rect x="10" y="10" width="2" height="2" fill="#168CFF" />
            <rect x="8" y="10" width="2" height="2" fill="#FFD633" />
            <rect x="10" y="12" width="2" height="2" fill="#FFD633" />
            <rect x="6" y="14" width="2" height="2" fill="#FF8A32" />
            <rect x="4" y="16" width="2" height="2" fill="#FFD633" />

            <rect x="4" y="2" width="2" height="2" fill="#23D9FF" />
            <rect x="6" y="4" width="2" height="2" fill="#23D9FF" />
            <rect x="8" y="6" width="2" height="2" fill="#FFFFFF" />
            <rect x="10" y="8" width="2" height="2" fill="#23D9FF" />
            <rect x="14" y="10" width="2" height="2" fill="#FFD633" />
            <rect x="12" y="12" width="2" height="2" fill="#FFD633" />
            <rect x="16" y="14" width="2" height="2" fill="#FF8A32" />
            <rect x="18" y="16" width="2" height="2" fill="#FFD633" />
          </svg>
        );

      case 'sandbox':
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            <polygon points="12,2 20,6 12,10 4,6" fill="#35D56F" />
            <polygon points="12,2 16,4 12,6 8,4" fill="#6EE7B7" />
            <polygon points="4,6 12,10 12,20 4,16" fill="#8B4F24" />
            <polygon points="12,10 20,6 20,16 12,20" fill="#6A3B18" />
            <rect x="6" y="8" width="2" height="3" fill="#35D56F" />
            <rect x="9" y="9" width="2" height="4" fill="#35D56F" />
            <rect x="14" y="9" width="2" height="3" fill="#2EB85C" />
            <rect x="17" y="7" width="2" height="3" fill="#2EB85C" />
          </svg>
        );

      case 'survival':
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            <rect x="6" y="3" width="3" height="3" fill="#23D9FF" />
            <rect x="9" y="3" width="6" height="3" fill="#70EEFF" />
            <rect x="15" y="3" width="3" height="3" fill="#23D9FF" />
            <rect x="4" y="6" width="3" height="3" fill="#168CFF" />
            <rect x="17" y="6" width="3" height="3" fill="#168CFF" />
            <rect x="3" y="9" width="2" height="2" fill="#0A50A1" />
            <rect x="19" y="9" width="2" height="2" fill="#0A50A1" />
            <rect x="11" y="6" width="2" height="2" fill="#9F5B2B" />
            <rect x="10" y="8" width="2" height="3" fill="#8B4F24" />
            <rect x="9" y="11" width="2" height="3" fill="#723E18" />
            <rect x="8" y="14" width="2" height="3" fill="#8B4F24" />
            <rect x="7" y="17" width="2" height="3" fill="#582C0E" />
          </svg>
        );

      case 'strategy':
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            <rect x="4" y="6" width="3" height="4" fill="#CBD5E1" />
            <rect x="9" y="6" width="2" height="4" fill="#CBD5E1" />
            <rect x="13" y="6" width="2" height="4" fill="#CBD5E1" />
            <rect x="17" y="6" width="3" height="4" fill="#CBD5E1" />
            <rect x="11" y="2" width="1" height="5" fill="#07152F" />
            <polygon points="12,2 16,3.5 12,5" fill="#FFD633" />
            <rect x="4" y="10" width="16" height="11" fill="#94A3B8" />
            <rect x="4" y="10" width="16" height="2" fill="#E2E8F0" />
            <rect x="10" y="14" width="4" height="7" fill="#07152F" />
            <rect x="11" y="13" width="2" height="1" fill="#07152F" />
          </svg>
        );

      case 'coop':
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            {/* 3 Red/Crimson player figures matching the reference! */}
            <circle cx="6" cy="9" r="2.5" fill="#EF4444" />
            <path d="M3 18 C3 14, 9 14, 9 18 Z" fill="#DC2626" />
            <circle cx="18" cy="9" r="2.5" fill="#EF4444" />
            <path d="M15 18 C15 14, 21 14, 21 18 Z" fill="#DC2626" />
            <circle cx="12" cy="7" r="3" fill="#F87171" />
            <path d="M8 19 C8 13.5, 16 13.5, 16 19 Z" fill="#B91C1C" />
          </svg>
        );

      case 'more':
      default:
        return (
          <svg viewBox="0 0 24 24" width="36" height="36" className="pixelated" shapeRendering="crispEdges">
            <rect x="3" y="7" width="18" height="10" rx="4" fill="#6366F1" />
            <rect x="4" y="8" width="16" height="8" rx="3" fill="#4F46E5" />
            <rect x="6" y="11" width="4" height="2" fill="#07152F" />
            <rect x="7" y="10" width="2" height="4" fill="#07152F" />
            <rect x="14" y="11" width="2" height="2" fill="#FFD633" />
            <rect x="17" y="10" width="2" height="2" fill="#FF5C7A" />
            <rect x="16" y="13" width="2" height="2" fill="#35D56F" />
          </svg>
        );
    }
  };

  return (
    <div
      onClick={() => {
        retroAudio.playHover();
        onSelect(category);
      }}
      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-center min-h-[110px] ${
        isSelected
          ? 'bg-[#0B2554] border-[#23D9FF] shadow-[0_0_20px_rgba(35,217,255,0.4)] scale-105'
          : 'bg-[#081B3A]/85 hover:bg-[#0B2554] border-[#183B70] hover:border-[#23D9FF] hover:shadow-[0_0_15px_rgba(35,217,255,0.25)] hover:-translate-y-1'
      }`}
    >
      {/* Centered Pixel Icon */}
      <div className="mb-2.5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {renderPixelIcon()}
      </div>

      {/* Legible Title & Subtitle matching the reference */}
      <div className="flex flex-col items-center">
        <span className="font-semibold text-xs text-[#F5F7FF] group-hover:text-[#FFD633] transition-colors leading-tight">
          {category.title}
        </span>
        {category.subtitle && (
          <span className="text-[11px] text-[#F5F7FF]/85 group-hover:text-[#FFD633] transition-colors leading-tight">
            {category.subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
