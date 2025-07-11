'use client';

import { TreePine, Leaf, Users } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  headerTitle = "HisTree",
  headerSubtitle = "Terhubung dengan akar keluarga Anda"
}: AuthLayoutProps) {
  const [memberCount, setMemberCount] = useState(0);

  // Counter animation from 0 to 213
  useEffect(() => {
    const targetCount = 213;
    const duration = 3000; // 3 seconds
    const steps = 60;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(Math.floor(increment * currentStep), targetCount);
      setMemberCount(newCount);
      
      if (newCount >= targetCount) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Elemen dekoratif latar belakang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20">
          <TreePine size={120} className="text-green-400" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <Leaf size={80} className="text-green-300" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-10">
          <TreePine size={200} className="text-amber-600" />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Main auth card */}
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-800/30 overflow-hidden">
          {/* Header with brand and counter */}
          <div className="bg-gradient-to-r from-green-700 to-green-800 px-8 py-6 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-800/30 to-amber-700/20"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-white/10 rounded-full p-3">
                  <Users size={32} className="text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{headerTitle}</h1>
              <p className="text-green-200 text-sm mb-3">{headerSubtitle}</p>
              
              {/* Member counter */}
              <div className="bg-white/10 rounded-full px-4 py-2 inline-block">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-green-200" />
                  <span className="text-green-200 text-sm font-semibold">
                    {memberCount.toLocaleString()} anggota keluarga
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="px-8 py-8">{children}</div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-500 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 -left-1 w-3 h-3 bg-green-400 rounded-full opacity-40"></div>
      </div>
    </div>
  );
}