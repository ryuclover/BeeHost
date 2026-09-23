import React from 'react';

interface HandNoteProps {
  text: string;
  heart?: boolean;
  className?: string;
  rotation?: number;
}

export const HandNote: React.FC<HandNoteProps> = ({
  text,
  heart = true,
  className = '',
  rotation = -4,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center select-none font-hand text-lg md:text-xl text-[#F5F7FF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 hover:opacity-100 hover:scale-105 transition-all ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <span className="leading-tight text-center">{text}</span>
      {heart && (
        <span className="text-sm text-[#FF8A32] hover:text-[#FFD633] transition-colors mt-0.5">
          ♡
        </span>
      )}
    </div>
  );
};
