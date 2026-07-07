import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-[#e5e5e5] bg-white px-3 text-sm outline-none transition-colors placeholder:text-[#999999] focus:border-[#111111]",
        props.className,
      )}
    />
  );
}
