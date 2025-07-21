"use client"
import React from "react";
import { KeyRound, Mail, User, AlertCircle, UserPlus, CheckCircle, Loader2, XCircle } from "lucide-react";
import { AuthLayout, AuthInput, AuthPasswordInput, AuthButton, ErrorMessage, SuccessMessage, AuthLink } from "@/components/auth/auth-components";
import { useSignup } from "@/hooks/auth/use-signup";

// Type definitions
interface TokenData {
  role?: string;
  // Add other properties as needed
}

interface TokenValidationResult {
  isValid: boolean;
  error?: string;
  tokenData?: TokenData;
}

// Enhanced AuthInput wrapper with error highlighting
function EnhancedAuthInput({ 
  hasError, 
  errorMessage,
  validationStatus,
  ...props 
}: {
  hasError: boolean;
  errorMessage?: string | null;
  validationStatus?: 'validating' | 'valid' | 'error' | null;
} & React.ComponentProps<typeof AuthInput>) {
  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return props.rightElement;
    }
  };

  return (
    <div className="space-y-1">
      <AuthInput
        {...props}
        rightElement={getValidationIcon()}
        className={`${props.className || ''} ${
          hasError 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
            : validationStatus === 'valid' 
              ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20'
              : ''
        }`}
      />
      {hasError && errorMessage && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}

// Password validation rules
const passwordRules = [
  {
    id: 'length',
    label: 'At least 8 characters',
    validator: (password: string) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    validator: (password: string) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    validator: (password: string) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    validator: (password: string) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*)',
    validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  },
  {
    id: 'noSpaces',
    label: 'No spaces allowed',
    validator: (password: string) => !/\s/.test(password)
  }
];

// Password Rules Component
function PasswordRules({ password }: { password: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 space-y-2">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Password Requirements:</h4>
      <div className="space-y-1.5">
        {passwordRules.map((rule) => {
          const isValid = rule.validator(password);
          const hasValue = password.length > 0;
          
          return (
            <div key={rule.id} className="flex items-center space-x-2">
              {hasValue ? (
                isValid ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                )
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-gray-500 flex-shrink-0" />
              )}
              <span className={`text-xs ${
                hasValue 
                  ? isValid 
                    ? 'text-green-300' 
                    : 'text-red-300'
                  : 'text-gray-400'
              }`}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
      {password.length > 0 && (
        <div className="pt-2 border-t border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordRules.filter(rule => rule.validator(password)).length === passwordRules.length
                    ? 'bg-green-500'
                    : passwordRules.filter(rule => rule.validator(password)).length >= passwordRules.length / 2
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ 
                  width: `${(passwordRules.filter(rule => rule.validator(password)).length / passwordRules.length) * 100}%` 
                }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {passwordRules.filter(rule => rule.validator(password)).length}/{passwordRules.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced AuthPasswordInput wrapper with error highlighting
function EnhancedAuthPasswordInput({ 
  hasError, 
  errorMessage,
  showRules = false,
  ...props 
}: {
  hasError: boolean;
  errorMessage?: string | null;
  showRules?: boolean;
} & React.ComponentProps<typeof AuthPasswordInput>) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <AuthPasswordInput
          {...props}
          className={`${props.className || ''} ${
            hasError 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
              : ''
          }`}
        />
        {hasError && errorMessage && (
          <p className="text-sm text-red-400 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
      {showRules && (
        <PasswordRules password={String(props.value || '')} />
      )}
    </div>
  );
}

// Token Validation Status Component
function TokenValidationStatus({ 
  tokenValidationResult, 
  isValidatingToken, 
  hasFieldError,
  getFieldError 
}: {
  tokenValidationResult: TokenValidationResult | null;
  isValidatingToken: boolean;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string | null;
}) {
  // Don't show anything if no token is entered
  if (!tokenValidationResult && !isValidatingToken && !hasFieldError('token')) {
    return null;
  }

  // Show loading state
  if (isValidatingToken) {
    return (
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
          <p className="text-sm text-blue-300">
            Validating registration token...
          </p>
        </div>
      </div>
    );
  }

  // Show valid token
  if (tokenValidationResult?.isValid) {
    return (
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-300">
            ✓ Valid registration token for {tokenValidationResult.tokenData?.role || 'user'} role
          </p>
        </div>
      </div>
    );
  }

  // Show invalid token with detailed error
  if (tokenValidationResult?.error || hasFieldError('token')) {
    const errorMessage = getFieldError('token') || tokenValidationResult?.error || 'Invalid registration token';
    
    return (
      <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-red-300 font-medium">
              Invalid Registration Token
            </p>
            <p className="text-sm text-red-200">
              {errorMessage}
            </p>
            <div className="text-xs text-red-300/80">
              <p>• Make sure you copied the token correctly</p>
              <p>• Check that the token hasn&apos;t expired</p>
              <p>• Contact the administrator if you need a new token</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Confirmation Dialog Component
function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData,
  isLoading 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: { email: string; username: string };
  isLoading: boolean;
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
            disabled={isLoading}
          >
            Cancel
          </AuthButton>
          <AuthButton
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
            loading={isLoading}
            loadingText="Creating..."
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
    isValidatingToken,
    tokenValidationResult,
    
    // Actions
    handleInputChange,
    handleFormSubmit,
    handleConfirmedSubmit,
    setShowConfirmDialog,
    navigateToLogin,
    
    // Field validation helpers
    hasFieldError,
    getFieldError,
  } = useSignup();

  // Get token validation status for visual feedback
  const getTokenValidationStatus = () => {
    if (!formData.token) return null;
    if (isValidatingToken) return 'validating';
    if (tokenValidationResult?.isValid) return 'valid';
    if (tokenValidationResult?.error || hasFieldError('token')) return 'error';
    return null;
  };

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
        {error && !error.field && (
          <ErrorMessage message={error.message} />
        )}

        <EnhancedAuthInput
          id="token"
          name="token"
          type="text"
          label="Registration Token *"
          placeholder="Enter your registration token"
          value={formData.token}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          hasError={hasFieldError('token')}
          errorMessage={getFieldError('token')}
          validationStatus={getTokenValidationStatus()}
          rightElement={<KeyRound className="h-5 w-5 text-gray-400" />}
        />

        <TokenValidationStatus
          tokenValidationResult={tokenValidationResult}
          isValidatingToken={isValidatingToken}
          hasFieldError={hasFieldError}
          getFieldError={getFieldError}
        />

        <EnhancedAuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          hasError={hasFieldError('email')}
          errorMessage={getFieldError('email')}
          rightElement={<Mail className="h-5 w-5 text-gray-400" />}
        />

        <div className="space-y-2">
          <EnhancedAuthInput
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
            hasError={hasFieldError('username')}
            errorMessage={getFieldError('username')}
            rightElement={<User className="h-5 w-5 text-gray-400" />}
          />
          <p className="text-xs text-gray-400">
            {formData.username.length}/12 characters
          </p>
        </div>

        <EnhancedAuthPasswordInput
          id="password"
          name="password"
          label="Password *"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          minLength={8}
          showToggle={true}
          showRules={true}
          hasError={hasFieldError('password')}
          errorMessage={getFieldError('password')}
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
          disabled={isLoading || isLocked || !tokenValidationResult?.isValid}
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
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}