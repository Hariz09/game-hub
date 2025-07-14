"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  AuthLayout,
  AuthPasswordInput, 
  AuthButton, 
  ErrorMessage, 
  SuccessMessage 
} from "./auth-components";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must have at least 8 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return null;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Password and confirmation password do not match");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect after 3 seconds to give user time to see success message
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred while updating password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Updated Successfully"
        subtitle="You'll be redirected to the main page"
        headerTitle="GameHub"
        headerSubtitle="Password Reset Complete"
      >
        <div className="space-y-6">
          <SuccessMessage
            title="Success!"
            message="Your password has been successfully updated. You'll be redirected to the main page in a few seconds."
          />

          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-green-300 mb-2">
              <strong>What&apos;s next?</strong>
            </p>
            <ul className="text-xs text-green-400 space-y-1">
              <li>• You&apos;re now logged in with your new password</li>
              <li>• Make sure to remember your new password</li>
              <li>• Consider using a password manager for security</li>
            </ul>
          </div>

          {/* Progress bar */}
          <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300 ease-out"
              style={{ 
                width: '100%',
                animation: 'progress 3s linear forwards'
              }}
            />
          </div>

          <style jsx>{`
            @keyframes progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a strong password to secure your account"
      headerTitle="GameHub"
      headerSubtitle="Password Reset"
    >
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <AuthPasswordInput
          id="password"
          label="New Password"
          placeholder="Enter your new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <AuthPasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* Password requirements */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-3 font-semibold">Password Requirements:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className={`flex items-center text-xs ${password.length >= 8 ? 'text-green-400' : 'text-gray-400'}`}>
              <span className="mr-2 text-base">{password.length >= 8 ? '✓' : '○'}</span>
              8+ characters
            </div>
            <div className={`flex items-center text-xs ${/(?=.*[a-z])/.test(password) ? 'text-green-400' : 'text-gray-400'}`}>
              <span className="mr-2 text-base">{/(?=.*[a-z])/.test(password) ? '✓' : '○'}</span>
              Lowercase letter
            </div>
            <div className={`flex items-center text-xs ${/(?=.*[A-Z])/.test(password) ? 'text-green-400' : 'text-gray-400'}`}>
              <span className="mr-2 text-base">{/(?=.*[A-Z])/.test(password) ? '✓' : '○'}</span>
              Uppercase letter
            </div>
            <div className={`flex items-center text-xs ${/(?=.*\d)/.test(password) ? 'text-green-400' : 'text-gray-400'}`}>
              <span className="mr-2 text-base">{/(?=.*\d)/.test(password) ? '✓' : '○'}</span>
              Number
            </div>
          </div>
        </div>

        {/* Password strength indicator */}
        {password && (
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Password Strength:</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => {
                const strength = getPasswordStrength(password);
                return (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      level <= strength
                        ? strength === 1
                          ? 'bg-red-500'
                          : strength === 2
                          ? 'bg-orange-500'
                          : strength === 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-gray-400">
              {getPasswordStrengthText(getPasswordStrength(password))}
            </p>
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Updating password..."
          disabled={!password || !confirmPassword}
        >
          Update Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/(?=.*[a-z])/.test(password)) strength++;
  if (/(?=.*[A-Z])/.test(password)) strength++;
  if (/(?=.*\d)/.test(password)) strength++;
  return strength;
}

function getPasswordStrengthText(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
}