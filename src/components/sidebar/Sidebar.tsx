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
import { useRouter } from 'next/navigation'; // Import useRouter

interface SidebarButtonProps {
  onClick: () => void;
}

// SidebarButton component with enhanced styling
const SidebarButton = ({ onClick }: SidebarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-lg rounded-xl hover:bg-white hover:shadow-xl dark:bg-slate-900/90 dark:hover:bg-slate-800 transition-all duration-200 p-3 h-auto border border-gray-200/50 dark:border-gray-700/50"
      onClick={onClick}
    >
      <Menu className="text-gray-700 dark:text-gray-200 size-5"/>
    </Button>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter(); // Initialize useRouter

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Toggle dark mode and save preference
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Get user initials for avatar
  const getInitials = useCallback((username: string | undefined) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  const toggleSidebar = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  // Common SheetContent styles for the purple-cyan theme and custom scrollbar
  const sheetContentClass = `
    w-80 flex flex-col bg-gradient-to-br from-purple-50 to-cyan-100 dark:from-gray-950 dark:to-gray-900
    [--scrollbar-track-color:theme(colors.purple.50)] dark:[--scrollbar-track-color:theme(colors.gray.900)]
    [--scrollbar-thumb-color:theme(colors.purple.400)] dark:[--scrollbar-thumb-color:theme(colors.cyan.600)]
    [--scrollbar-thumb-hover-color:theme(colors.purple.500)] dark:[--scrollbar-thumb-hover-color:theme(colors.cyan.500)]
    scrollbar-thin scrollbar-track-[var(--scrollbar-track-color)] scrollbar-thumb-[var(--scrollbar-thumb-color)]
    hover:scrollbar-thumb-[var(--scrollbar-thumb-hover-color)] scrollbar-thumb-rounded-full
  `;

  if (authLoading) {
    return (
      <>
        <SidebarButton onClick={toggleSidebar} />
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="left" className={sheetContentClass}>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-cyan-400 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // If user is not authenticated, show login prompt
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
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Welcome to Game Hub</h3>
                  <p className="text-muted-foreground mb-6">Please log in to access your profile and start playing</p>
                  <Button
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Log In
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
              {/* Clickable User Profile Section */}
              <Button
                variant="ghost"
                className="w-full p-0 h-auto bg-transparent hover:bg-transparent"
                onClick={() => { router.push(`/profile/${username}`); setOpen(false); }}
              >
                <div className="w-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-200 dark:ring-purple-700">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold text-lg">
                        {getInitials(username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {username}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {email}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-cyan-400 mt-1">
                        View Profile →
                      </p>
                    </div>
                  </div>
                </div>
              </Button>

              {/* Main Navigation Buttons - Grid Layout for better spacing */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant="ghost"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 transition-all duration-200 rounded-xl group border border-purple-200/50 dark:border-purple-700/50"
                  onClick={() => { router.push('/leaderboard'); setOpen(false); }}
                >
                  <Trophy className="h-6 w-6 text-purple-600 group-hover:text-purple-700 dark:text-purple-400 dark:group-hover:text-purple-300" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Leaderboard</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-800/40 dark:hover:to-cyan-700/40 transition-all duration-200 rounded-xl group border border-cyan-200/50 dark:border-cyan-700/50"
                  onClick={() => { router.push('/'); setOpen(false); }}
                >
                  <List className="h-6 w-6 text-cyan-600 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300" />
                  <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Game List</span>
                </Button>
              </div>

              {/* Chat Button - Full width for emphasis */}
              <Button
                variant="ghost"
                className="w-full h-16 flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/40 dark:hover:to-blue-800/40 transition-all duration-200 rounded-xl group border border-indigo-200/50 dark:border-indigo-700/50"
                onClick={() => { router.push('/chat'); setOpen(false); }}
              >
                <MessageCircle className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300" />
                <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">Chat</span>
              </Button>
            </div>

            {/* Settings Section - Compact and bottom-aligned */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Settings</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {isDarkMode ? (
                        <Moon className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                      ) : (
                        <Sun className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>

                  {/* Logout Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">
                          Are you sure you want to log out?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          You will need to log in again to access your account and continue playing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
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