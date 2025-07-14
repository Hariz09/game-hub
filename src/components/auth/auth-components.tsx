'use client';

import { Eye, EyeOff, Gamepad2, Trophy, Users, Zap, Shield, Star } from "lucide-react";
import { forwardRef, ReactNode, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Input field dengan styling gaming theme
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, rightElement, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-bold text-purple-200 tracking-wide">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 border-purple-700/50 focus:border-cyan-400 focus:outline-none transition-all duration-300 bg-gray-800/60 text-white placeholder-gray-400 shadow-lg hover:shadow-purple-500/20 focus:shadow-cyan-400/30",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400 font-medium" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

// Password input dengan toggle visibility
interface AuthPasswordInputProps extends Omit<AuthInputProps, 'type' | 'rightElement'> {
  showToggle?: boolean;
}

export function AuthPasswordInput({ showToggle = true, ...props }: AuthPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleButton = showToggle ? (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  ) : undefined;

  return (
    <AuthInput
      {...props}
      type={showPassword ? "text" : "password"}
      rightElement={toggleButton}
    />
  );
}

// Button dengan styling gaming theme
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  href?: string;
  replace?: boolean;
  prefetch?: boolean;
}

export function AuthButton({ 
  loading = false, 
  loadingText = "Processing...", 
  variant = 'primary',
  children, 
  disabled,
  className,
  href,
  replace = false,
  onClick,
  ...props 
}: AuthButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const isLoading = loading || isPending;
  
  const baseClasses = "w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 tracking-wide";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white focus:ring-purple-500 shadow-purple-500/30 hover:shadow-purple-500/50",
    secondary: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-purple-700/50 focus:ring-purple-500 shadow-gray-500/30",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-red-500/30"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      e.preventDefault();
      startTransition(() => {
        if (replace) {
          router.replace(href);
        } else {
          router.push(href);
        }
      });
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Error message component
interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div 
      className={cn("bg-red-900/50 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm", className)}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm text-red-300 font-medium">{message}</p>
    </div>
  );
}

// Success message component
interface SuccessMessageProps {
  title: string;
  message: string;
  className?: string;
}

export function SuccessMessage({ title, message, className }: SuccessMessageProps) {
  return (
    <div 
      className={cn("bg-green-900/50 border border-green-500/50 rounded-lg p-4 backdrop-blur-sm", className)}
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-lg font-bold text-green-300 mb-2">{title}</h3>
      <p className="text-sm text-green-400">{message}</p>
    </div>
  );
}

// Link component untuk gaming theme
interface AuthLinkProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export function AuthLink({ 
  href, 
  onClick, 
  children, 
  className, 
  prefetch = true,
  replace = false,
  scroll = true
}: AuthLinkProps) {
  const [isPending, startTransition] = useTransition();
  
  const baseClasses = "text-cyan-400 hover:text-cyan-300 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded hover:underline";
  
  if (onClick) {
    const handleClick = () => {
      startTransition(() => {
        onClick();
      });
    };

    return (
      <button 
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(baseClasses, isPending && "opacity-70", className)}
      >
        {children}
      </button>
    );
  }

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link 
          href={href}
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
          className={cn(baseClasses, className)}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <a 
        href={href} 
        className={cn(baseClasses, className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <span className={cn(baseClasses, className)}>
      {children}
    </span>
  );
}

// Loading Skeleton untuk gaming theme
export function AuthInputSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-12 w-full bg-gray-700 rounded-xl animate-pulse"></div>
    </div>
  );
}

