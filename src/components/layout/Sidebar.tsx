import React, { useState } from 'react';
import {
  Home,
  Gamepad2,
  Layers,
  Settings,
  Users,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { BeeMascot } from '../mascot/BeeMascot';
import { WoodenSign } from '../hero/WoodenSign';
import { HandNote } from '../hero/HandNotes';
import { NAV_ITEMS } from '../../data/navigation';
import { retroAudio } from '../effects/SoundEffects';

export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('home');

  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 transition-transform group-hover:scale-110 ${
      isSelected ? 'text-[#07152F] stroke-[2.5]' : 'text-[#23D9FF]'
    }`;
    switch (iconName) {
      case 'home':
        return <Home className={iconClass} />;
      case 'gamepad':
        return <Gamepad2 className={iconClass} />;
      case 'layers':
        return <Layers className={iconClass} />;
      case 'settings':
        return <Settings className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'heart':
        return <Heart className={iconClass} />;
      case 'message-square':
        return <MessageSquare className={iconClass} />;
      default:
        return <Home className={iconClass} />;
    }
  };

  const handleClick = (id: string, href: string) => {
    setActiveItem(id);
    retroAudio.playHover();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden xl:flex flex-col justify-between w-64 shrink-0 bg-[#0A2148]/85 backdrop-blur-md border-r-2 border-[#168CFF]/35 min-h-screen p-5 z-20 shadow-2xl relative overflow-hidden">
      {/* Background ambient night glow */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#7447E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#23D9FF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Section */}
      <div className="relative z-10 flex flex-col items-center text-center pb-6 border-b border-[#168CFF]/20">
        <div className="relative mb-2">
          <BeeMascot size={72} showTrail={true} interactive={true} />
        </div>

        <h1 className="font-pixel text-2xl font-bold tracking-wider text-[#F5F7FF] drop-shadow-[0_2px_10px_rgba(22,140,255,0.5)] my-0">
          Beehost
        </h1>

        <p className="font-pixel text-[9px] uppercase tracking-widest text-[#23D9FF] mt-1.5 font-semibold">
          Play Together. Host Anywhere.
        </p>

        {/* Live Status indicator */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#07152F]/80 border border-[#35D56F]/40 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#35D56F] animate-pulse" />
          <span className="text-[10px] font-pixel text-[#35D56F] uppercase tracking-wider">
            Nodes Online
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="relative z-10 py-6 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isSelected = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id, item.href)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-left transition-all duration-200 cursor-pointer group relative ${
                isSelected
                  ? 'bg-[#FFD633] text-[#07152F] font-bold shadow-[0_0_15px_rgba(255,214,51,0.5)]'
                  : 'text-[#F5F7FF]/80 hover:text-[#FFD633] hover:bg-[#07152F]/70 border border-transparent hover:border-[#168CFF]/30'
              }`}
            >
              {getIcon(item.iconName, isSelected)}
              <span className="font-pixel text-xs tracking-wider">
                {item.label}
              </span>

              {/* Indicator arrow on active */}
              {isSelected && (
                <span className="ml-auto font-pixel text-xs text-[#07152F]">
                  ▶
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Handwritten Note in Sidebar */}
      <div className="relative z-10 my-4 text-center">
        <HandNote
          text="Good Servers Brighter Adventures"
          heart={true}
          rotation={-3}
          className="text-base text-[#23D9FF]/95"
        />
      </div>

      {/* Wooden Sign at Bottom of Sidebar */}
      <div className="relative z-10 pt-2 flex justify-center">
        <WoodenSign
          lines={['SAME GAMES.', 'NEW WORLDS.']}
          variant="plaque"
          heart={true}
          className="w-full"
        />
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 mt-4 text-center">
        <span className="font-pixel text-[8px] text-[#F5F7FF]/40 uppercase tracking-widest">
          © Beehost Gaming Corp
        </span>
      </div>
    </aside>
  );
};
