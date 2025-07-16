// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token = requestUrl.searchParams.get('token');
  const type = requestUrl.searchParams.get('type');

  const supabase = await createClient();

  try {
    let user;
    
    if (code) {
      // Handle PKCE flow (code exchange)
      const { data: { user: codeUser }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
      if (authError) throw authError;
      user = codeUser;
    } else if (token && type === 'signup') {
      // Handle email verification token
      const { data: { user: tokenUser }, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });
      if (verifyError) throw verifyError;
      user = tokenUser;
    } else {
      throw new Error('No valid authentication parameters found');
    }

    if (!user) throw new Error('No user found');

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!existingProfile) {
      // Get the registration metadata from user.user_metadata
      const metadata = user.user_metadata as {
        username: string;
        token: string;
        tokenId: string;
        role: string;
      };

      if (!metadata || !metadata.username) {
        throw new Error('No registration metadata found');
      }

      // Create user profile
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          role: metadata.role || 'player',
          username: metadata.username,
          email: user.email,
        },
      ]);

      if (profileError) throw profileError;

      // Mark token as used (uncomment if you want to use this)
      // if (metadata.tokenId) {
      //   const { error: updateError } = await supabase
      //     .from("registration_tokens")
      //     .update({ is_used: true })
      //     .eq("id", metadata.tokenId);
      //   if (updateError) console.error('Error updating token:', updateError);
      // }
    }

    // Redirect to success page
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?verified=true`);
    
  } catch (error) {
    console.error('Error in verification callback:', error);
    
    // More specific error handling
    const errorMessage = error instanceof Error ? error.message : 'verification_failed';
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent(errorMessage)}`);
  }
}