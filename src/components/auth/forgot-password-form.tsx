"use client";

import { createClient } from "@/lib/supabase/client";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput, AuthButton, ErrorMessage, SuccessMessage, AuthLink } from "./auth-components";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Password reset instructions have been sent"
        headerTitle="GameHub"
        headerSubtitle="Password Recovery"
      >
        <div className="space-y-6">
          <SuccessMessage
            title="Email Sent Successfully"
            message="If you're registered with email and password, you'll receive a password reset email shortly. Please check your inbox and follow the instructions."
          />

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-blue-300 mb-2">
              <strong>Didn't receive the email?</strong>
            </p>
            <ul className="text-xs text-blue-400 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <AuthButton onClick={handleBackToLogin}>
            Back to Login
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email and we'll send you a link to reset your password"
      headerTitle="GameHub"
      headerSubtitle="Password Recovery"
    >
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <AuthInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
          error={error ?? undefined}
        />

        {error && <ErrorMessage message={error} />}

        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Sending..."
        >
          Send Reset Email
        </AuthButton>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-700/50 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-700/50 to-transparent"></div>
        </div>

        {/* Back to login link */}
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Remember your password?{' '}
            <AuthLink onClick={handleBackToLogin}>
              Sign in here
            </AuthLink>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}