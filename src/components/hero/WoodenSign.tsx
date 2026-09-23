import React from 'react';

interface WoodenSignProps {
  lines: string[];
  variant?: 'vertical' | 'plaque' | 'post';
  className?: string;
  heart?: boolean;
}

export const WoodenSign: React.FC<WoodenSignProps> = ({
  lines,
  variant = 'vertical',
  className = '',
  heart = false,
}) => {
  if (variant === 'vertical') {
    return (
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        {/* Wooden Post Behind */}
        <div className="w-3.5 h-full absolute -top-3 bg-[#4a2811] border-x border-[#2c1507] shadow-inner" />

        {/* Stack of Wooden Planks */}
        <div className="relative z-10 flex flex-col gap-1 w-full max-w-[140px]">
          {lines.map((word, idx) => (
            <div
              key={idx}
              className="relative px-3 py-1.5 bg-[#8b4f24] border-2 border-[#3b1d08] text-center shadow-md transform hover:scale-105 transition-transform"
              style={{
                boxShadow: 'inset 2px 2px 0px #b26b38, inset -2px -2px 0px #241103, 0 3px 6px rgba(0,0,0,0.5)',
                transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 0.8}deg)`,
              }}
            >
              {/* Iron Nails */}
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#26160d] border border-[#523321] rounded-none shadow-xs" />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#26160d] border border-[#523321] rounded-none shadow-xs" />

              {/* Engraved Carved Text */}
              <span
                className="font-pixel text-[10px] md:text-xs font-bold tracking-wider uppercase"
                style={{
                  color: '#ffd699',
                  textShadow: '1px 1px 0px #241103, -1px -1px 0px #5c3014',
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Plaque variant (e.g. for sidebar and footer)
  return (
    <div
      className={`relative px-4 py-3 bg-[#8b4f24] border-2 border-[#3b1d08] shadow-lg rounded-none transform hover:-translate-y-0.5 transition-transform ${className}`}
      style={{
        boxShadow: 'inset 2px 2px 0px #b26b38, inset -2px -2px 0px #241103, 0 4px 10px rgba(0,0,0,0.5)',
      }}
    >
      {/* 4 Iron Corner Nails */}
      <span className="absolute left-1.5 top-1.5 w-1.5 h-1.5 bg-[#26160d] border border-[#523321]" />
      <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-[#26160d] border border-[#523321]" />
      <span className="absolute left-1.5 bottom-1.5 w-1.5 h-1.5 bg-[#26160d] border border-[#523321]" />
      <span className="absolute right-1.5 bottom-1.5 w-1.5 h-1.5 bg-[#26160d] border border-[#523321]" />

      <div className="flex flex-col items-center justify-center text-center">
        {lines.map((line, idx) => (
          <span
            key={idx}
            className="font-pixel text-[11px] font-bold tracking-wider leading-tight uppercase"
            style={{
              color: '#ffd699',
              textShadow: '1px 1px 0px #241103, -1px -1px 0px #5c3014',
            }}
          >
            {line}
          </span>
        ))}
        {heart && (
          <span
            className="text-sm mt-1"
            style={{ color: '#ff8a80', textShadow: '1px 1px 0px #3c1e09' }}
          >
            ♡
          </span>
        )}
      </div>
    </div>
  );
};
