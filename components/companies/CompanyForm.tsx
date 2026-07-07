"use client";

import type { CompanyPriority, CompanyStatus } from "@prisma/client";
import Link from "next/link";

import { Button, buttonClasses } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  COMPANY_INDUSTRY_OPTIONS,
  COMPANY_JOB_TYPE_OPTIONS,
  COMPANY_NAME_OPTIONS,
  COMPANY_PRIORITY_OPTIONS,
  COMPANY_STATUS_OPTIONS,
  normalizeCompanyColor,
} from "@/lib/constants/company";

type CompanyFormProps = {
  company?: {
    name: string;
    industry: string | null;
    jobType: string | null;
    status: CompanyStatus;
    priority: CompanyPriority | null;
    color?: string | null;
    mypageId?: string | null;
    mypageUrl: string | null;
    memo: string | null;
  };
  action: (formData: FormData) => void | Promise<void>;
  cancelHref?: string;
  defaultColor?: string;
  formRef?: React.Ref<HTMLFormElement>;
  onCancel?: () => void;
  surface?: "card" | "plain";
};

export function CompanyForm({
  action,
  cancelHref,
  company,
  defaultColor = "#2563EB",
  formRef,
  onCancel,
  surface = "card",
}: CompanyFormProps) {
  return (
    <form
      action={action}
      ref={formRef}
      className={
        surface === "card"
          ? "max-w-2xl space-y-6 rounded-lg border border-[#e5e5e5] bg-white p-6"
          : "space-y-6"
      }
    >
      <Field label="企業名" required>
        <Dropdown
          allowCustomValue
          name="name"
          defaultValue={company?.name ?? ""}
          maxLength={100}
          options={COMPANY_NAME_OPTIONS}
          placeholder="企業名を検索または入力"
          required
          searchable
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="業界">
          <Dropdown
            name="industry"
            defaultValue={company?.industry ?? ""}
            emptyLabel="未選択"
            options={COMPANY_INDUSTRY_OPTIONS}
            placeholder="業界を選択"
          />
        </Field>
        <Field label="職種">
          <Dropdown
            name="jobType"
            defaultValue={company?.jobType ?? ""}
            emptyLabel="未選択"
            options={COMPANY_JOB_TYPE_OPTIONS}
            placeholder="職種を選択"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="ステータス">
          <Dropdown
            name="status"
            defaultValue={company?.status ?? "INTERESTED"}
            options={COMPANY_STATUS_OPTIONS}
          />
        </Field>
        <Field label="志望度">
          <Dropdown
            name="priority"
            defaultValue={company?.priority ?? ""}
            emptyLabel="未設定"
            options={COMPANY_PRIORITY_OPTIONS}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="マイページID">
          <Input
            name="mypageId"
            defaultValue={company?.mypageId ?? ""}
            maxLength={100}
            placeholder="ログインID・会員IDなど"
          />
        </Field>
        <Field label="色">
          <ColorPicker
            name="color"
            defaultValue={normalizeCompanyColor(company?.color ?? defaultColor)}
          />
        </Field>
      </div>

      <Field label="マイページURL">
        <Input
          name="mypageUrl"
          type="url"
          defaultValue={company?.mypageUrl ?? ""}
          placeholder="https://example.com/mypage"
        />
      </Field>

      <Field label="メモ">
        <Textarea name="memo" defaultValue={company?.memo ?? ""} maxLength={5000} />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">保存</Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        ) : cancelHref ? (
          <Link className={buttonClasses({ variant: "secondary" })} href={cancelHref}>
            キャンセル
          </Link>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#111111]">
        {label}
        {required ? <span className="ml-1 text-[#666666]">*</span> : null}
      </span>
      {children}
    </label>
  );
}
