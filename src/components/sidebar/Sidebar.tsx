'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  LogOut,
  Loader2,
  Menu,
  User,
  Settings,
  List,
  Trophy, 
  MessageCircle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/client";
import type { User as UserType } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

interface SidebarButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

// Enhanced SidebarButton with loading animation
const SidebarButton = ({ onClick, isLoading = false }: SidebarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      className={`
        fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-lg rounded-xl 
        hover:bg-white hover:shadow-xl dark:bg-slate-900/90 dark:hover:bg-slate-800 
        transition-all duration-300 ease-out p-3 h-auto border border-gray-200/50 
        dark:border-gray-700/50 transform hover:scale-105 active:scale-95
        ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
      `}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="text-purple-600 dark:text-cyan-400 size-5 animate-spin" />
      ) : (
        <Menu className="text-gray-700 dark:text-gray-200 size-5 transition-colors duration-200"/>
      )}
    </Button>
  );
};

// Loading skeleton component for user profile
const UserProfileSkeleton = () => (
  <div className="w-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Loading skeleton for navigation buttons
const NavigationSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-2 gap-3">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
    <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
  </div>
);

// Animated navigation button component
const NavButton = ({ 
  onClick, 
  className, 
  children, 
  delay = 0 
}: { 
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Button
      variant="ghost"
      className={`
        ${className} 
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        hover:scale-105 active:scale-95 hover:shadow-lg
      `}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Initialize dark mode with loading state
  useEffect(() => {
    const initializeTheme = async () => {
      setThemeLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100)); // Smooth transition
      
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      setIsDarkMode(initialDarkMode);
      document.documentElement.classList.toggle('dark', initialDarkMode);
      setThemeLoading(false);
    };

    initializeTheme();
  }, []);

  // Set up auth state listener with enhanced loading
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setAuthLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // Add a small delay for smooth loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setUser(session?.user ?? null);
        
        // Trigger content animation sequence
        setTimeout(() => setContentReady(true), 100);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthLoading(true);
        setContentReady(false);
        
        // Add transition delay for smooth state changes
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setUser(session?.user ?? null);
        setAuthLoading(false);
        
        setTimeout(() => setContentReady(true), 100);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Toggle dark mode with loading animation
  const toggleDarkMode = useCallback(async () => {
    setThemeLoading(true);
    
    // Add slight delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
    
    setThemeLoading(false);
  }, []);

  // Enhanced navigation with loading states - keep sidebar open during navigation
  const handleNavigation = useCallback(async (path: string) => {
    setNavigationLoading(true);
    
    // Show loading animation for a minimum time to provide visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    router.push(path);
    
    // Close sidebar after navigation starts
    setTimeout(() => {
      setOpen(false);
      setNavigationLoading(false);
    }, 200);
  }, [router]);

  // Get user initials for avatar
  const getInitials = useCallback((username: string | undefined) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (!authLoading) {
      setOpen(prev => !prev);
    }
  }, [authLoading]);

  // Common SheetContent styles with enhanced animations
  const sheetContentClass = `
    w-80 flex flex-col bg-gradient-to-br from-purple-50 to-cyan-100 dark:from-gray-950 dark:to-gray-900
    [--scrollbar-track-color:theme(colors.purple.50)] dark:[--scrollbar-track-color:theme(colors.gray.900)]
    [--scrollbar-thumb-color:theme(colors.purple.400)] dark:[--scrollbar-thumb-color:theme(colors.cyan.600)]
    [--scrollbar-thumb-hover-color:theme(colors.purple.500)] dark:[--scrollbar-thumb-hover-color:theme(colors.cyan.500)]
    scrollbar-thin scrollbar-track-[var(--scrollbar-track-color)] scrollbar-thumb-[var(--scrollbar-thumb-color)]
    hover:scrollbar-thumb-[var(--scrollbar-thumb-hover-color)] scrollbar-thumb-rounded-full
    transition-all duration-300 ease-out
  `;

  // Loading state UI
  if (authLoading) {
    return (
      <>
        <SidebarButton onClick={toggleSidebar} isLoading={true} />
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="left" className={sheetContentClass}>
            <SheetHeader className="pb-6">
              <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Game Hub
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-cyan-400 mx-auto" />
                  <div className="absolute inset-0 h-12 w-12 border-2 border-purple-200 dark:border-cyan-200 rounded-full animate-ping mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // If user is not authenticated, show enhanced login prompt
  if (!user) {
    return (
      <>
        <SidebarButton onClick={toggleSidebar} />
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="left" className={sheetContentClass}>
            <SheetHeader className="pb-6">
              <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                Game Hub
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto transform transition-transform duration-300 hover:scale-110">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-full opacity-20 animate-ping"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to Game Hub</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-sm">Please log in to access your profile and start playing amazing games</p>
                  <Button
                    onClick={() => handleNavigation('/auth/login')}
                    disabled={navigationLoading}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {navigationLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      'Log In'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  const username = user.user_metadata?.username || 'Anonymous';
  const email = user.email || '';

  return (
    <>
      <SidebarButton onClick={toggleSidebar} />
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className={sheetContentClass}>
          <SheetHeader className="pb-4">
            <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              Game Hub
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 py-2 flex flex-col">
            <div className="flex-1 space-y-4">
              {/* User Profile Section with Loading State */}
              {!contentReady ? (
                <UserProfileSkeleton />
              ) : (
                <div className={`transform transition-all duration-500 ease-out ${contentReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Button
                    variant="ghost"
                    className="w-full p-0 h-auto bg-transparent hover:bg-transparent"
                    onClick={() => handleNavigation(`/profile/${username}`)}
                    disabled={navigationLoading}
                  >
                    <div className={`w-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-gray-700 transition-all duration-300 ${navigationLoading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-200 dark:ring-purple-700 transition-all duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold text-lg">
                            {getInitials(username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate transition-colors duration-200">
                            {username}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {email}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-cyan-400 mt-1 flex items-center">
                            {navigationLoading ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Loading profile...
                              </>
                            ) : (
                              <>
                                View Profile 
                                <span className="ml-1">→</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              )}

              {/* Main Navigation Buttons with Staggered Animation */}
              {!contentReady ? (
                <NavigationSkeleton />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <NavButton
                      onClick={() => handleNavigation('/leaderboard')}
                      delay={100}
                      className={`h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl group border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 ${navigationLoading ? 'opacity-60 cursor-not-allowed' : 'hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 cursor-pointer'}`}
                    >
                      {navigationLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Loading...</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="h-6 w-6 text-purple-600 group-hover:text-purple-700 dark:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-200" />
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Leaderboard</span>
                        </>
                      )}
                    </NavButton>

                    <NavButton
                      onClick={() => handleNavigation('/')}
                      delay={150}
                      className={`h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-xl group border border-cyan-200/50 dark:border-cyan-700/50 transition-all duration-300 ${navigationLoading ? 'opacity-60 cursor-not-allowed' : 'hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-800/40 dark:hover:to-cyan-700/40 cursor-pointer'}`}
                    >
                      {navigationLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-cyan-600 dark:text-cyan-400" />
                          <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">Loading...</span>
                        </>
                      ) : (
                        <>
                          <List className="h-6 w-6 text-cyan-600 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 transition-colors duration-200" />
                          <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Game List</span>
                        </>
                      )}
                    </NavButton>
                  </div>

                  <NavButton
                    onClick={() => handleNavigation('/chat')}
                    delay={200}
                    className={`w-full h-16 flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl group border border-indigo-200/50 dark:border-indigo-700/50 transition-all duration-300 ${navigationLoading ? 'opacity-60 cursor-not-allowed' : 'hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/40 dark:hover:to-blue-800/40 cursor-pointer'}`}
                  >
                    {navigationLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                        <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">Loading Chat...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors duration-200" />
                        <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">Chat</span>
                      </>
                    )}
                  </NavButton>
                </div>
              )}
            </div>

            {/* Settings Section with Enhanced Animation */}
            <div className={`mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 transform transition-all duration-700 ease-out ${contentReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Settings</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      {themeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-cyan-400" />
                      ) : isDarkMode ? (
                        <Moon className="h-4 w-4 text-purple-600 dark:text-cyan-400 transition-colors duration-300" />
                      ) : (
                        <Sun className="h-4 w-4 text-yellow-600 transition-colors duration-300" />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                      disabled={themeLoading}
                      className="transition-opacity duration-200"
                    />
                  </div>

                  {/* Logout Button with Loading State */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        Log Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">
                          Are you sure you want to log out?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          You will need to log in again to access your account and continue playing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <LogoutButton />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;