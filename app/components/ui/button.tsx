import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "w-fit h-fit flex flex-row items-center justify-center gap-3.5 whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange-main focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        main: "text-white bg-primary-orange-main rounded-xl hover:bg-primary-orange-main/80 transition duration-150 ease-in-out",
        outline:
          "text-primary-orange-main bg-white border-2 border-primary-orange-main rounded-xl hover:border-primary-orange-main/80 hover:text-primary-orange-main/80 transition duration-150 ease-in-out",
        // เพิ่ม secondary: เน้นสีเทาอ่อน สบายตา
        secondary:
          "bg-secondary-100 text-secondary-900 rounded-xl hover:bg-secondary-200 transition duration-150 ease-in-out",
        // เพิ่ม ghost: โปร่งใส มีสีเมื่อ hover
        ghost:
          "text-secondary-600 bg-transparent rounded-xl hover:bg-secondary-100 hover:text-secondary-900 transition duration-150 ease-in-out",
      },
      size: {
        default: "font-medium text-xl h-10 p-5",
        // เพิ่ม icon: ขนาดเท่ากันทุกด้าน
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "main",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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

    // ปรับปรุงเงื่อนไข Disabled Styles ให้ครอบคลุมทุก Variant
    const getDisabledStyles = () => {
      if (!disabled) return "";

      const baseDisabled = "pointer-events-none opacity-50";

      switch (variant) {
        case "main":
          return cn(
            baseDisabled,
            "bg-secondary-75 text-secondary-500 shadow-none"
          );
        case "outline":
          return cn(
            baseDisabled,
            "text-secondary-400 border-secondary-100 bg-transparent"
          );
        case "secondary":
          return cn(baseDisabled, "bg-secondary-50 text-secondary-400");
        case "ghost":
          return cn(baseDisabled, "text-secondary-400 bg-transparent");
        default:
          return cn(baseDisabled, "text-secondary-400");
      }
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          getDisabledStyles()
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
