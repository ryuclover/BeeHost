import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { PLANS, type Plan } from '../../data/plans';
import { Sliders } from 'lucide-react';
import { retroAudio } from '../effects/SoundEffects';

interface PricingProps {
  onSelectPlan: (plan: Plan) => void;
  onOpenCalculator?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPlan,
  onOpenCalculator,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
    retroAudio.playToggle();
  };

  return (
    <section id="plans" className="relative py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-7">
        <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-[#F5F7FF] tracking-tight uppercase drop-shadow-md my-0">
          SIMPLE PLANS. POWERFUL POSSIBILITIES.
        </h2>

        {/* Toggle Switch */}
        <div className="mt-5 inline-flex items-center p-1 bg-[#081B3A] border border-[#183B70] rounded-lg">
          <button
            onClick={() => handleToggle('monthly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-[#FFD633] text-[#07152F] shadow-sm'
                : 'text-[#BAC7DC] hover:text-[#F5F7FF]'
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => handleToggle('yearly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-[#FFD633] text-[#07152F] shadow-sm'
                : 'text-[#BAC7DC] hover:text-[#F5F7FF]'
            }`}
          >
            <span>Yearly</span>
          </button>

          <span className="ml-2 mr-1 px-2 py-0.5 text-[10px] font-bold bg-[#35D56F] text-[#07152F] rounded-full">
            Save 20%
          </span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>

      {/* Calculator Link */}
      {onOpenCalculator && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              retroAudio.playHover();
              onOpenCalculator();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#081B3A] hover:bg-[#0B2554] border border-[#183B70] hover:border-[#FFD633] text-xs text-[#BAC7DC] hover:text-[#F5F7FF] transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FFD633]" />
            <span>Need custom RAM or dedicated CPU cores? Open Hardware Configurator →</span>
          </button>
        </div>
      )}
    </section>
  );
};
