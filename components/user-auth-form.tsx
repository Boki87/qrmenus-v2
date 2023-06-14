"use client";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useState } from "react";
import ButtonOutline from "./ui/button-outline";

export function UserAuthForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  return (
    <div className="max-w-xl p-8 rounded-lg text-center bg-white">
      <img
        src={`/images/logo-wide.png`}
        className="max-w-[150px] inline-block mb-3"
      />
      <h2 className="font-bold text-3xl sm:text-4xl mb-3">Welcome back</h2>
      <p className="text-gray-600 text-sm mb-6">
        To access your account or create a new one continue with
      </p>
      <ButtonOutline
        isLoading={isGoogleLoading}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google");
        }}
      >
        <FaGoogle />
        <span className="ml-2">Google</span>
      </ButtonOutline>
    </div>
  );
}
