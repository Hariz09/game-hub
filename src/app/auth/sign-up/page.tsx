"use client"
import React from "react";
import { KeyRound, Mail, User, AlertCircle, UserPlus } from "lucide-react";
import { AuthLayout, AuthInput, AuthPasswordInput, AuthButton, ErrorMessage, SuccessMessage, AuthLink } from "@/components/auth/auth-components";
import { useSignup } from "@/hooks/useSignup";

// Confirmation Dialog Component
function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: { email: string; username: string };
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-purple-800/50 max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Confirm Account Creation
        </h3>
        
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Please check your information carefully. The registration token will be marked as used and cannot be used again.
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-purple-700/50 p-4 mb-4">
          <h4 className="text-sm font-semibold text-purple-200 mb-3">Account Details</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-white">{formData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm text-white">{formData.username}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-300">
            After confirmation, please check your email to verify your account before logging in.
          </p>
        </div>

        <div className="flex space-x-3">
          <AuthButton
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </AuthButton>
          <AuthButton
            onClick={onConfirm}
            className="flex-1"
          >
            Create Account
          </AuthButton>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const {
    // State
    isLoading,
    error,
    isSuccess,
    isLocked,
    showConfirmDialog,
    formData,
    
    // Actions
    handleInputChange,
    handleFormSubmit,
    handleConfirmedSubmit,
    setShowConfirmDialog,
    navigateToLogin,
  } = useSignup();

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout
        title="Account Created Successfully"
        subtitle="Congratulations! Your gaming account has been created"
        headerTitle="GameHub"
        headerSubtitle="Your Ultimate Gaming Experience"
      >
        <div className="space-y-6">
          <SuccessMessage
            title="Registration Successful"
            message="Your account has been created. Please check your email to verify your account before logging in."
          />
          
          <AuthButton onClick={navigateToLogin}>
            Go to Login Page
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Account"
      subtitle="Join the gaming community today"
      headerTitle="GameHub"
      headerSubtitle="Your Ultimate Gaming Experience"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <ErrorMessage message={error.message} />
        )}

        <AuthInput
          id="token"
          name="token"
          type="text"
          label="Registration Token *"
          placeholder="Enter your registration token"
          value={formData.token}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          rightElement={<KeyRound className="h-5 w-5 text-gray-400" />}
        />

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          rightElement={<Mail className="h-5 w-5 text-gray-400" />}
        />

        <div className="space-y-2">
          <AuthInput
            id="username"
            name="username"
            type="text"
            label="Username * (letters only, max 12 characters)"
            placeholder="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isLoading || isLocked}
            maxLength={12}
            pattern="[a-zA-Z]*"
            rightElement={<User className="h-5 w-5 text-gray-400" />}
          />
          <p className="text-xs text-gray-400">
            {formData.username.length}/12 characters
          </p>
        </div>

        <AuthPasswordInput
          id="password"
          name="password"
          label="Password * (minimum 8 characters)"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          minLength={8}
          showToggle={true}
        />

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
          <p className="text-sm text-blue-300">
            Please check your email after registration to confirm your account. 
            You won&apos;t be able to log in until your email is verified.
          </p>
        </div>

        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              You need a registration token to create an account. 
              Please contact the administrator to obtain one.
            </p>
          </div>
        </div>

        <AuthButton
          type="submit"
          disabled={isLoading || isLocked}
          loading={isLoading}
          loadingText="Creating Account..."
        >
          {isLocked ? (
            "Account Creation Locked"
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </div>
          )}
        </AuthButton>

        <div className="text-center">
          <span className="text-gray-400">Already have an account? </span>
          <AuthLink onClick={navigateToLogin}>
            Sign in here
          </AuthLink>
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        formData={formData}
      />
    </AuthLayout>
  );
}