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
}

interface RegistrationMetadata {
  username: string;
  token: string;
  tokenId: string;
  role: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    if (!formData.token) {
      setError({ message: "Registration token is required" });
      return false;
    }
    if (!formData.email) {
      setError({ message: "Email is required" });
      return false;
    }
    if (!formData.username) {
      setError({ message: "Username is required" });
      return false;
    }
    if (!/^[a-zA-Z]+$/.test(formData.username)) {
      setError({ message: "Username can only contain letters (a-z, A-Z)" });
      return false;
    }
    if (formData.username.length > 12) {
      setError({ message: "Username cannot exceed 12 characters" });
      return false;
    }
    if (!formData.password) {
      setError({ message: "Password is required" });
      return false;
    }
    if (formData.password.length < 8) {
      setError({ message: "Password must be at least 8 characters long" });
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!handleRateLimit()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Validate registration token
      const { data: tokenData, error: tokenError } = await supabase
        .from("registration_tokens")
        .select("*")
        .eq("token", formData.token)
        .eq("is_used", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (tokenError || !tokenData) {
        throw new Error("Token salah, atau sudah tidak berlaku");
      }

      // Step 2: Create auth account with email confirmation
      const registrationMetadata: RegistrationMetadata = {
        username: formData.username,
        token: formData.token,
        tokenId: tokenData.id,
        role: tokenData.role,
      };

      console.log(registrationMetadata)
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
          throw new Error("This email is already registered");
        }
        throw authError;
      }

      // // Step 3: Update token status to used
      // const { error: updateError } = await supabase
      //   .from("registration_tokens")
      //   .update({ is_used: true })
      //   .eq("id", tokenData.id);

      // if (updateError) {
      //   console.error("Error updating token status:", updateError);
      //   // Continue with success flow as the account was created
      // }

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
    
    // Actions
    handleInputChange,
    togglePasswordVisibility,
    handleFormSubmit,
    handleConfirmedSubmit,
    setShowConfirmDialog,
    navigateToLogin,
  };
};