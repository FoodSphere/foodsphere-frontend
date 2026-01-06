"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/app/icons";

// Mock data TODO: Retrieve old password
const oldPassword = "Admin@123";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // TODO: Add validation for token and email
//   if (!token || !email) {
//     router.push("/_not-found");
//     return;
//   }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    if (data.password === oldPassword) {
      setError("root", { message: "Password must be different from old password" });
      return;
    }

    console.log("Password reset success:", {
      ...data,
      token,
      email,
    });
    // Add API call here
    router.push("/login"); // Redirect to login after success
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-sm lg:p-12">
        <h1 className="mb-4 text-center text-3xl font-semibold text-slate-800">
          Set new password
        </h1>

        <p className="mb-8 text-center text-slate-600">
          Your new password must be different to previously used passwords.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full rounded-lg border px-4 py-3 text-slate-900 transition-colors focus:outline-none ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary-orange-main"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <Icons name="HidePasswordIcon" width={20} />
                ) : (
                  <Icons name="ShowPasswordIcon" width={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full rounded-lg border px-4 py-3 text-slate-900 transition-colors focus:outline-none ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary-orange-main"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <Icons name="HidePasswordIcon" width={20} />
                ) : (
                  <Icons name="ShowPasswordIcon" width={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-orange-main py-3 text-center font-bold text-white transition-colors hover:bg-[#FF4722]"
          >
            Reset Password
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#1F5C9E] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordRender = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordRender;
