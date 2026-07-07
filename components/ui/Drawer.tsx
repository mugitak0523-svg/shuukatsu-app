"use client";

import { useEffect, useState } from "react";

import { XIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Drawer({ children, description, onClose, open, title }: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (!mounted) {
      return;
    }

    setClosing(true);
    const timeoutId = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [mounted, open]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 z-50", closing ? "pointer-events-none" : undefined)}>
      <button
        aria-label="閉じる"
        className={cn(
          "absolute inset-0 bg-black/20",
          closing ? "drawer-mask-out" : "drawer-mask-in",
        )}
        type="button"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-screen w-full max-w-xl flex-col border-l border-[#e5e5e5] bg-white shadow-sm",
          closing ? "drawer-panel-out" : "drawer-panel-in",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#111111]">{title}</h2>
            {description ? (
              <p className="mt-0.5 truncate text-xs text-[#666666]">{description}</p>
            ) : null}
          </div>
          <button
            aria-label="閉じる"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111]"
            type="button"
            onClick={onClose}
          >
            <XIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </div>
  );
}
