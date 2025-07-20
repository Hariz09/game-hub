import { useCallback, useState, useRef } from 'react';

export const useSoundSystem = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [soundEnabled, initAudioContext]);

  const playClickSound = useCallback(() => createBeep(800, 0.1), [createBeep]);
  const playFlagSound = useCallback(() => createBeep(1000, 0.15), [createBeep]);
  const playRevealSound = useCallback(() => createBeep(600, 0.08), [createBeep]);
  const playExplosionSound = useCallback(() => {
    createBeep(150, 0.3, 0.5);
    setTimeout(() => createBeep(100, 0.4, 0.3), 100);
  }, [createBeep]);
  
  const playVictorySound = useCallback(() => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, index) => {
      setTimeout(() => createBeep(freq, 0.3, 0.4), index * 200);
    });
  }, [createBeep]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClickSound,
    playFlagSound,
    playRevealSound,
    playExplosionSound,
    playVictorySound
  };
};