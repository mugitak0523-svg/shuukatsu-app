"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { CopyIcon, EditIcon, TrashIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { createMemo, deleteMemo, updateMemo } from "@/server/actions/memo";

type MemoItem = {
  id: string;
  key: string;
  value: string;
};

export function MemosClient({ memos }: { memos: MemoItem[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submitCreate(formData: FormData) {
    await createMemo(formData);
    router.refresh();
  }

  async function submitUpdate(memoId: string, formData: FormData) {
    await updateMemo(memoId, formData);
    setEditingId(null);
    router.refresh();
  }

  function removeMemo(memoId: string) {
    startTransition(async () => {
      await deleteMemo(memoId);
      router.refresh();
    });
  }

  async function copyValue(memo: MemoItem) {
    await navigator.clipboard.writeText(memo.value);
    setCopiedId(memo.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-lg border border-[#e5e5e5] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#111111]">メモを追加</h2>
        <MemoForm action={submitCreate} submitLabel="追加" />
      </section>

      <section className="rounded-lg border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#e5e5e5] px-4 py-3">
          <h2 className="text-sm font-semibold text-[#111111]">メモ一覧</h2>
        </div>
        <div className="divide-y divide-[#eeeeee]">
          {memos.length > 0 ? (
            memos.map((memo) => (
              <div key={memo.id} className="p-4">
                {editingId === memo.id ? (
                  <MemoForm
                    action={submitUpdate.bind(null, memo.id)}
                    memo={memo}
                    onCancel={() => setEditingId(null)}
                    submitLabel="保存"
                  />
                ) : (
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[#111111]">
                        {memo.key}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap break-words rounded-md bg-[#fafafa] px-3 py-2 text-sm text-[#333333]">
                        {memo.value}
                      </div>
                      {copiedId === memo.id ? (
                        <div className="mt-2 text-xs text-[#111111]">copied!</div>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <IconButton label="コピー" onClick={() => copyValue(memo)}>
                        <CopyIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="編集" onClick={() => setEditingId(memo.id)}>
                        <EditIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        disabled={isPending}
                        label="削除"
                        onClick={() => removeMemo(memo.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-sm text-[#666666]">
              メモはありません
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MemoForm({
  action,
  memo,
  onCancel,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  memo?: MemoItem;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    await action(formData);

    if (!memo) {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={submit} className="mt-4 space-y-4">
      <label className="block space-y-2 text-left">
        <span className="block text-left text-sm font-medium text-[#111111]">key</span>
        <Input name="key" defaultValue={memo?.key ?? ""} required />
      </label>
      <label className="block space-y-2 text-left">
        <span className="block text-left text-sm font-medium text-[#111111]">value</span>
        <Textarea name="value" defaultValue={memo?.value ?? ""} required />
      </label>
      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel="保存中...">{submitLabel}</SubmitButton>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function IconButton({
  children,
  className,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#666666] hover:bg-[#f5f5f5] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      title={label}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
