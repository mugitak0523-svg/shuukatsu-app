"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CompanyDrawer } from "@/components/companies/CompanyDrawer";
import type { CompanyListItem } from "@/components/companies/types";
import { buttonClasses } from "@/components/ui/Button";
import {
  CopyIcon,
  EditIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  TrashIcon,
} from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteCompany } from "@/server/actions/company";

export function CompanyTableRow({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer hover:bg-[#fafafa]"
      onClick={() => router.push(href)}
    >
      {children}
    </tr>
  );
}

export function CompanyTableRowActions({
  company,
}: {
  company: CompanyListItem;
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ right: 0, top: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function toggleMenu() {
    const button = buttonRef.current;

    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        right: window.innerWidth - rect.right,
        top: rect.bottom + 4,
      });
    }

    setOpen((current) => !current);
  }

  return (
    <div
      ref={rootRef}
      className="relative flex justify-end"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        ref={buttonRef}
        aria-label="操作を開く"
        aria-expanded={open}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111]"
        type="button"
        onClick={toggleMenu}
      >
        <EllipsisIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          ref={menuRef}
          className="fixed z-50 w-32 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-sm"
          style={{
            right: menuPosition.right,
            top: menuPosition.top,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <CompanyDrawer
            company={{
              id: company.id,
              name: company.name,
              industry: company.industry,
              jobType: company.jobType,
              status: company.status,
              priority: company.priority,
              color: company.color,
              mypageId: company.mypageId,
              mypageUrl: company.mypageUrl,
              memo: company.memo,
            }}
            mode="edit"
            redirectTo="/companies"
            triggerClassName={buttonClasses({
              variant: "ghost",
              className: "h-8 w-full justify-start gap-2 px-3",
            })}
            triggerContent={
              <>
                <EditIcon className="h-4 w-4" />
                編集
              </>
            }
            triggerLabel="編集"
          />
          <form action={deleteCompany.bind(null, company.id)}>
            <SubmitButton
              className="h-8 w-full justify-start gap-2 border-transparent px-3"
              pendingLabel="削除中..."
              variant="danger"
            >
              <TrashIcon className="h-4 w-4" />
              削除
            </SubmitButton>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function CompanyMypageLink({ url }: { url?: string | null }) {
  if (!url) {
    return <span className="text-[#999999]">-</span>;
  }

  return (
    <a
      aria-label="マイページを開く"
      className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111]"
      href={url}
      rel="noreferrer"
      target="_blank"
      onClick={(event) => event.stopPropagation()}
    >
      <ExternalLinkIcon className="h-4 w-4" />
      <span>開く</span>
    </a>
  );
}

export function CompanyMypageIdCopy({
  mypageId,
}: {
  mypageId?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copyId(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!mypageId) {
      return;
    }

    await navigator.clipboard.writeText(mypageId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  if (!mypageId) {
    return <span className="text-[#999999]">-</span>;
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        className="inline-flex max-w-36 cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111]"
        type="button"
        onClick={copyId}
      >
        <span className="truncate">{mypageId}</span>
        <CopyIcon className="h-4 w-4" />
      </button>
      {copied ? (
        <span className="absolute left-0 top-8 z-10 rounded-md border border-[#e5e5e5] bg-white px-2 py-1 text-xs text-[#111111] shadow-sm">
          copied!
        </span>
      ) : null}
    </div>
  );
}
