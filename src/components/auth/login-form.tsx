"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/use-login";
import { AuthLayout, AuthInput, AuthPasswordInput, AuthButton, ErrorMessage, AuthLink } from "./auth-components";

export function LoginForm({}: React.ComponentPropsWithoutRef<"div">) {
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useLogin();

  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      // Add any guest login logic here if needed
      // For now, just redirect to /guest
      router.push("/guest");
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to explore your gaming universe"
      headerTitle="GameHub"
      headerSubtitle="Your Ultimate Gaming Experience"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email/Username Field */}
        <AuthInput
          id="emailOrUsername"
          type="text"
          label="Email or Username"
          placeholder="Enter your email or username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-bold text-purple-200 tracking-wide">
              Password
            </label>
            <AuthLink onClick={handleForgotPassword} className="text-sm">
              Forgot password?
            </AuthLink>
          </div>
          <AuthPasswordInput
            id="password"
            label=""
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            showToggle={true}
          />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Login Button */}
        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Signing in..."
          disabled={isLoading || !emailOrUsername.trim() || !password.trim()}
          variant="primary"
        >
          Sign In
        </AuthButton>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-700/50 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-700/50 to-transparent"></div>
        </div>

        {/* Guest Login Button */}
        <AuthButton
          type="button"
          onClick={handleGuestLogin}
          loading={isGuestLoading}
          loadingText="Entering as guest..."
          disabled={isGuestLoading || isLoading}
          variant="secondary"
          className="w-full"
        >
          Continue as Guest
        </AuthButton>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Don&apos;t have an account?{' '}
            <AuthLink onClick={handleSignUp}>
              Sign up here
            </AuthLink>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}