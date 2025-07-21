"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";

export function LogoutButton() {
  const { navigateTo, isLoading } = useNavigation();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    navigateTo("/auth/login", "logout");
  };

  return (
    <Button 
      onClick={logout} 
      disabled={isLoading("logout")}
      className="bg-red-600 text-white"
    >
      {isLoading("logout") ? "Logging out..." : "Logout"}
    </Button>
  );
}