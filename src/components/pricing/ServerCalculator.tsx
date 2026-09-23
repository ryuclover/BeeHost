import React, { useState } from 'react';
import { X, Server, Cpu, Globe } from 'lucide-react';
import { BeeMascot } from '../mascot/BeeMascot';
import { retroAudio } from '../effects/SoundEffects';

interface ServerCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (config: { ram: number; slots: number; region: string; price: number }) => void;
}

export const ServerCalculator: React.FC<ServerCalculatorProps> = ({
  isOpen,
  onClose,
  onDeploy,
}) => {
  const [ram, setRam] = useState(6);
  const [slots, setSlots] = useState(25);
  const [region, setRegion] = useState('BR - São Paulo');

  if (!isOpen) return null;

  // $2.40 base + $1.80 per GB RAM + $0.05 per slot
  const calculatedPrice = (2.4 + ram * 1.8 + slots * 0.04).toFixed(2);

  const handleDeploy = () => {
    retroAudio.playSuccess();
    onDeploy({
      ram,
      slots,
      region,
      price: parseFloat(calculatedPrice),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07152F]/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0A2148] border-2 border-[#168CFF] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(22,140,255,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#F5F7FF] hover:text-[#FFD633] bg-[#07152F] border border-[#168CFF]/30 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BeeMascot size={40} />
          <div>
            <h3 className="font-pixel text-lg sm:text-xl font-bold text-[#F5F7FF] my-0">
              Custom Server Rig Calculator
            </h3>
            <p className="text-xs text-[#23D9FF] font-pixel mt-0.5">
              Fine-tune your hardware on demand
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* RAM Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-pixel text-xs">
              <span className="text-[#F5F7FF]/90 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#23D9FF]" /> Dedicated DDR5 RAM
              </span>
              <span className="text-[#FFD633] text-sm font-bold">{ram} GB</span>
            </div>
            <input
              type="range"
              min="2"
              max="32"
              step="2"
              value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
              className="w-full h-2 bg-[#07152F] rounded-lg appearance-none cursor-pointer accent-[#FFD633]"
            />
            <div className="flex justify-between text-[10px] text-[#F5F7FF]/50 font-pixel mt-1">
              <span>2 GB</span>
              <span>16 GB</span>
              <span>32 GB</span>
            </div>
          </div>

          {/* Slots Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-pixel text-xs">
              <span className="text-[#F5F7FF]/90 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#35D56F]" /> Concurrent Player Slots
              </span>
              <span className="text-[#35D56F] text-sm font-bold">{slots} Slots</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              className="w-full h-2 bg-[#07152F] rounded-lg appearance-none cursor-pointer accent-[#35D56F]"
            />
            <div className="flex justify-between text-[10px] text-[#F5F7FF]/50 font-pixel mt-1">
              <span>5 slots</span>
              <span>50 slots</span>
              <span>100 slots</span>
            </div>
          </div>

          {/* Datacenter Region */}
          <div>
            <label className="block font-pixel text-xs text-[#F5F7FF]/90 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#7447E8]" /> Datacenter Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'BR - São Paulo (7ms)', ping: 'Ultra Low' },
                { name: 'US - Virginia (85ms)', ping: 'Global' },
                { name: 'EU - Frankfurt (120ms)', ping: 'EU Hub' },
                { name: 'AP - Singapore (190ms)', ping: 'Asia' },
              ].map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => setRegion(loc.name)}
                  className={`p-2.5 rounded-lg border text-left font-pixel text-[10px] transition-all cursor-pointer ${
                    region === loc.name
                      ? 'bg-[#168CFF]/20 border-[#23D9FF] text-[#F5F7FF]'
                      : 'bg-[#07152F] border-[#168CFF]/20 text-[#F5F7FF]/70 hover:border-[#168CFF]/50'
                  }`}
                >
                  <div className="font-bold text-[#F5F7FF]">{loc.name}</div>
                  <div className="text-[#35D56F]">{loc.ping}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Output & CTA */}
        <div className="mt-8 pt-5 border-t border-[#168CFF]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-pixel text-[10px] text-[#F5F7FF]/60 uppercase">
              Estimated Monthly Cost
            </div>
            <div className="font-pixel text-3xl font-extrabold text-[#FFD633]">
              ${calculatedPrice}
              <span className="text-xs text-[#F5F7FF]/70">/mo</span>
            </div>
          </div>

          <button
            onClick={handleDeploy}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-pixel text-xs uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,214,51,0.5)] transition-all cursor-pointer"
          >
            Deploy Custom Rig →
          </button>
        </div>
      </div>
    </div>
  );
};
