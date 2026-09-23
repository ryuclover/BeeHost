import React from 'react';
import { X, Home, Gamepad2, Layers, Settings, Users, Heart, MessageSquare } from 'lucide-react';
import { BeeMascot } from '../mascot/BeeMascot';
import { WoodenSign } from '../hero/WoodenSign';
import { NAV_ITEMS } from '../../data/navigation';
import { retroAudio } from '../effects/SoundEffects';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    const iconClass = 'w-4 h-4 text-[#23D9FF]';
    switch (iconName) {
      case 'home': return <Home className={iconClass} />;
      case 'gamepad': return <Gamepad2 className={iconClass} />;
      case 'layers': return <Layers className={iconClass} />;
      case 'settings': return <Settings className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'message-square': return <MessageSquare className={iconClass} />;
      default: return <Home className={iconClass} />;
    }
  };

  const handleNavClick = (href: string) => {
    retroAudio.playHover();
    onClose();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07152F]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-[#0A2148] border-r-2 border-[#168CFF] h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#168CFF]/20">
            <div className="flex items-center gap-2">
              <BeeMascot size={36} />
              <span className="font-pixel text-lg font-bold text-[#F5F7FF]">Beehost</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#F5F7FF] hover:text-[#FFD633] bg-[#07152F] rounded border border-[#168CFF]/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-6 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm font-pixel text-[#F5F7FF] hover:text-[#07152F] hover:bg-[#FFD633] transition-colors"
              >
                {getIcon(item.iconName)}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom CTA & Sign */}
        <div className="pt-6 border-t border-[#168CFF]/20 flex flex-col gap-4">
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="w-full py-3 bg-[#FFD633] text-[#07152F] font-pixel text-xs uppercase tracking-wider font-bold rounded shadow-[0_0_15px_rgba(255,214,51,0.5)] active:scale-95 transition-all text-center"
          >
            Start Your Server →
          </button>

          <WoodenSign
            lines={['SAME GAMES.', 'NEW WORLDS.']}
            variant="plaque"
            heart={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
