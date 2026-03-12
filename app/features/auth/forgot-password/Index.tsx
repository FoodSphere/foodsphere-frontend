"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordRender = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    console.log("Password reset requested for:", data.email);
    // Add API call here
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-sm lg:p-12">
        <h1 className="mb-4 text-center text-3xl font-semibold text-slate-800">
          Forgot your password
        </h1>

        <p className="mb-8 text-center text-slate-600">
          Please enter the email address you&apos;d like your password reset
          information sent to
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Enter email address
            </label>
            <input
              id="email"
              type="text"
              className={`w-full rounded-lg border px-4 py-3 text-slate-900 transition-colors focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-orange-main"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-orange-main py-3 text-center font-bold text-white transition-colors hover:bg-[#FF4722]"
          >
            Request reset link
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#1F5C9E] hover:underline"
            >
              Back To Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordRender;
