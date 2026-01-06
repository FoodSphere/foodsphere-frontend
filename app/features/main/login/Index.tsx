"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Icons } from "@/app/icons";

const loginSchema = z.object({
  username: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const mockUser = {
  email: "admin@admin.com",
  password: "Admin@123",
};  

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginRender = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLogin: boolean = true;
  const permission: string = "dashboard";

  const onSubmit = (data: LoginFormValues) => {
    // Add your login logic here
    // For now we just use the mock variables, but in real app 'data' would be sent to API
    if (data.username !== mockUser.email || data.password !== mockUser.password) {
      setError("root", { message: "Email or password incorrect" });
      return;
    }

    if (isLogin) {
      switch (permission) {
        case "dashboard":
          router.push("/");
          break;
        case "order":
          router.push("/order");
          break;
        case "table":
          router.push("/table");
          break;
        case "stock":
          router.push("/stock");
          break;
        case "menu":
          router.push("/menu");
          break;
        case "restaurant":
          router.push("/restaurant");
          break;
        default:
          router.push("/error");
      }
    } else {
      setError("root", { message: "Invalid username or password" });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8 lg:p-16 gap-10">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold">Welcome to</h1>
        <h1 className="mb-6 text-5xl font-bold text-primary-orange-main">
          FOOD SPHERE
        </h1>
        <p className="mb-8 text-gray-600">Login to your restaurant.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Email"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                errors.username
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-orange-main"
              }`}
              {...register("username")}
            />
            {errors.username && (
              <p className="mt-1 text-left text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="relative mb-0">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-orange-main"
              }`}
              {...register("password")}
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

          {errors.password && (
            <p className="mt-1 text-left text-sm text-red-500">
              {errors.password.message}
            </p>
          )}

          <div className="text-right mt-1">
            <a
              href="/forgot-password"
              className="text-sm text-primary-orange-main hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {errors.root && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {errors.root.message}
            </div>
          )}

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