// Card wrapper untuk gaming authentication
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto bg-gray-900/90 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/20",
      className
    )}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
            <Gamepad2 size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">{title}</h1>
        {subtitle && (
          <p className="text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Gaming Layout Component
interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function AuthLayout({ 
  children, 
  headerTitle = "GameHub",
  headerSubtitle = "Your Ultimate Gaming Experience"
}: AuthLayoutProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Counter animations - only run on client
  useEffect(() => {
    if (!isClient) return;

    const targetPlayers = 1234567;
    const targetGames = 25000;
    const duration = 2000;
    const steps = 60;
    
    const playerIncrement = targetPlayers / steps;
    const gamesIncrement = targetGames / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newPlayerCount = Math.min(Math.floor(playerIncrement * currentStep), targetPlayers);
      const newGamesCount = Math.min(Math.floor(gamesIncrement * currentStep), targetGames);
      
      setPlayerCount(newPlayerCount);
      setGamesCount(newGamesCount);
      
      if (newPlayerCount >= targetPlayers && newGamesCount >= targetGames) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isClient]);

  // Pre-defined particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: '10%', top: '20%', delay: '0s', duration: '2s' },
    { left: '20%', top: '80%', delay: '0.5s', duration: '2.5s' },
    { left: '70%', top: '30%', delay: '1s', duration: '3s' },
    { left: '80%', top: '70%', delay: '1.5s', duration: '2.2s' },
    { left: '30%', top: '40%', delay: '0.8s', duration: '2.8s' },
    { left: '90%', top: '15%', delay: '1.2s', duration: '3.2s' },
    { left: '15%', top: '60%', delay: '0.3s', duration: '2.7s' },
    { left: '60%', top: '85%', delay: '1.8s', duration: '2.4s' },
    { left: '45%', top: '10%', delay: '0.7s', duration: '2.9s' },
    { left: '85%', top: '45%', delay: '1.4s', duration: '2.1s' },
    { left: '25%', top: '25%', delay: '0.2s', duration: '3.1s' },
    { left: '75%', top: '75%', delay: '1.6s', duration: '2.3s' },
    { left: '35%', top: '90%', delay: '0.9s', duration: '2.6s' },
    { left: '95%', top: '50%', delay: '1.1s', duration: '2.8s' },
    { left: '5%', top: '35%', delay: '0.4s', duration: '3.3s' },
    { left: '55%', top: '65%', delay: '1.3s', duration: '2.2s' },
    { left: '65%', top: '5%', delay: '0.6s', duration: '2.7s' },
    { left: '40%', top: '55%', delay: '1.7s', duration: '2.5s' },
    { left: '15%', top: '95%', delay: '1.9s', duration: '2.4s' },
    { left: '85%', top: '25%', delay: '0.1s', duration: '3.4s' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Gaming background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20 animate-pulse">
          <Gamepad2 size={120} className="text-purple-400" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-bounce">
          <Trophy size={80} className="text-cyan-400" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-10">
          <Zap size={200} className="text-yellow-500" />
        </div>
        <div className="absolute bottom-1/4 left-20 opacity-15">
          <Shield size={100} className="text-blue-400" />
        </div>
        <div className="absolute top-20 right-1/4 opacity-10">
          <Star size={60} className="text-pink-400" />
        </div>
      </div>

      {/* Animated background particles with fixed positions */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Main gaming auth card */}
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-800/50 overflow-hidden">
          {/* Header with brand and stats */}
          <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 px-8 py-6 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-cyan-700/20"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-white/20 rounded-full p-4 shadow-lg">
                  <Gamepad2 size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">{headerTitle}</h1>
              <p className="text-purple-200 text-sm mb-4">{headerSubtitle}</p>
              
              {/* Stats counters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Users size={16} className="text-cyan-300" />
                    <div>
                      <p className="text-white text-sm font-bold">
                        {playerCount.toLocaleString()}
                      </p>
                      <p className="text-cyan-300 text-xs">Players</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy size={16} className="text-yellow-300" />
                    <div>
                      <p className="text-white text-sm font-bold">
                        {gamesCount.toLocaleString()}
                      </p>
                      <p className="text-yellow-300 text-xs">Games</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="px-8 py-8">{children}</div>
        </div>

        {/* Decorative gaming elements */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-cyan-500 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-1/4 -right-2 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-ping"></div>
      </div>
    </div>
  );
}