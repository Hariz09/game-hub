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

interface SidebarProps {
  // No props needed - component manages its own state
}

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

const Sidebar = ({}: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const supabase = createClient();

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

  if (authLoading) {
    return (
      <>
        <SidebarButton onClick={toggleSidebar} />
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="left" className="w-80 flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
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
          <SheetContent side="left" className="w-80 flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
            <SheetHeader className="pb-6">
              <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Game Hub
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Welcome to Game Hub</h3>
                  <p className="text-muted-foreground mb-6">Please log in to access your profile and start playing</p>
                  <Button 
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
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
        <SheetContent side="left" className="w-80 flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Game Hub
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 py-4 space-y-8 overflow-y-auto">
            {/* User Profile Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-slate-600">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-4 ring-blue-100 dark:ring-blue-800">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl">
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

            {/* Settings Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Log Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                    You will need to log in again to access your account and continue playing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-slate-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <LogoutButton />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;