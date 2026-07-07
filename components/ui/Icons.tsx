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
