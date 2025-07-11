import { LoginForm } from "@/components/auth/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full bg-gradient-to-br from-gray-900 via-green-950 to-gray-800  items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm ">
        <LoginForm />
      </div>
    </div>
  );
}
