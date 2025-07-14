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
  List, // Added for Game List
  Trophy, // Added for Leaderboard
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
          <SheetHeader className="pb-6">
            <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              Game Hub
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 py-4 flex flex-col justify-between">
            <div>
              {/* User Profile Section */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-sm border border-purple-100 dark:border-gray-700 mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 ring-4 ring-purple-100 dark:ring-purple-800">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold text-xl">
                      {getInitials(username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                      {username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Navigation Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg px-4 py-3 bg-transparent hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg group text-gray-800 dark:text-gray-200"
                  onClick={() => { router.push('/leaderboard'); setOpen(false); }} // Next.js routing
                >
                  <Trophy className="mr-3 h-5 w-5 text-purple-600 group-hover:text-purple-700 dark:text-cyan-400 dark:group-hover:text-cyan-300" />
                  Leaderboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg px-4 py-3 bg-transparent hover:bg-cyan-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg group text-gray-800 dark:text-gray-200"
                  onClick={() => { router.push('/'); setOpen(false); }} // Next.js routing
                >
                  <List className="mr-3 h-5 w-5 text-cyan-600 group-hover:text-cyan-700 dark:text-purple-400 dark:group-hover:text-purple-300" />
                  Game List
                </Button>
              </div>
            </div>

            {/* Settings Section - now includes Logout */}
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <Moon className="h-5 w-5 text-purple-600 dark:text-cyan-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>

                  {/* Logout Button moved inside Settings */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
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