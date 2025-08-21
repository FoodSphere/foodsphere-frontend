import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "w-fit h-fit flex flex-row items-center justify-center gap-3.5",
  {
    variants: {
      variant: {
        main: "text-white bg-primary-orange-main rounded-xl hover:bg-primary-orange-main/80 transition duration-150 ease-in-out",
        outline:
          "text-primary-orange-main bg-white border-2 border-primary-orange-main rounded-xl hover:border-primary-orange-main/80 hover:text-primary-orange-main/80 transition duration-150 ease-in-out",
      },
      size: {
        default: "font-medium text-xl h-10 p-5",
      },
    },
    defaultVariants: {
      variant: "main",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, disabled = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const disabledStyles =
      variant === "main"
        ? "pointer-events-none bg-secondary-75 text-secondary-500"
        : variant === "outline"
        ? " pointer-events-none text-secondary-400 border-secondary-100"
        : " pointer-events-none text-secondary-400";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && disabledStyles
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
