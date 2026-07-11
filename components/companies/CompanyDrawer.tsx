"use client";

import { useRef, useState } from "react";
import type { CompanyPriority, CompanyStatus } from "@prisma/client";

import { CompanyForm } from "@/components/companies/CompanyForm";
import { buttonClasses } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import {
  DEFAULT_COMPANY_COLOR,
  getAvailableCompanyColor,
  normalizeCompanyColor,
} from "@/lib/constants/company";
import {
  createCompany,
  updateCompanyAndRedirect,
} from "@/server/actions/company";

type CompanyFormValue = {
  id: string;
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

type CompanyDrawerProps =
  | {
      mode: "create";
      existingColors?: readonly (string | null | undefined)[];
      triggerLabel?: string;
      triggerContent?: React.ReactNode;
      triggerClassName?: string;
    }
  | {
      mode: "edit";
      company: CompanyFormValue;
      redirectTo: string;
      triggerLabel?: string;
      triggerContent?: React.ReactNode;
      triggerClassName?: string;
    };

export function CompanyDrawer(props: CompanyDrawerProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const title = props.mode === "create" ? "企業を追加" : "企業を編集";
  const initialColor =
    props.mode === "create"
      ? getAvailableCompanyColor(props.existingColors ?? [])
      : normalizeCompanyColor(props.company.color ?? DEFAULT_COMPANY_COLOR);
  const action =
    props.mode === "create"
      ? createCompany
      : updateCompanyAndRedirect.bind(null, props.company.id, props.redirectTo);

  function handleClose() {
    if (hasUnsavedWork()) {
      const confirmed = window.confirm("保存していない内容は消えます。閉じますか？");

      if (!confirmed) {
        return;
      }
    }

    setOpen(false);
  }

  function hasUnsavedWork() {
    const form = formRef.current;

    if (!form) {
      return false;
    }

    const values = getFormValues(form);

    if (props.mode === "create") {
      const enteredFields = [
        values.name,
        values.industry,
        values.jobType,
        values.status !== "INTERESTED" ? values.status : "",
        values.priority,
        values.color !== initialColor ? values.color : "",
        values.mypageId,
        values.mypageUrl,
        values.memo,
      ].filter(Boolean).length;

      return enteredFields >= 3;
    }

    return (
      values.name !== props.company.name ||
      values.industry !== (props.company.industry ?? "") ||
      values.jobType !== (props.company.jobType ?? "") ||
      values.status !== props.company.status ||
      values.priority !== (props.company.priority ?? "") ||
      values.color !== normalizeCompanyColor(props.company.color ?? DEFAULT_COMPANY_COLOR) ||
      values.mypageId !== (props.company.mypageId ?? "") ||
      values.mypageUrl !== (props.company.mypageUrl ?? "") ||
      values.memo !== (props.company.memo ?? "")
    );
  }

  return (
    <>
      <button
        className={
          props.triggerClassName ??
          buttonClasses({ variant: props.mode === "create" ? "primary" : "secondary" })
        }
        type="button"
        onClick={() => setOpen(true)}
      >
        {props.triggerContent ??
          props.triggerLabel ??
          (props.mode === "create" ? "企業を追加" : "編集")}
      </button>

      <Drawer
        open={open}
        title={title}
        onClose={handleClose}
      >
        <CompanyForm
          action={action}
          company={props.mode === "create" ? undefined : props.company}
          defaultColor={initialColor}
          formRef={formRef}
          surface="plain"
          onCancel={handleClose}
        />
      </Drawer>
    </>
  );
}

function getFormValues(form: HTMLFormElement) {
  const formData = new FormData(form);

  return {
    name: readValue(formData, "name"),
    industry: readValue(formData, "industry"),
    jobType: readValue(formData, "jobType"),
    status: readValue(formData, "status"),
    priority: readValue(formData, "priority"),
    color: normalizeCompanyColor(readValue(formData, "color")),
    mypageId: readValue(formData, "mypageId"),
    mypageUrl: readValue(formData, "mypageUrl"),
    memo: readValue(formData, "memo"),
  };
}

function readValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}
