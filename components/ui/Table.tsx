import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-white">
      <table className={cn("w-full min-w-[820px] border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "border-b border-[#e5e5e5] px-4 py-3 text-left text-xs font-medium uppercase tracking-normal text-[#666666]",
        props.className,
      )}
    />
  );
}

export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={cn("border-b border-[#f0f0f0] px-4 py-3 align-middle", props.className)}
    />
  );
}
