// components/uno/Card.tsx
import React from 'react';
import { Card as CardType, CardColor } from '@/types/uno';
import { getCardDisplayValue } from '@/utils/uno';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  currentColor?: CardColor;
}

const getCardColorClass = (color: CardColor, currentColor?: CardColor): string => {
  if (color === 'wild') {
    const wildColor = currentColor || 'red';
    switch (wildColor) {
      case 'red': return 'bg-red-500 border-red-600';
      case 'blue': return 'bg-blue-500 border-blue-600';
      case 'green': return 'bg-green-500 border-green-600';
      case 'yellow': return 'bg-yellow-500 border-yellow-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  }
  
  switch (color) {
    case 'red': return 'bg-red-500 border-red-600';
    case 'blue': return 'bg-blue-500 border-blue-600';
    case 'green': return 'bg-green-500 border-green-600';
    case 'yellow': return 'bg-yellow-500 border-yellow-600';
    default: return 'bg-gray-500 border-gray-600';
  }
};

const getSizeClass = (size: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm': return 'w-12 h-16 text-xs';
    case 'md': return 'w-16 h-24 text-sm';
    case 'lg': return 'w-20 h-32 text-base';
    default: return 'w-16 h-24 text-sm';
  }
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  isPlayable = false, 
  isSelected = false, 
  onClick, 
  size = 'md',
  currentColor 
}) => {
  const colorClass = getCardColorClass(card.color, currentColor);
  const sizeClass = getSizeClass(size);
  
  return (
    <div
      className={cn(
        'rounded-lg border-2 flex flex-col items-center justify-center font-bold text-white cursor-pointer transition-all duration-200 shadow-md',
        colorClass,
        sizeClass,
        isPlayable && 'hover:scale-105 hover:shadow-lg ring-2 ring-white/50',
        isSelected && 'scale-105 ring-2 ring-yellow-300',
        !isPlayable && !onClick && 'cursor-default opacity-80'
      )}
      onClick={onClick}
    >
      <div className="text-center">
        {card.value === 'wild' || card.value === 'wild-draw-four' ? (
          <div className="flex flex-col items-center">
            <div className="text-xs">WILD</div>
            {card.value === 'wild-draw-four' && (
              <div className="text-xs">+4</div>
            )}
          </div>
        ) : (
          <div className="text-center">
            {getCardDisplayValue(card)}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardBack: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClass = getSizeClass(size);
  
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-gray-600 bg-gray-800 flex items-center justify-center font-bold text-white shadow-md',
        sizeClass
      )}
    >
      <div className="text-center text-yellow-400">
        UNO
      </div>
    </div>
  );
};