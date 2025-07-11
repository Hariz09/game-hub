"use client";

import { createClient } from "@/lib/supabase/client";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "./auth-layout";
import { AuthInput, AuthButton, ErrorMessage, SuccessMessage, AuthLink } from "./auth-components";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  if (success) {
    return (
      <AuthLayout
        title="Periksa Email Anda"
        subtitle="Instruksi reset kata sandi telah dikirim"
      >
        <div className="space-y-6">
          <SuccessMessage
            title="Email Berhasil Dikirim"
            message="Jika Anda terdaftar menggunakan email dan kata sandi, Anda akan menerima email reset kata sandi."
          />

          <AuthButton onClick={handleBackToLogin}>
            Kembali ke Halaman Masuk
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Kata Sandi Anda"
      subtitle="Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi"
    >
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="contoh@email.com"
          required
          value={email}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
          error={error?? undefined}
        />

        {error && <ErrorMessage message={error} />}

        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Mengirim..."
        >
          Kirim Email Reset
        </AuthButton>

        {/* Pembatas */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-700/50 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-700/50 to-transparent"></div>
        </div>

        {/* Link kembali ke login */}
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Sudah ingat kata sandi?{' '}
            <AuthLink onClick={handleBackToLogin}>
              Masuk disini
            </AuthLink>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}