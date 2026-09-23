import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Menu } from 'lucide-react';
import { BeehostLogo } from '../brand/BeehostLogo';
import { HEADER_LINKS } from '../../data/navigation';
import { retroAudio } from '../effects/SoundEffects';

interface HeaderProps {
  activeTab?: string;
  onOpenMobileMenu?: () => void;
  onGetStartedClick?: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'home',
  onOpenMobileMenu,
  onGetStartedClick,
  onSearchClick,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    retroAudio.enabled = next;
    if (next) retroAudio.playCoin();
  };

  const handleLinkClick = (href: string, label: string) => {
    retroAudio.playHover();
    // Support navigation to separate HTML tab pages if available, or anchor scroll
    const pageMap: Record<string, string> = {
      'Games': '/games.html',
      'Plans': '/plans.html',
      'Features': '/features.html',
      'Community': '/community.html',
      'Support': '/support.html',
    };

    if (window.location.pathname.endsWith('.html') && window.location.pathname !== '/index.html') {
      window.location.href = pageMap[label] || '/';
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else if (pageMap[label]) {
      window.location.href = pageMap[label];
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#081B3A]/95 backdrop-blur-md border-b border-[#183B70] shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-1.5 text-[#F5F7FF] hover:text-[#FFD633] bg-[#07152F] rounded border border-[#168CFF]/30 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <a
            href="/"
            onClick={() => retroAudio.playHover()}
            className="flex items-center group cursor-pointer"
          >
            <BeehostLogo size="md" showMascot={true} />
          </a>
        </div>

        {/* Center: Nav links matching reference */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {HEADER_LINKS.map((link) => {
            const isActive = activeTab.toLowerCase() === link.label.toLowerCase();
            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href, link.label)}
                className={`text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#FFD633]'
                    : 'text-[#BAC7DC] hover:text-[#F5F7FF]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right actions matching reference: search, Log In, Get Started */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sound toggle (retro gamer feature) */}
          <button
            onClick={toggleSound}
            className="p-1.5 text-[#BAC7DC] hover:text-[#FFD633] bg-[#091D3E] rounded-md border border-[#183B70] transition-all cursor-pointer"
            title={soundOn ? 'SFX Audio Enabled' : 'SFX Audio Muted'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              retroAudio.playHover();
              if (onSearchClick) onSearchClick();
            }}
            className="p-1.5 text-[#BAC7DC] hover:text-[#F5F7FF] bg-[#091D3E] rounded-md border border-[#183B70] transition-all cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Log In */}
          <button
            onClick={() => {
              retroAudio.playHover();
              alert('Beehost Game Control Panel: Redirecting to auth portal...');
            }}
            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-[#F5F7FF] bg-[#091D3E] hover:bg-[#0B2554] border border-[#183B70] rounded-md transition-all cursor-pointer"
          >
            Log In
          </button>

          {/* Yellow CTA Button */}
          <button
            onClick={() => {
              retroAudio.playCoin();
              if (onGetStartedClick) {
                onGetStartedClick();
              } else {
                window.location.href = '/plans.html';
              }
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-[#07152F] bg-[#FFD633] hover:bg-[#ffe066] rounded-md shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
};
