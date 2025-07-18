import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const useLogin = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Helper function to check if input is an email
  const isEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Helper function to get email from username
  // Helper function to get email from username
const getEmailFromUsername = async (username: string): Promise<string | null> => {
  const supabase = createClient();
 
  console.log('Attempting to fetch email for username:', username);
  
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('email', { count: 'exact' })
      .eq('username', username)
      .maybeSingle(); // Use maybeSingle() which returns null if no match
    
    console.log('Query result:', { data, error, count });
    
    if (error) {
      console.error('Error fetching email from username:', error);
      return null;
    }
    
    // maybeSingle returns null if no match found
    if (!data) {
      console.log('No user found with username:', username);
      return null;
    }
    
    console.log('Found email for username:', data.email);
    return data.email || null;
  } catch (error) {
    console.error('Error in getEmailFromUsername:', error);
    return null;
  }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      let loginEmail = emailOrUsername;

      // If input is not an email, treat it as username and fetch email
      if (!isEmail(emailOrUsername)) {
        const fetchedEmail = await getEmailFromUsername(emailOrUsername);
        
        if (!fetchedEmail) {
          throw new Error("Username not found or no email associated with this username");
        }
        
        loginEmail = fetchedEmail;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });
      
      if (error) throw error;
      
      // Check if login was successful
      if (data.user) {
        // Use replace instead of push to avoid back button issues
        router.replace("/");
        // Force a page refresh to ensure proper state update
        // window.location.href = "/";
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  };
};