"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { 
  AuthPasswordInput, 
  AuthButton, 
  ErrorMessage, 
  SuccessMessage 
} from "./auth-components";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password harus memiliki minimal 8 karakter";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password harus mengandung huruf besar, huruf kecil, dan angka";
    }
    return null;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validasi password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect setelah 2 detik untuk memberi waktu user melihat pesan sukses
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Berhasil Diperbarui"
        subtitle="Anda akan diarahkan ke halaman utama"
      >
        <SuccessMessage
          title="Berhasil!"
          message="Password Anda telah berhasil diperbarui. Anda akan diarahkan ke halaman utama dalam beberapa detik."
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Masukkan password baru Anda"
    >
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <AuthPasswordInput
          id="password"
          label="Password Baru"
          placeholder="Masukkan password baru"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <AuthPasswordInput
          id="confirmPassword"
          label="Konfirmasi Password Baru"
          placeholder="Masukkan ulang password baru"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* Password requirements */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
          <p className="text-sm text-gray-300 mb-2">Password harus memenuhi syarat:</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li className={`flex items-center ${password.length >= 8 ? 'text-green-400' : ''}`}>
              <span className="mr-2">{password.length >= 8 ? '✓' : '•'}</span>
              Minimal 8 karakter
            </li>
            <li className={`flex items-center ${/(?=.*[a-z])/.test(password) ? 'text-green-400' : ''}`}>
              <span className="mr-2">{/(?=.*[a-z])/.test(password) ? '✓' : '•'}</span>
              Mengandung huruf kecil
            </li>
            <li className={`flex items-center ${/(?=.*[A-Z])/.test(password) ? 'text-green-400' : ''}`}>
              <span className="mr-2">{/(?=.*[A-Z])/.test(password) ? '✓' : '•'}</span>
              Mengandung huruf besar
            </li>
            <li className={`flex items-center ${/(?=.*\d)/.test(password) ? 'text-green-400' : ''}`}>
              <span className="mr-2">{/(?=.*\d)/.test(password) ? '✓' : '•'}</span>
              Mengandung angka
            </li>
          </ul>
        </div>

        {error && <ErrorMessage message={error} />}

        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Menyimpan password..."
          disabled={!password || !confirmPassword}
        >
          Simpan Password Baru
        </AuthButton>
      </form>
    </AuthLayout>
  );
}