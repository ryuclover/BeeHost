import React from 'react';
import { Star } from 'lucide-react';

interface PlayerStory {
  id: string;
  name: string;
  avatarSrc: string;
  avatarFallbackColor: string;
  quote: string;
  rating: number;
}

const PLAYER_STORIES: PlayerStory[] = [
  {
    id: 'alex',
    name: 'AlexRPG',
    avatarSrc: '/assets/alex_avatar.png',
    avatarFallbackColor: '#168CFF',
    rating: 5,
    quote: '“Super easy to set up, and our RPG group has been online non-stop. Beehost just works!”',
  },
  {
    id: 'nomad',
    name: 'PixelNomad',
    avatarSrc: '/assets/nomad_avatar.png',
    avatarFallbackColor: '#35D56F',
    rating: 5,
    quote: '“Reliable, fast, and amazing support. We’ve hosted multiple games here. Highly recommend!”',
  },
  {
    id: 'luna',
    name: 'LunaCraft',
    avatarSrc: '/assets/luna_avatar.png',
    avatarFallbackColor: '#FF5C7A',
    rating: 5,
    quote: '“Our community has grown so much thanks to Beehost. Great tools and an even greater team!”',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="community" className="relative py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-7">
        <h2 className="font-extrabold text-xl sm:text-2xl text-[#F5F7FF] tracking-tight uppercase drop-shadow-md my-0">
          REAL PLAYERS. REAL STORIES.
        </h2>
      </div>

      {/* 3 Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAYER_STORIES.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-[#081B3A]/85 border border-[#183B70] rounded-xl flex items-start gap-3.5 hover:border-[#23D9FF]/60 transition-colors"
          >
            {/* Pixel Avatar */}
            <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-[#23D9FF]/40 bg-[#07152F] flex items-center justify-center shadow-xs">
              <img
                src={p.avatarSrc}
                alt={p.name}
                className="w-full h-full object-cover pixelated"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* 5 Stars */}
              <div className="flex items-center gap-0.5 mb-1.5">
                {Array.from({ length: p.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-[#FFD633] text-[#FFD633]"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-xs text-[#E2E8F0] leading-snug font-normal mb-1.5">
                {p.quote}
              </p>

              {/* Author */}
              <span className="text-[11px] font-semibold text-[#BAC7DC] block">
                — {p.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
