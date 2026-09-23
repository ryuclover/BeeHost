import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BeehostLogo } from '../brand/BeehostLogo';
import { WoodenSign } from './WoodenSign';
import { HandNote } from './HandNotes';
import { retroAudio } from '../effects/SoundEffects';

interface HeroProps {
  onStartServer: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartServer }) => {
  const handleCtaClick = () => {
    retroAudio.playCoin();
    onStartServer();
  };

  return (
    <section id="home" className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-6">
      {/* Outer Hero Card with rounded corners and subtle border */}
      <div className="relative rounded-2xl overflow-hidden border border-[#183B70] shadow-2xl min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
        
        {/* Exact Hero Pixel Art Background Artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/exact_hero_art.png"
            alt="Beehost Pixel Art World"
            className="w-full h-full object-cover object-center pixelated"
          />
          {/* Subtle gradient overlay on left for text legibility while maintaining illustration vibrancy */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07152F]/90 via-[#07152F]/55 to-transparent w-full sm:w-2/3 pointer-events-none" />
        </div>

        {/* Top/Main Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col items-start max-w-lg">
          
          {/* 3D Distinctive Beehost Logo */}
          <div className="mb-3">
            <BeehostLogo size="hero" showMascot={false} />
          </div>

          {/* Headline in bold gaming font */}
          <h1
            className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F5F7FF] uppercase tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] my-0"
            style={{ fontFamily: "'Silkscreen', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            PLAY TOGETHER.<br />
            HOST ANYWHERE.
          </h1>

          {/* Clean, highly legible subtext */}
          <p className="mt-3.5 text-xs sm:text-sm md:text-base text-[#F5F7FF] font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-md">
            Powerful game servers for every adventure.<br />
            Fast. Reliable. Easy to use.
          </p>

          {/* Yellow CTA Button matching reference */}
          <button
            onClick={handleCtaClick}
            className="mt-6 px-6 py-2.5 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-md shadow-lg hover:shadow-xl hover:scale-102 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-[#fff275]"
          >
            <span>Start Your Server</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Right side floating elements: Floating note & wooden sign */}
        <div className="absolute top-6 right-6 z-10 hidden sm:block">
          <HandNote
            text="Better Happier People"
            heart={true}
            rotation={4}
            className="text-lg text-[#F5F7FF]"
          />
        </div>

        <div className="absolute bottom-6 right-6 z-10 hidden md:block">
          <WoodenSign
            lines={[
              'EXPLORE',
              'CREATE',
              'SURVIVE',
              'BATTLE',
              'BUILD',
              'TOGETHER',
            ]}
            variant="vertical"
            className="scale-90 origin-bottom-right"
          />
        </div>

      </div>
    </section>
  );
};
