"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import type {
  CalendarCompanyOption,
  CalendarEventItem,
} from "@/components/calendar/types";
import { formatJstDateTimeLocal } from "@/lib/calendar/time";

type CalendarEventFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  event?: CalendarEventItem;
  companies: CalendarCompanyOption[];
  defaultStartsAt: string;
  defaultEndsAt: string;
  onCancel: () => void;
};

export function CalendarEventForm({
  action,
  companies,
  defaultEndsAt,
  defaultStartsAt,
  event,
  onCancel,
}: CalendarEventFormProps) {
  const [itemType, setItemType] = useState(event?.type ?? "EVENT");
  const [startsAtValue, setStartsAtValue] = useState(
    event ? formatJstDateTimeLocal(new Date(event.startsAt)) : defaultStartsAt,
  );
  const startsAt = event
    ? formatJstDateTimeLocal(new Date(event.startsAt))
    : defaultStartsAt;
  const endsAt = event
    ? formatJstDateTimeLocal(
        new Date(
          new Date(event.endsAt).getTime() -
            (event.allDay ? 24 * 60 * 60 * 1000 : 0),
        ),
      )
    : defaultEndsAt;

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="種類" required>
          <Dropdown
            name="type"
            options={[
              { value: "EVENT", label: "予定" },
              { value: "TASK", label: "タスク" },
              { value: "DEADLINE", label: "締切" },
            ]}
            value={itemType}
            onValueChange={setItemType}
          />
        </Field>
        <Field label="企業">
          <Dropdown
            name="companyId"
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
            defaultValue={event?.companyId ?? ""}
            emptyLabel="未選択"
            placeholder="未選択"
          />
        </Field>
      </div>

      <Field label="タイトル" required>
        <Input
          name="title"
          defaultValue={event?.title ?? ""}
          maxLength={100}
          placeholder={
            itemType === "TASK"
              ? "タスクのタイトル"
              : itemType === "DEADLINE"
                ? "締切のタイトル"
                : "予定のタイトル"
          }
          required
        />
      </Field>

      {itemType === "EVENT" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="開始" required>
            <Input
              name="startsAt"
              type="datetime-local"
              defaultValue={startsAt}
              onChange={(event) => setStartsAtValue(event.target.value)}
              required
            />
          </Field>
          <Field label="終了" required>
            <Input name="endsAt" type="datetime-local" defaultValue={endsAt} required />
          </Field>
        </div>
      ) : (
        <>
          <Field label={itemType === "TASK" ? "日時" : "期限"} required>
            <Input
              name="startsAt"
              type="datetime-local"
              value={startsAtValue}
              onChange={(event) => setStartsAtValue(event.target.value)}
              required
            />
          </Field>
          <input name="endsAt" type="hidden" value={addMinutesToLocalDateTime(startsAtValue, 30)} />
        </>
      )}

      {itemType === "EVENT" ? (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#111111]">
          <input
            className="h-4 w-4"
            name="allDay"
            type="checkbox"
            defaultChecked={event?.allDay ?? false}
          />
          終日
        </label>
      ) : null}

      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#111111]">
        <input
          className="h-4 w-4"
          name="completed"
          type="checkbox"
          defaultChecked={event?.completed ?? false}
        />
        完了
      </label>

      {event ? <input name="color" type="hidden" value={event.color} /> : null}

      {itemType === "EVENT" ? (
        <Field label="場所">
          <Input
            name="location"
            defaultValue={event?.location ?? ""}
            maxLength={200}
            placeholder="場所"
          />
        </Field>
      ) : null}

      <Field label="メモ">
        <Textarea
          name="description"
          defaultValue={event?.description ?? ""}
          maxLength={5000}
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pendingLabel="保存中...">保存</SubmitButton>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
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
    <label className="block space-y-2 text-left">
      <span className="block text-left text-sm font-medium text-[#111111]">
        {label}
        {required ? <span className="ml-1 text-[#666666]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function addMinutesToLocalDateTime(value: string, minutes: number) {
  if (!value) {
    return value;
  }

  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute + minutes));

  return [
    [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-"),
    [
      String(date.getUTCHours()).padStart(2, "0"),
      String(date.getUTCMinutes()).padStart(2, "0"),
    ].join(":"),
  ].join("T");
}
