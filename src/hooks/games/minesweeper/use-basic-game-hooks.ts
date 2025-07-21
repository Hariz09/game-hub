import { useCallback, useState } from 'react';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<string>('');

  const announce = useCallback((message: string) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  }, []);

  return { announcements, announce };
};

export const useFocusedCell = () => {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  return { focusedCell, setFocusedCell };
};

export const useTouchHandlers = () => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  return {
    longPressTimer,
    setLongPressTimer,
    touchStartTime,
    setTouchStartTime,
  };
};