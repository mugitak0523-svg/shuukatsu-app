import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#e5e5e5] bg-white px-2 py-0.5 text-xs font-medium text-[#111111]",
        className,
      )}
    >
      {children}
    </span>
  );
}
