import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg md:text-xl font-semibold leading-normal",
  {
    variants: {
      variant: {
        main: "bg-primary-red-01 hover:bg-primary-red-main text-white text-base md:text-lg xl:text-xl font-medium xl:font-semibold hover:text-white",
        secondary:
          "secondary group bg-primary-yellow-main text-white hover:bg-primary-yellow-04 disabled:bg-neutral-04 disabled:text-neutral-00",
        "secondary-outline":
          "secondary-outline group bg-white border border-neutral-09 text-neutral-09 hover:bg-primary-red-main hover:border-none hover:text-white disabled:border-none disabled:bg-neutral-04 disabled:text-neutral-00",
        "secondary-outline-2":
          "secondary-outline group bg-white border border-neutral-09 text-neutral-09 disabled:border-none disabled:bg-neutral-04 disabled:text-neutral-00",
        "secondary-outline-rounded":
          "secondary-outline-rounded group rounded-3xl bg-white border border-neutral-09 text-neutral-09 hover:bg-primary-red-main hover:border-none hover:text-white disabled:border-none disabled:bg-neutral-04 disabled:text-neutral-00",
        "secondary-outline-rounded-hover-gradient-red-blue":
          "secondary-outline-rounded group bg-white hover:bg-gradient-03 border-2 border-black hover:border-primary-red-main text-base md:text-lg xl:text-xl font-medium xl:font-semibold hover:text-white",
        "secondary-back":
          "secondary-back group text-othe-silver-fish hover:text-primary-red-main disabled:bg-neutral-04 disabled:text-neutral-00",
        outline:
          "border border-neutral-05 bg-background hover:bg-accent hover:text-accent-foreground",
        delete:
          "delete group bg-urgent-fail-02 text-white hover:bg-urgent-fail-01 hover:drop-shadow-delete-button disabled:bg-neutral-05 disabled:text-neutral-00",
        "admin-manage":
          "admin-manage group w-fit h-fit border-2 border-black rounded-full bg-white hover:bg-primary-red-main hover:border-white hover:text-white ease-in-out duration-200",
        "admin-create":
          "admin-create group w-fit h-fit border-2 border-white rounded-full bg-primary-red-main text-white hover:bg-white hover:text-black hover:border-black ease-in-out duration-200",
        "paginate-active":
          "paginate-active group w-fit h-fit p-1 border-2 border-slate-100 rounded-full bg-primary-red-main text-white text-base font-normal ease-in-out duration-200",
        "paginate-not-active":
          "paginate-not-active group w-fit h-fit p-1 border-2 border-slate-100 rounded-full bg-white text-black text-base font-normal hover:bg-primary-red-main hover:text-white ease-in-out duration-200",
        deleteSmall:
          "bg-primary-red-01 text-white items-center justify-center rounded-md text-base md:text-base font-semibold leading-normal",
        confirm:
          "bg-secondary-dark-gray-main text-white items-center justify-center rounded-md text-base md:text-base font-semibold leading-normal",
      },
      size: {
        default: "h-10 px-4 py-2 w-fit",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-full px-8",
        xl: "w-fit h-12 md:h-14 xl:h-16 rounded-full py-4 px-8 md:py-6 md:px-12 xl:py-8 xl:px-14",
        fit: "h-6 rounded-md px-2",
        icon: "h-10 w-10",
        pagination: "h-10 w-8",
        selectPaginate: "h-6",
        date: "h-10 px-4 py-0",
        adminManagementHead: "text-sm p-1 xl:w-fit xl:h-fit xl:px-3 xl:py-2",
        paginate: "w-10 h-10 rounded-full",
        paginatePrevNext: "w-fit h-fit",
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
        : variant === "secondary"
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
