import { useCallback, useState } from 'react';

export const useParticleSystem = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    type: 'explosion' | 'confetti' | 'flag';
    timestamp: number;
  }>>([]);

  const addParticles = useCallback((x: number, y: number, type: 'explosion' | 'confetti' | 'flag') => {
    const newParticles = Array.from({ length: type === 'explosion' ? 8 : 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      type,
      timestamp: Date.now()
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => 
        !newParticles.some(newP => newP.id === p.id)
      ));
    }, type === 'confetti' ? 3000 : 1000);
  }, []);

  const clearParticles = useCallback(() => {
    setParticles([]);
  }, []);

  return { particles, addParticles, clearParticles };
};