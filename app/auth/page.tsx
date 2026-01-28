"use client";
import { LoginForm } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const { replace } = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">ورود به حساب</h2>
        <LoginForm
          onLoginSuccess={() => {
            replace("/auth/choose-dashboard");
          }}
        />
        <div className="w-full text-center my-4">
          <Link
            className="bg-primary-100 p-3 rounded-2xl text-sm text-gray-600 hover:text-gray-800"
            href={"/"}
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
