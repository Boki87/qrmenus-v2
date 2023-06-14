import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

import { UserAuthForm } from "@/components/user-auth-form";
export default function LoginPage() {
  return (
    <div className="h-full">
      <div className="absolute z-0 top-0 left-0 w-full h-full bg-gray-50">
        <Image
          src="/images/auth-bg.jpg"
          alt="Login bg"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full flex z-10 items-center justify-center glass p-4">
        <UserAuthForm />
      </div>
    </div>
  );
}
