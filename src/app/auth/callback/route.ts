// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    
    try {
      // Exchange the code for session
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (authError) throw authError;
      if (!user) throw new Error('No user found');

      // Get the registration metadata from user.user_metadata
      const metadata = user.user_metadata as {
        username: string;
        token: string;
        tokenId: string;
      };

      if (!metadata) throw new Error('No registration metadata found');

      // Create user profile
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          role: 'player',
          username: metadata.username,
          email: user.email,
        },
      ]);

      if (profileError) throw profileError;

      // // Mark token as used
      // const { error: updateError } = await supabase
      //   .from("registration_tokens")
      //   .update({ is_used: true })
      //   .eq("id", metadata.tokenId);

      // if (updateError) throw updateError;

      // Redirect to success page or login
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?verified=true`);
    } catch (error) {
      console.error('Error in verification callback:', error);
      // Redirect to error page
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=verification_failed`);
    }
  }

  // No code found - redirect to home page
  return NextResponse.redirect(requestUrl.origin);
}