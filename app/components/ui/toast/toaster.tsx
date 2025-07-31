"use client";

import { iconNames, Icons } from "@/app/icons";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        descriptionTwo,
        action,
        icon,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2 items-center">
              {icon && iconNames[icon as keyof typeof iconNames] ? (
                <Icons name={icon as keyof typeof iconNames} className="w-5" />
              ) : null}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                <div className="grid gap-1">
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                  {descriptionTwo && (
                    <ToastDescription>{descriptionTwo}</ToastDescription>
                  )}
                </div>
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
