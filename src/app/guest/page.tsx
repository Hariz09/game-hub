'use client'

import Sidebar from "@/components/sidebar/Sidebar";
import { Clock, GamepadIcon, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuestHome() {
  return (
    <main className="w-full min-h-screen relative bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
      <Sidebar />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 md:left-20 w-24 h-24 md:w-32 md:h-32 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-4 md:right-32 w-16 h-16 md:w-24 md:h-24 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-8 md:left-40 w-12 h-12 md:w-20 md:h-20 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 w-full">
          
          {/* Hero Section */}
          <div className="space-y-6 md:space-y-8">
            {/* Icon with enhanced styling */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-purple-500 via-violet-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <GamepadIcon className="w-12 h-12 md:w-16 md:h-16 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-ping">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Heading with improved typography */}
            <div className="space-y-4 md:space-y-6">
              <Badge variant="secondary" className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Coming Soon
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-cyan-900 dark:from-white dark:via-purple-200 dark:to-cyan-200 bg-clip-text text-transparent leading-tight px-2">
                Guest Games
              </h1>
              
              <p className="text-base md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium px-4">
                Experience amazing games without signing up. We&apos;re crafting something 
                <span className="text-purple-600 dark:text-purple-400 font-semibold"> extraordinary</span> for you.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-16 px-4">
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:scale-105">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:rotate-12 transition-transform">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm md:text-base">Instant Play</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Jump right into the action without any delays or complicated setup processes.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:scale-105">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:rotate-12 transition-transform">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm md:text-base">No Signup Required</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Play anonymously with complete privacy. No personal information needed.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:scale-105">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:rotate-12 transition-transform">
                  <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm md:text-base">Diverse Games</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">From puzzles to action games, discover a variety of entertaining experiences.</p>
              </CardContent>
            </Card>
          </div>

            {/* Call to Action */}
            <div className="pt-6 md:pt-8 space-y-3 md:space-y-4 px-4">
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
              Can&apos;t wait to start playing? 
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <Link href="/auth/sign-up">Create Account for Full Access</Link>
            </Button>
            <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
              Get instant access to our complete game library and exclusive features
            </p>
            </div>

        </div>
      </div>
    </main>
  );
}