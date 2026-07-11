"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  parseJstDateEnd,
  parseJstDateStart,
  parseJstDateTimeLocal,
} from "@/lib/calendar/time";
import { calendarEventSchema } from "@/lib/validations/calendar";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

async function getPayload(formData: FormData, userId: string) {
  const allDay = formData.get("allDay") === "on";
  const completed = formData.get("completed") === "on";
  const parsed = calendarEventSchema.parse({
    title: formData.get("title"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    allDay,
    type: formData.get("type") || undefined,
    completed,
    companyId: formData.get("companyId"),
    color: formData.get("color") || undefined,
    location: formData.get("location") ?? "",
    description: formData.get("description") ?? "",
  });
  const company = parsed.companyId
    ? await db.company.findFirst({
        where: {
          id: parsed.companyId,
          userId,
        },
        select: {
          id: true,
          color: true,
        },
      })
    : null;

  if (parsed.companyId && !company) {
    throw new Error("企業が見つかりません");
  }

  const startsAt = allDay
    ? parseJstDateStart(parsed.startsAt.slice(0, 10))
    : parseJstDateTimeLocal(parsed.startsAt);
  const endsAt = parsed.type === "EVENT"
    ? allDay
      ? parseJstDateEnd(parsed.endsAt.slice(0, 10))
      : parseJstDateTimeLocal(parsed.endsAt)
    : new Date(startsAt.getTime() + 30 * 60 * 1000);

  if (endsAt <= startsAt) {
    throw new Error("終了時刻は開始時刻より後にしてください");
  }

  return {
    title: parsed.title,
    startsAt,
    endsAt,
    allDay,
    type: parsed.type,
    completed: parsed.completed,
    companyId: company?.id ?? null,
    color: company?.color ?? parsed.color,
    location: parsed.type === "EVENT" ? parsed.location ?? null : null,
    description: parsed.description ?? null,
  };
}

export async function createCalendarEvent(formData: FormData) {
  const userId = await requireUserId();
  const data = await getPayload(formData, userId);

  await db.calendarEvent.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/calendar");
}

export async function updateCalendarEvent(eventId: string, formData: FormData) {
  const userId = await requireUserId();
  const data = await getPayload(formData, userId);
  const result = await db.calendarEvent.updateMany({
    where: {
      id: eventId,
      userId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("予定が見つかりません");
  }

  revalidatePath("/calendar");
}

export async function toggleCalendarTaskCompleted(eventId: string, completed: boolean) {
  const userId = await requireUserId();
  const result = await db.calendarEvent.updateMany({
    where: {
      id: eventId,
      userId,
      type: "TASK",
    },
    data: {
      completed,
    },
  });

  if (result.count === 0) {
    throw new Error("タスクが見つかりません");
  }

  revalidatePath("/calendar");
}

export async function deleteCalendarEvent(eventId: string) {
  const userId = await requireUserId();
  const result = await db.calendarEvent.deleteMany({
    where: {
      id: eventId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("予定が見つかりません");
  }

  revalidatePath("/calendar");
}
