"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronsUpDownIcon } from "@/components/ui/Icons";
import { APP_NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function HeaderTabSelector() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentItem =
    APP_NAV_ITEMS.find((item) => pathname.startsWith(item.href)) ?? APP_NAV_ITEMS[0];

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-expanded={open}
        className="flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-sm font-medium text-[#111111] hover:bg-[#f5f5f5]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{currentItem.label}</span>
        <ChevronsUpDownIcon className="h-4 w-4 text-[#666666]" />
      </button>

      {open ? (
        <div className="absolute left-0 top-9 z-20 w-48 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-sm">
          {APP_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm hover:bg-[#f5f5f5]",
                currentItem.href === item.href
                  ? "font-medium text-[#111111]"
                  : "text-[#666666]",
              )}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
