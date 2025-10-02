"use client";
import { useState } from "react";
import Image from "next/image";

import { Icons } from "@/app/icons";

const LoginRender = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8 lg:p-16">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold">Welcome to</h1>
        <h1 className="mb-6 text-5xl font-bold text-primary-orange-main">
          FOOD SPHERE
        </h1>
        <p className="mb-8 text-gray-600">Login to your restaurant.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-orange-main focus:outline-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-orange-main focus:outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <Icons name="HidePasswordIcon" width={20} />
              ) : (
                <Icons name="ShowPasswordIcon" width={20} />
              )}
            </button>
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-primary-orange-main hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-orange-main py-3 text-center font-semibold text-white transition-colors hover:bg-[#FF4722]"
          >
            Login
          </button>
        </form>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <Image
          src="/images/login_prop.png"
          alt="Login Prop"
          width={700}
          height={700}
          className="ml-auto"
        />
      </div>
    </div>
  );
};

export default LoginRender;
