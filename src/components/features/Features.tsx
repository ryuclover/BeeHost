import React from 'react';
import { HandNote } from '../hero/HandNotes';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconType: 'performance' | 'setup' | 'ddos' | 'support' | 'community';
  highlight: string;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'perf',
    title: 'High Performance',
    description: 'Powered by AMD Ryzen 9 7950X3D CPUs and Gen4 NVMe enterprise drives for zero tick drops.',
    iconType: 'performance',
    highlight: '5.7 GHz Boost',
  },
  {
    id: 'setup',
    title: 'Instant Setup',
    description: 'Automatic server provisioning in under 60 seconds right after checkout. Ready to connect.',
    iconType: 'setup',
    highlight: '< 60s Deploy',
  },
  {
    id: 'ddos',
    title: 'DDoS Protection',
    description: 'Multi-terabit edge filtering engineered specifically for UDP game packet flooding and layer 7 exploits.',
    iconType: 'ddos',
    highlight: '3.2 Tbps Filter',
  },
  {
    id: 'support',
    title: 'Friendly Support',
    description: 'Human gaming experts available 24/7 on live chat and Discord. No automated robot loops.',
    iconType: 'support',
    highlight: 'Avg. 3min Reply',
  },
  {
    id: 'comm',
    title: 'Real Community',
    description: 'Join thousands of server owners, mod authors, and players sharing custom scripts and world templates.',
    iconType: 'community',
    highlight: '42,000+ Members',
  },
];

export const Features: React.FC = () => {
  const renderPixelIcon = (type: FeatureItem['iconType']) => {
    switch (type) {
      case 'performance':
        // Pixel Lightning Bolt
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" className="pixelated" shapeRendering="crispEdges">
            <polygon points="13,2 6,13 12,13 10,22 18,10 12,10" fill="#FFD633" />
            <polygon points="13,2 8,11 12,11 10,18 16,10 12,10" fill="#FFF275" />
          </svg>
        );
      case 'setup':
        // Pixel Cog / Gear
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" className="pixelated" shapeRendering="crispEdges">
            <rect x="10" y="3" width="4" height="18" fill="#23D9FF" />
            <rect x="3" y="10" width="18" height="4" fill="#23D9FF" />
            <rect x="5" y="5" width="14" height="14" rx="2" fill="#168CFF" />
            <circle cx="12" cy="12" r="3" fill="#07152F" />
          </svg>
        );
      case 'ddos':
        // Pixel Knight Shield
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" className="pixelated" shapeRendering="crispEdges">
            <polygon points="4,4 20,4 20,13 12,21 4,13" fill="#35D56F" />
            <polygon points="6,6 18,6 18,12 12,18 6,12" fill="#0A2148" />
            <rect x="11" y="7" width="2" height="8" fill="#35D56F" />
            <rect x="8" y="10" width="8" height="2" fill="#35D56F" />
          </svg>
        );
      case 'support':
        // Pixel Friends / Team
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" className="pixelated" shapeRendering="crispEdges">
            <rect x="6" y="6" width="4" height="4" fill="#23D9FF" />
            <rect x="4" y="11" width="8" height="7" fill="#168CFF" />
            <rect x="14" y="6" width="4" height="4" fill="#FFD633" />
            <rect x="12" y="11" width="8" height="7" fill="#FF8A32" />
          </svg>
        );
      case 'community':
        // Pixel Glowing Heart
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" className="pixelated" shapeRendering="crispEdges">
            <rect x="4" y="6" width="6" height="5" rx="1" fill="#FF5C7A" />
            <rect x="14" y="6" width="6" height="5" rx="1" fill="#FF5C7A" />
            <polygon points="4,10 20,10 12,20" fill="#FF5C7A" />
            <rect x="6" y="8" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
          </svg>
        );
    }
  };

  return (
    <section id="features" className="relative py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Decorative Handwritten Note */}
      <div className="absolute right-8 top-4 hidden md:block">
        <HandNote
          text="A kinder, brighter place to play together."
          heart={true}
          rotation={3}
          className="text-lg text-[#23D9FF]"
        />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="font-pixel text-xs text-[#23D9FF] uppercase tracking-widest bg-[#0A2148] px-3.5 py-1.5 rounded-full border border-[#168CFF]/30">
          Built For Gamers, By Gamers
        </span>
        <h2 className="font-pixel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F7FF] tracking-tight uppercase drop-shadow-[0_2px_8px_rgba(22,140,255,0.4)] mt-4 mb-0">
          ENGINEERED FOR PEAK PERFORMANCE
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#F5F7FF]/80 font-medium">
          Every server runs on dedicated NVMe hardware with real-time health telemetry.
        </p>
      </div>

      {/* 5 Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {FEATURES_DATA.map((feat) => (
          <div
            key={feat.id}
            className="group relative p-5 bg-[#0A2148]/65 hover:bg-[#0A2148] border-2 border-[#168CFF]/30 hover:border-[#23D9FF] rounded-xl transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(35,217,255,0.25)] hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#07152F] border border-[#168CFF]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {renderPixelIcon(feat.iconType)}
              </div>

              <h3 className="font-pixel text-sm font-bold text-[#F5F7FF] group-hover:text-[#FFD633] transition-colors mb-2 uppercase tracking-wider my-0">
                {feat.title}
              </h3>

              <p className="text-xs text-[#F5F7FF]/75 leading-relaxed">
                {feat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#168CFF]/20 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-[#35D56F]">
                {feat.highlight}
              </span>
              <span className="text-xs text-[#23D9FF]">✔</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
