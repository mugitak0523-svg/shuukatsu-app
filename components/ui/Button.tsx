import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "border-black bg-[#111111] text-white hover:bg-black",
  secondary: "border-[#e5e5e5] bg-white text-[#111111] hover:bg-[#fafafa]",
  ghost: "border-transparent bg-transparent text-[#111111] hover:bg-[#f5f5f5]",
  danger: "border-[#e5e5e5] bg-white text-red-600 hover:bg-red-50",
};

export function buttonClasses({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return cn(
    "inline-flex h-10 cursor-pointer items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return <button className={buttonClasses({ variant, className })} type={type} {...props} />;
}
