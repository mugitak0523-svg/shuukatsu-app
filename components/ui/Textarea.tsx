import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-32 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-[#999999] focus:border-[#111111]",
        props.className,
      )}
    />
  );
}
