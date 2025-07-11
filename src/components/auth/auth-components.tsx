'use client';

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, ReactNode, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility function untuk menggabungkan className

// Input field dengan styling yang konsisten
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, rightElement, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-200">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 border-green-700/50 focus:border-green-500 focus:outline-none transition-colors bg-gray-800/50 text-white placeholder-gray-400",
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
          <p className="text-sm text-red-300" role="alert" aria-live="polite">
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
      className="text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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

// Button dengan styling yang konsisten dan optimasi Next.js
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  href?: string; // Support untuk navigation
  replace?: boolean; // Support untuk router.replace
  prefetch?: boolean; // Support untuk prefetching
}

export function AuthButton({ 
  loading = false, 
  loadingText = "Memproses...", 
  variant = 'primary',
  children, 
  disabled,
  className,
  href,
  replace = false,
  prefetch = true,
  onClick,
  ...props 
}: AuthButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const isLoading = loading || isPending;
  
  const baseClasses = "w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border border-green-700/50 focus:ring-green-500"
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

// Error message component dengan better accessibility
interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div 
      className={cn("bg-red-900/50 border border-red-700/50 rounded-lg p-3", className)}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm text-red-300">{message}</p>
    </div>
  );
}

// Success message component dengan better accessibility
interface SuccessMessageProps {
  title: string;
  message: string;
  className?: string;
}

export function SuccessMessage({ title, message, className }: SuccessMessageProps) {
  return (
    <div 
      className={cn("bg-green-900/50 border border-green-700/50 rounded-lg p-4", className)}
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-lg font-semibold text-green-200 mb-2">{title}</h3>
      <p className="text-sm text-green-300">{message}</p>
    </div>
  );
}

// Link component yang menggunakan Next.js Link dengan optimasi
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
  const router = useRouter();
  
  const baseClasses = "text-green-400 hover:text-green-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded";
  
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
    // Gunakan Next.js Link untuk internal navigation
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
    
    // Gunakan anchor tag untuk external links
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

// Loading Skeleton untuk better UX
export function AuthInputSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-12 w-full bg-gray-700 rounded-xl animate-pulse"></div>
    </div>
  );
}

// Card wrapper untuk form authentication
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-lg border border-green-700/30 rounded-2xl p-8 shadow-2xl",
      className
    )}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {subtitle && (
          <p className="text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}