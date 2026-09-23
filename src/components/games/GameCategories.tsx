import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { GAME_CATEGORIES, type GameCategory } from '../../data/categories';
import { BeeMascot } from '../mascot/BeeMascot';
import { X, Cpu, HardDrive } from 'lucide-react';
import { retroAudio } from '../effects/SoundEffects';

interface GameCategoriesProps {
  onConfigureGame?: (category: GameCategory) => void;
}

export const GameCategories: React.FC<GameCategoriesProps> = ({ onConfigureGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);

  const handleSelect = (category: GameCategory) => {
    setSelectedCategory(category);
  };

  return (
    <section id="games" className="relative py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 flex flex-col items-center">
        {/* Floating Mascot icon */}
        <div className="mb-2">
          <BeeMascot size={32} showTrail={false} interactive={true} />
        </div>

        <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-[#F5F7FF] tracking-tight uppercase drop-shadow-md my-0" style={{ letterSpacing: '0.02em' }}>
          ALL KINDS OF GAMES. ALL KINDS OF PLAYERS.
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#BAC7DC] font-medium leading-relaxed">
          From epic quests to casual hangouts, Beehost keeps your world online.
        </p>
      </div>

      {/* 6 Category Cards in 1 Row on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {GAME_CATEGORIES.map((cat) => (
          <GameCard
            key={cat.id}
            category={cat}
            isSelected={selectedCategory?.id === cat.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Modal / Quick View if clicked */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07152F]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#091D3E] border-2 border-[#FFD633] rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-4 right-4 p-1.5 text-[#F5F7FF] hover:text-[#FFD633] bg-[#07152F] border border-[#168CFF]/30 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <BeeMascot size={36} />
              <div>
                <span className="text-[11px] text-[#23D9FF] font-semibold uppercase tracking-wider">
                  Beehost Server Matrix
                </span>
                <h3 className="text-xl font-bold text-[#F5F7FF] my-0">
                  {selectedCategory.title} {selectedCategory.subtitle}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#BAC7DC] leading-relaxed mb-4">
              {selectedCategory.description}
            </p>

            <div className="p-3 bg-[#07152F] rounded-xl border border-[#168CFF]/30 mb-4 space-y-2">
              <div className="text-xs font-bold text-[#FFD633] uppercase">
                Featured Compatible Titles:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory.popularGames.map((game, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs bg-[#091D3E] border border-[#23D9FF]/40 text-[#F5F7FF] rounded"
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="flex items-center gap-2 p-2 bg-[#07152F]/60 rounded border border-[#168CFF]/20">
                <Cpu className="w-4 h-4 text-[#23D9FF]" />
                <span className="text-[#F5F7FF]/90 font-medium">Ryzen 9 7950X3D</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#07152F]/60 rounded border border-[#168CFF]/20">
                <HardDrive className="w-4 h-4 text-[#35D56F]" />
                <span className="text-[#F5F7FF]/90 font-medium">NVMe PCIe 4.0</span>
              </div>
            </div>

            <button
              onClick={() => {
                retroAudio.playCoin();
                const cat = selectedCategory;
                setSelectedCategory(null);
                if (onConfigureGame) {
                  onConfigureGame(cat);
                } else {
                  window.location.href = '/plans.html';
                }
              }}
              className="w-full py-3 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all cursor-pointer"
            >
              Deploy {selectedCategory.title} Server →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
