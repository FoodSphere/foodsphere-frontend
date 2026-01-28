import ResetPasswordRender from "@/app/features/main/reset-password/Index";

export const metadata = {
  title: "Reset Password | FoodSphere",
  description: "Set a new password for your account",
};

const page = () => {
  return (
    <div className="w-full">
      <ResetPasswordRender />
    </div>
  );
};

export default page;
