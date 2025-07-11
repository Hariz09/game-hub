// hooks/useNavigation.ts
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigateTo = (path: string, key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    startTransition(() => {
      try {
        router.push(path);
      } catch (error) {
        console.error('Navigation failed:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    });
  };

  const navigateBack = (fallbackPath?: string) => {
    setLoadingStates(prev => ({ ...prev, back: true }));
    
    startTransition(() => {
      try {
        // Check if there's history to go back to
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else if (fallbackPath) {
          // If no history, go to fallback path
          router.push(fallbackPath);
        } else {
          // Default fallback to home page
          router.push('/');
        }
      } catch (error) {
        console.error('Navigation back failed:', error);
        // Fallback to home page on error
        if (fallbackPath) {
          router.push(fallbackPath);
        } else {
          router.push('/');
        }
      } finally {
        setLoadingStates(prev => ({ ...prev, back: false }));
      }
    });
  };

  const replace = (path: string, key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    startTransition(() => {
      try {
        router.replace(path);
      } catch (error) {
        console.error('Navigation replace failed:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    });
  };

  const refresh = () => {
    setLoadingStates(prev => ({ ...prev, refresh: true }));
    
    startTransition(() => {
      try {
        router.refresh();
      } catch (error) {
        console.error('Navigation refresh failed:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, refresh: false }));
      }
    });
  };

  const isLoading = (key: string) => loadingStates[key] || isPending;
  const isAnyLoading = Object.values(loadingStates).some(Boolean) || isPending;
  const isBackLoading = isLoading('back');

  return { 
    navigateTo, 
    navigateBack, 
    replace, 
    refresh, 
    isLoading, 
    isAnyLoading, 
    isBackLoading 
  };
};