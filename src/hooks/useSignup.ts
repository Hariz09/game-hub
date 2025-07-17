"use client"
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000;

interface SupabaseError {
  message: string;
  status?: number;
}

interface FormData {
  email: string;
  username: string;
  password: string;
  token: string;
}

interface SignupError {
  message: string;
  timestamp?: number;
  field?: string; // Add field to identify which input caused the error
}

interface RegistrationMetadata {
  username: string;
  token: string;
  tokenId: string;
  role: string;
}

interface TokenValidationResult {
  isValid: boolean;
  tokenData?: any;
  error?: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenValidationResult, setTokenValidationResult] = useState<TokenValidationResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    token: "",
  });

  const supabase = createClient();
  const router = useRouter();

  // Check for existing lockout on component mount
  useEffect(() => {
    const signupLockedUntil = localStorage.getItem('signupLockedUntil');
    if (signupLockedUntil) {
      const lockTimeout = parseInt(signupLockedUntil, 10) - Date.now();
      if (lockTimeout > 0) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          localStorage.removeItem('signupLockedUntil');
          setAttemptCount(0);
        }, lockTimeout);
      } else {
        localStorage.removeItem('signupLockedUntil');
      }
    }
  }, []);

  // Validate token when token input changes
  useEffect(() => {
    if (formData.token && formData.token.length > 5) { // Start validation after reasonable length
      const timeoutId = setTimeout(() => {
        validateToken(formData.token);
      }, 500); // Debounce validation

      return () => clearTimeout(timeoutId);
    } else {
      setTokenValidationResult(null);
    }
  }, [formData.token]);

  const validateToken = async (token: string): Promise<TokenValidationResult> => {
    if (!token) {
      return { isValid: false, error: "Token is required" };
    }

    setIsValidatingToken(true);
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from("registration_tokens")
        .select("*")
        .eq("token", token)
        .eq("is_used", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (tokenError || !tokenData) {
        const result = { 
          isValid: false, 
          error: "Invalid or expired registration token" 
        };
        setTokenValidationResult(result);
        return result;
      }

      const result = { 
        isValid: true, 
        tokenData,
        error: undefined 
      };
      setTokenValidationResult(result);
      return result;
    } catch (error) {
      console.error("Error validating token:", error);
      const result = { 
        isValid: false, 
        error: "Failed to validate token. Please try again." 
      };
      setTokenValidationResult(result);
      return result;
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleRateLimit = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_TIME;
      localStorage.setItem('signupLockedUntil', lockoutEnd.toString());
      setIsLocked(true);
      setError({ 
        message: `Too many signup attempts. Please try again in ${LOCKOUT_TIME / 60000} minutes.`,
        timestamp: lockoutEnd 
      });
      
      setTimeout(() => {
        setIsLocked(false);
        localStorage.removeItem('signupLockedUntil');
        setAttemptCount(0);
        setError(null);
      }, LOCKOUT_TIME);
      
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Username validation - only allow a-z, A-Z and max 12 characters
    if (name === 'username') {
      const filteredValue = value.replace(/[^a-zA-Z]/g, '').slice(0, 12);
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user starts typing in the field that caused the error
    if (error && error.field === name) {
      setError(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must have at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  // New function to check if email or username already exists
  const checkExistingUser = async (email: string, username: string): Promise<boolean> => {
    try {
      // Check if email exists in profiles table
      const { data: emailData, error: emailError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (emailError) {
        console.error("Error checking email:", emailError);
        throw new Error("Failed to validate email. Please try again.");
      }

      if (emailData) {
        setError({ 
          message: "This email is already registered. Please use a different email.",
          field: "email"
        });
        return false;
      }

      // Check if username exists in profiles table
      const { data: usernameData, error: usernameError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (usernameError) {
        console.error("Error checking username:", usernameError);
        throw new Error("Failed to validate username. Please try again.");
      }

      if (usernameData) {
        setError({ 
          message: "This username is already taken. Please choose a different username.",
          field: "username"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in checkExistingUser:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to validate user information. Please try again.";
      setError({ message: errorMessage });
      return false;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.token) {
      setError({ 
        message: "Registration token is required",
        field: "token"
      });
      return false;
    }

    // Check if token validation result exists and is valid
    if (!tokenValidationResult || !tokenValidationResult.isValid) {
      setError({ 
        message: tokenValidationResult?.error || "Please enter a valid registration token",
        field: "token"
      });
      return false;
    }

    if (!formData.email) {
      setError({ 
        message: "Email is required",
        field: "email"
      });
      return false;
    }

    if (!formData.username) {
      setError({ 
        message: "Username is required",
        field: "username"
      });
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(formData.username)) {
      setError({ 
        message: "Username can only contain letters (a-z, A-Z)",
        field: "username"
      });
      return false;
    }

    if (formData.username.length > 12) {
      setError({ 
        message: "Username cannot exceed 12 characters",
        field: "username"
      });
      return false;
    }

    if (!formData.password) {
      setError({ 
        message: "Password is required",
        field: "password"
      });
      return false;
    }
    
    // Use the enhanced password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError({ 
        message: passwordError,
        field: "password"
      });
      return false;
    }
    
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    
    // Validate token first
    if (!tokenValidationResult || !tokenValidationResult.isValid) {
      const result = await validateToken(formData.token);
      if (!result.isValid) {
        setError({
          message: result.error || "Invalid registration token",
          field: "token"
        });
        return;
      }
    }

    if (!validateForm()) return;

    // Set loading state for validation
    setIsLoading(true);
    setError(null);

    try {
      // Check if email or username already exists
      const isUserValid = await checkExistingUser(formData.email, formData.username);
      
      if (!isUserValid) {
        setIsLoading(false);
        return;
      }

      // If validation passes, show confirmation dialog
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("Error during form validation:", error);
      setError({ 
        message: "An error occurred while validating your information. Please try again.",
        timestamp: Date.now() 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmedSubmit = async () => {
    if (!handleRateLimit()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the already validated token data
      const tokenData = tokenValidationResult?.tokenData;
      
      if (!tokenData) {
        throw new Error("Token validation failed. Please try again.");
      }

      // Double-check that email and username are still available
      const isUserValid = await checkExistingUser(formData.email, formData.username);
      if (!isUserValid) {
        return;
      }

      // Create auth account with email confirmation
      const registrationMetadata: RegistrationMetadata = {
        username: formData.username,
        token: formData.token,
        tokenId: tokenData.id,
        role: tokenData.role,
      };

      console.log(registrationMetadata);
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: registrationMetadata,
        },
      });

      if (authError) {
        if (authError.message.includes("email")) {
          setError({
            message: "This email is already registered",
            field: "email"
          });
        } else {
          throw authError;
        }
        return;
      }

      setAttemptCount(0);
      localStorage.removeItem('signupLockedUntil');
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      const errorMessage = error instanceof Error ? error.message : 
        (typeof error === 'object' && error && 'message' in error) ? 
        (error as SupabaseError).message : 
        "An unexpected error occurred";
        
      setError({
        message: errorMessage,
        timestamp: Date.now(),
      });
      handleRateLimit();
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  // Helper function to check if a field has an error
  const hasFieldError = (fieldName: string): boolean => {
    return error?.field === fieldName;
  };

  // Helper function to get field-specific error message
  const getFieldError = (fieldName: string): string | null => {
    return error?.field === fieldName ? error.message : null;
  };

  return {
    // State
    isLoading,
    error,
    showPassword,
    isSuccess,
    attemptCount,
    isLocked,
    showConfirmDialog,
    formData,
    isValidatingToken,
    tokenValidationResult,
    
    // Actions
    handleInputChange,
    togglePasswordVisibility,
    handleFormSubmit,
    handleConfirmedSubmit,
    setShowConfirmDialog,
    navigateToLogin,
    
    // Field validation helpers
    hasFieldError,
    getFieldError,
    validateToken,
  };
};