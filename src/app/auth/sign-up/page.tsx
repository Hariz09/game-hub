"use client"
import React from "react";
import { KeyRound, Mail, User, Lock, AlertCircle, UserPlus } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthInput, AuthPasswordInput, AuthButton, ErrorMessage, SuccessMessage, AuthLink } from "@/components/auth/auth-components";
import { useSignup } from "@/hooks/useSignup";

// Confirmation Dialog Component
function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: { email: string; username: string };
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 rounded-2xl border border-green-800/30 max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Konfirmasi Pembuatan Akun
        </h3>
        
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Harap periksa informasi Anda dengan teliti. Token registrasi akan ditandai sebagai sudah digunakan dan tidak dapat digunakan lagi.
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Detail Akun</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-white">{formData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm text-white">{formData.username}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-300">
            Setelah konfirmasi, silakan periksa email Anda untuk memverifikasi akun sebelum login.
          </p>
        </div>

        <div className="flex space-x-3">
          <AuthButton
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </AuthButton>
          <AuthButton
            onClick={onConfirm}
            className="flex-1"
          >
            Buat Akun
          </AuthButton>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const {
    // State
    isLoading,
    error,
    showPassword,
    isSuccess,
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
  } = useSignup();

  // Success state
  if (isSuccess) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-green-950 to-gray-800">
      <AuthLayout
        title="Akun Berhasil Dibuat"
        subtitle="Selamat! Akun Anda telah berhasil dibuat"
      >
        <div className="space-y-6">
          <SuccessMessage
            title="Registrasi Berhasil"
            message="Akun Anda telah dibuat. Silakan periksa email untuk memverifikasi akun sebelum login."
          />
          
          <AuthButton onClick={navigateToLogin}>
            Ke Halaman Login
          </AuthButton>
        </div>
      </AuthLayout>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-green-950 to-gray-800">
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Masukkan detail Anda untuk membuat akun"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <ErrorMessage message={error.message} />
        )}

        <AuthInput
          id="token"
          name="token"
          type="text"
          label="Token Registrasi *"
          placeholder="Masukkan token registrasi Anda"
          value={formData.token}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          rightElement={<KeyRound className="h-5 w-5 text-gray-400" />}
        />

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email *"
          placeholder="contoh@gmail.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          rightElement={<Mail className="h-5 w-5 text-gray-400" />}
        />

        <div className="space-y-2">
          <AuthInput
            id="username"
            name="username"
            type="text"
            label="Username * (huruf saja, maks 12 karakter)"
            placeholder="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isLoading || isLocked}
            maxLength={12}
            pattern="[a-zA-Z]*"
            rightElement={<User className="h-5 w-5 text-gray-400" />}
          />
          <p className="text-xs text-gray-400">
            {formData.username.length}/12 karakter
          </p>
        </div>

        <AuthPasswordInput
          id="password"
          name="password"
          label="Password * (min. 8 karakter)"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading || isLocked}
          minLength={8}
          showToggle={true}
        />

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
          <p className="text-sm text-blue-300">
            Silakan periksa email Anda setelah registrasi untuk mengkonfirmasi akun. 
            Anda tidak akan dapat login sampai email terverifikasi.
          </p>
        </div>

        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Anda memerlukan token registrasi untuk membuat akun. 
              Silakan hubungi administrator untuk mendapatkannya.
            </p>
          </div>
        </div>

        <AuthButton
          type="submit"
          disabled={isLoading || isLocked}
          loading={isLoading}
          loadingText="Membuat Akun..."
        >
          {isLocked ? (
            "Pembuatan Akun Terkunci"
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Buat Akun</span>
            </div>
          )}
        </AuthButton>

        <div className="text-center">
          <span className="text-gray-400">Sudah punya akun? </span>
          <AuthLink onClick={navigateToLogin}>
            Login di sini
          </AuthLink>
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        formData={formData}
      />
    </AuthLayout>
    </div>
  );
}