import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function AppLogoIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 9V7.5A2.5 2.5 0 0 1 9.5 5h5A2.5 2.5 0 0 1 17 7.5V9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M5 9h14v9.5A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5V9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M9 13h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 8V6.75A2.75 2.75 0 0 1 10.75 4h2.5A2.75 2.75 0 0 1 16 6.75V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M4.75 8h14.5v9.25A2.75 2.75 0 0 1 16.5 20h-9a2.75 2.75 0 0 1-2.75-2.75V8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M4.75 12.5h14.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function SidebarToggleIcon({
  className,
  open,
}: IconProps & {
  open: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 5.75A1.75 1.75 0 0 1 6.75 4h10.5A1.75 1.75 0 0 1 19 5.75v12.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25V5.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
      <path
        d={open ? "M15.5 9.5 13 12l2.5 2.5" : "M13 9.5l2.5 2.5L13 14.5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function LogOutIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M10 6H7.75A1.75 1.75 0 0 0 6 7.75v8.5C6 17.22 6.78 18 7.75 18H10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 8.5 17.5 12 14 15.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M17.5 12H10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function ChevronsUpDownIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m8 9 4-4 4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m16 15-4 4-4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.5 6.5 17.5 17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.5 6.5 17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function EllipsisIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.5 12h.01M12 12h.01M17.5 12h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M13 6h5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m11 13 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M18 14v3.25A1.75 1.75 0 0 1 16.25 19H6.75A1.75 1.75 0 0 1 5 17.25v-9.5A1.75 1.75 0 0 1 6.75 6H10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 8.75A2.75 2.75 0 0 1 10.75 6h5.5A2.75 2.75 0 0 1 19 8.75v5.5A2.75 2.75 0 0 1 16.25 17h-5.5A2.75 2.75 0 0 1 8 14.25v-5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 19h-6A3.5 3.5 0 0 1 5 15.5v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 20h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1 1-4L16.5 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 7h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 11v5M14 11v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 7V5.75A1.75 1.75 0 0 1 10.75 4h2.5A1.75 1.75 0 0 1 15 5.75V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="m7 7 .75 11.25A1.9 1.9 0 0 0 9.65 20h4.7a1.9 1.9 0 0 0 1.9-1.75L17 7"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4v3M17 4v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M5 8.75A2.75 2.75 0 0 1 7.75 6h8.5A2.75 2.75 0 0 1 19 8.75v8.5A2.75 2.75 0 0 1 16.25 20h-8.5A2.75 2.75 0 0 1 5 17.25v-8.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M5 10h14" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 16.5h.01M12 16.5h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function MemoIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.75 4h7.5A2.75 2.75 0 0 1 18 6.75v10.5A2.75 2.75 0 0 1 15.25 20h-7.5A2.75 2.75 0 0 1 5 17.25V6.75A2.75 2.75 0 0 1 7.75 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 8h6M8.5 12h6M8.5 16h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className ?? "h-5 w-5")}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12.5 4.25 4.25L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
