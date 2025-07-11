"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { AuthLayout } from "./auth-layout";
import { AuthInput, AuthButton, ErrorMessage, AuthLink } from "./auth-components";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({}: React.ComponentPropsWithoutRef<"div">) {
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk menjelajahi pohon keluarga Anda"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Field Email/Username */}
        <AuthInput
          id="emailOrUsername"
          type="text"
          label="Email atau username"
          placeholder="user@example.com"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Field Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="block text-sm font-semibold text-gray-200">
              Kata Sandi
            </span>
            <AuthLink onClick={handleForgotPassword} className="text-sm">
              Lupa kata sandi?
            </AuthLink>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-green-700/50 focus:border-green-500 focus:outline-none transition-colors bg-gray-800/50 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Pesan error */}
        {error && <ErrorMessage message={error} />}

        {/* Tombol login */}
        <AuthButton
          type="submit"
          loading={isLoading}
          loadingText="Sedang masuk..."
          disabled={isLoading || !emailOrUsername.trim() || !password.trim()}
        >
          Masuk
        </AuthButton>

        {/* Pembatas */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-700/50 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-700/50 to-transparent"></div>
        </div>

        {/* Link daftar */}
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Belum punya akun?{' '}
            <AuthLink onClick={handleSignUp}>
              Daftar disini
            </AuthLink>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}