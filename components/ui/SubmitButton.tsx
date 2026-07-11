"use client";

import { useFormStatus } from "react-dom";

import { buttonClasses } from "@/components/ui/Button";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function SubmitButton({
  children,
  className,
  pendingLabel,
  variant = "primary",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={buttonClasses({ variant, className })}
      disabled={pending || props.disabled}
      type="submit"
    >
      {pending ? pendingLabel ?? "保存中..." : children}
    </button>
  );
}
