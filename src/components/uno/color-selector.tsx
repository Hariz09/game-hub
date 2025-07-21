import React from 'react';
import { CardColor } from '@/types/uno';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ColorSelectorProps {
  isOpen: boolean;
  onColorSelect: (color: CardColor) => void;
}

const colors: { color: CardColor; label: string; bgClass: string }[] = [
  { color: 'red', label: 'Red', bgClass: 'bg-red-500 hover:bg-red-600' },
  { color: 'blue', label: 'Blue', bgClass: 'bg-blue-500 hover:bg-blue-600' },
  { color: 'green', label: 'Green', bgClass: 'bg-green-500 hover:bg-green-600' },
  { color: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-500 hover:bg-yellow-600' },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({ isOpen, onColorSelect }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {colors.map(({ color, label, bgClass }) => (
            <Button
              key={color}
              variant="outline"
              className={`h-16 text-white font-bold ${bgClass} border-2`}
              onClick={() => onColorSelect(color)}
            >
              {label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};