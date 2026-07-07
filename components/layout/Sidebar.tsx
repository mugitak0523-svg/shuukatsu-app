"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { AppLogoIcon, BriefcaseIcon, SidebarToggleIcon } from "@/components/ui/Icons";
import { APP_NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function Sidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [closedHover, setClosedHover] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const displayName = user.name ?? user.email ?? "ユーザー";

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <aside
      className={cn(
        "hidden min-h-screen shrink-0 border-r border-[#e5e5e5] bg-white transition-[width] md:block",
        open ? "w-56" : "w-16",
        !open && "cursor-ew-resize",
      )}
      onClick={() => {
        if (!open) {
          setOpen(true);
        }
      }}
      onMouseEnter={() => {
        if (!open) {
          setClosedHover(true);
        }
      }}
      onMouseLeave={() => setClosedHover(false)}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-14 items-center justify-between px-4">
          {open ? (
            <>
              <Link
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-semibold text-[#111111]"
                href="/companies"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white">
                  <AppLogoIcon />
                </span>
                <span className="truncate">就活管理</span>
              </Link>
              <button
                aria-label="サイドバーを閉じる"
                className="flex h-8 w-8 cursor-ew-resize items-center justify-center rounded-md text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111]"
                type="button"
                onClick={() => setOpen(false)}
              >
                <SidebarToggleIcon open={open} />
              </button>
            </>
          ) : (
            <button
              aria-label="サイドバーを開く"
              className="flex h-8 w-8 cursor-ew-resize items-center justify-center rounded-md bg-[#111111] text-white"
              type="button"
              onClick={() => setOpen(true)}
            >
              {closedHover ? <SidebarToggleIcon open={open} /> : <AppLogoIcon />}
            </button>
          )}
        </div>
        <nav className="px-4 py-2">
          <Link
            className={cn(
              "flex h-8 cursor-pointer items-center overflow-hidden rounded-md bg-[#f5f5f5] text-sm font-medium text-[#111111]",
              !open && "w-8",
            )}
            href={APP_NAV_ITEMS[0].href}
            onClick={(event) => event.stopPropagation()}
            onMouseEnter={() => {
              if (!open) {
                setClosedHover(false);
              }
            }}
            onMouseLeave={() => {
              if (!open) {
                setClosedHover(true);
              }
            }}
            title={APP_NAV_ITEMS[0].label}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <BriefcaseIcon />
            </span>
            <span
              className={cn(
                "ml-2 whitespace-nowrap transition-[opacity,width]",
                open ? "w-20 opacity-100" : "w-0 opacity-0",
              )}
            >
              {APP_NAV_ITEMS[0].label}
            </span>
          </Link>
        </nav>
        <div className="min-h-0 flex-1" />
        <div
          ref={userMenuRef}
          className="relative"
          onClick={(event) => event.stopPropagation()}
        >
          {userMenuOpen ? (
            <div className="absolute bottom-14 left-4 z-20 w-64 rounded-lg border border-[#e5e5e5] bg-white p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3 border-b border-[#f0f0f0] pb-3">
                <UserAvatar displayName={displayName} image={user.image} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#111111]">{displayName}</p>
                  {user.email ? (
                    <p className="truncate text-xs text-[#666666]">{user.email}</p>
                  ) : null}
                </div>
              </div>
              <div className="pt-2">
                <SignOutButton />
              </div>
            </div>
          ) : null}
          <div className="flex h-14 items-center px-4">
            <button
              className={cn(
                "flex h-8 cursor-pointer items-center overflow-hidden rounded-md text-left hover:bg-[#f5f5f5]",
                open ? "w-full" : "w-8",
              )}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setUserMenuOpen((current) => !current);
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                <UserAvatar displayName={displayName} image={user.image} />
              </span>
              {open ? (
                <span className="ml-2 min-w-0 truncate text-sm font-medium text-[#111111]">
                  {displayName}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function UserAvatar({
  displayName,
  image,
}: {
  displayName: string;
  image?: string | null;
}) {
  if (image) {
    return (
      <img
        alt=""
        className="h-8 w-8 shrink-0 rounded-full border border-[#e5e5e5] object-cover"
        src={image}
      />
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#fafafa] text-xs font-medium text-[#666666]">
      {displayName.slice(0, 1)}
    </span>
  );
}
