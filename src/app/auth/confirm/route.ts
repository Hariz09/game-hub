// app/auth/confirm/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    
    try {
      // Verify the OTP token
      const { data: { user }, error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (verifyError) throw verifyError;
      if (!user) throw new Error('No user found after verification');

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

      // Mark token as used (uncomment if needed)
      // const { error: updateError } = await supabase
      //   .from("registration_tokens")
      //   .update({ is_used: true })
      //   .eq("id", metadata.tokenId);

      // if (updateError) throw updateError;

      // Redirect to success page
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?verified=true`);
    } catch (error) {
      console.error('Error in email confirmation:', error);
      // Redirect to error page
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=confirmation_failed`);
    }
  }

  // No token_hash or type found - redirect to error
  return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=invalid_confirmation_link`);
}