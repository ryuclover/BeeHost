import React from 'react';
import { BeeMascot } from '../mascot/BeeMascot';
import { WoodenSign } from '../hero/WoodenSign';
import { HandNote } from '../hero/HandNotes';
import { retroAudio } from '../effects/SoundEffects';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#07152F] border-t-2 border-[#168CFF]/30 pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#7447E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-[#168CFF]/20">
          
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <BeeMascot size={56} showTrail={true} interactive={true} />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="font-pixel text-2xl font-bold tracking-wider text-[#F5F7FF]">
                  Beehost
                </span>
                <span className="px-2 py-0.5 font-pixel text-[10px] bg-[#35D56F]/20 text-[#35D56F] border border-[#35D56F]/40 rounded-full">
                  All Systems Online
                </span>
              </div>
              <p className="font-pixel text-xs text-[#23D9FF] uppercase tracking-widest mt-1">
                Play Together. Host Anywhere.
              </p>
              <p className="text-xs text-[#F5F7FF]/70 mt-2 max-w-sm">
                High-performance game hosting nodes distributed globally. Built for modern creators and guilds.
              </p>
            </div>
          </div>

          {/* Wooden Sign on Footer */}
          <div className="flex items-center gap-6">
            <WoodenSign
              lines={['GOOD GAMES.', 'BETTER PEOPLE.']}
              variant="plaque"
              heart={true}
              className="w-56"
            />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs font-pixel">
          <div>
            <h4 className="text-[#FFD633] uppercase tracking-wider mb-4 font-bold my-0">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-[#F5F7FF]/75">
              <li><a href="#home" onClick={() => retroAudio.playHover()} className="hover:text-[#FFD633] transition-colors">Home</a></li>
              <li><a href="#games" onClick={() => retroAudio.playHover()} className="hover:text-[#FFD633] transition-colors">Game Matrix</a></li>
              <li><a href="#plans" onClick={() => retroAudio.playHover()} className="hover:text-[#FFD633] transition-colors">Pricing Plans</a></li>
              <li><a href="#features" onClick={() => retroAudio.playHover()} className="hover:text-[#FFD633] transition-colors">Infrastructure</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FFD633] uppercase tracking-wider mb-4 font-bold my-0">
              Community
            </h4>
            <ul className="space-y-2.5 text-[#F5F7FF]/75">
              <li><a href="#community" onClick={() => retroAudio.playHover()} className="hover:text-[#23D9FF] transition-colors">Discord Server (42k)</a></li>
              <li><a href="#community" onClick={() => retroAudio.playHover()} className="hover:text-[#23D9FF] transition-colors">Community Forum</a></li>
              <li><a href="#community" onClick={() => retroAudio.playHover()} className="hover:text-[#23D9FF] transition-colors">Modpack Repository</a></li>
              <li><a href="#community" onClick={() => retroAudio.playHover()} className="hover:text-[#23D9FF] transition-colors">Guild Partner Program</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FFD633] uppercase tracking-wider mb-4 font-bold my-0">
              Values
            </h4>
            <ul className="space-y-2.5 text-[#F5F7FF]/75">
              <li className="text-[#23D9FF]">Play</li>
              <li className="text-[#23D9FF]">Create</li>
              <li className="text-[#23D9FF]">Share</li>
              <li className="text-[#23D9FF]">Belong Together</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FFD633] uppercase tracking-wider mb-4 font-bold my-0">
              Status & Nodes
            </h4>
            <div className="space-y-2 text-[#F5F7FF]/75">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#35D56F]" />
                <span>Global Uptime: 99.99%</span>
              </div>
              <div>DDoS Filter: <span className="text-[#35D56F]">Active (3.2 Tbps)</span></div>
              <div>Latency Monitor: <span className="text-[#23D9FF]">7ms - 45ms</span></div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-[#168CFF]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="font-pixel text-[10px] text-[#F5F7FF]/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Beehost Networks Inc. All rights reserved.
          </p>

          <HandNote
            text="More worlds. Brighter tomorrows."
            heart={true}
            rotation={1}
            className="text-base text-[#23D9FF]"
          />
        </div>

      </div>
    </footer>
  );
};
