import React from 'react';
import type { Plan } from '../../data/plans';
import { Check } from 'lucide-react';
import { retroAudio } from '../effects/SoundEffects';

interface PricingCardProps {
  plan: Plan;
  billingCycle: 'monthly' | 'yearly';
  onSelectPlan: (plan: Plan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingCycle,
  onSelectPlan,
}) => {
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const isExplorer = plan.isPopular;

  const handleClick = () => {
    retroAudio.playCoin();
    onSelectPlan(plan);
  };

  return (
    <div
      className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl transition-all duration-300 ${
        isExplorer
          ? 'bg-[#091D3E] border-2 border-[#FFD633] shadow-[0_0_30px_rgba(255,214,51,0.3)] z-10'
          : 'bg-[#081B3A]/85 border border-[#183B70] hover:border-[#23D9FF] hover:shadow-lg'
      }`}
    >
      {/* Most Popular Badge on Explorer */}
      {isExplorer && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#FFD633] text-[#07152F] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
          Most Popular
        </div>
      )}

      {/* Plan Header & Price */}
      <div>
        <h3 className="text-xl font-bold text-[#F5F7FF] my-0">
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-1 my-3">
          <span
            className={`text-3xl sm:text-4xl font-extrabold ${
              isExplorer ? 'text-[#FFD633]' : 'text-[#F5F7FF]'
            }`}
          >
            ${price.toFixed(2)}
          </span>
          <span className="text-xs text-[#BAC7DC] font-medium">
            /mo
          </span>
        </div>

        {/* Feature List with clean green checkmarks */}
        <ul className="space-y-2.5 my-5 text-left">
          {plan.features.slice(0, 4).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#E2E8F0]">
              <Check className="w-4 h-4 text-[#35D56F] shrink-0 stroke-[3]" />
              <span className="font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button matching the reference image */}
      <button
        onClick={handleClick}
        className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center active:scale-95 ${
          isExplorer
            ? 'bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] shadow-[0_0_15px_rgba(255,214,51,0.5)]'
            : 'bg-[#091D3E] hover:bg-[#168CFF]/20 text-[#F5F7FF] border border-[#168CFF]/60 hover:border-[#23D9FF]'
        }`}
      >
        Get Started
      </button>
    </div>
  );
};
