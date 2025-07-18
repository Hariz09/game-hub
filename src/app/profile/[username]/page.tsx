'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Trophy, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  // Function to get user initials
  const getInitials = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Background Pattern */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-cyan-500 to-indigo-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-gray-800 shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold text-4xl">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 ring-4 ring-white dark:ring-gray-800">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {username}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Game Hub Member
                </p>
                
                {/* Stats Row */}
                <div className="flex justify-center sm:justify-start space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-cyan-400">
                      127
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Games Played
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-purple-400">
                      89
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Wins
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-yellow-400">
                      #12
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rank
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                {/* Activity Items */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Won a game of Tic-Tac-Toe
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* About Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-purple-600 dark:text-cyan-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  About
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to {username}&apos;s profile! This player loves competitive gaming and is always up for a challenge.
              </p>
            </div>

            {/* Member Since Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-5 w-5 text-cyan-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Member Since
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                January 2024
              </p>
            </div>

            {/* Achievements Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Achievements
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      First Win
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Won your first game
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Streak Master
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Won 10 games in a row
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;