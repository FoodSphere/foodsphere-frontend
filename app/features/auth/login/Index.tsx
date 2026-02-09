"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode"; // import library
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { Icons } from "@/app/icons";
import { setCookie } from "@/libs/cookie"; // import setCookie
import { getRedirectPath } from "@/libs/role-mapping";
import { loginService } from "@/services/login/loginApi";

// Type สำหรับข้อมูลใน JWT Token (ปรับตาม Backend ของจริง)
interface IJwtPayload {
  sub: string;
  email: string;
  role: string; // หรือ permission
  exp: number;
  [key: string]: any;
}

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginRender = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginService({
        email: data.email,
        password: data.password,
      });

      if (res && res.data && res.data.access_token) {
        const token = res.data.access_token;

        // 1. Set Cookie
        setCookie("access_token", token);

        // 2. Decode & Check Permission
        const decoded: IJwtPayload = jwtDecode(token);

        // ใช้ fallback "dashboard" กรณีไม่มี role ส่งมา
        const userRole = decoded.role || "dashboard";

        // 3. Redirect โดยใช้ Helper function (ลด switch case)
        const targetPath = getRedirectPath(userRole);
        router.push(targetPath);
      } else {
        setError("root", {
          message: "Login failed: No access token received.",
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      // ... Logic Error Handling เดิมของคุณทำได้ดีแล้ว ...
      let errorMessage = "Something went wrong. Please try again.";
      try {
        const errorObj = JSON.parse(error.message);
        if (errorObj?.message) {
          errorMessage =
            typeof errorObj.message === "string"
              ? errorObj.message
              : "Invalid credentials";
        }
      } catch (e) {
        if (error.message) errorMessage = "Invalid email or password";
      }
      setError("root", { message: errorMessage });
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
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-orange-main"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-left text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-0">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-orange-main py-3 text-center font-semibold text-white transition-colors hover:bg-[#FF4722] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                Processing... {/* หรือใส่ Loading Spinner Icon ตรงนี้ */}
              </span>
            ) : (
              "Login"
            )}
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
