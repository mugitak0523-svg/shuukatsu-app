import { redirect } from "next/navigation";

import { CalendarClient, type CalendarView } from "@/components/calendar/CalendarClient";
import { getJstDateKey } from "@/lib/calendar/time";
import { getCalendarEvents } from "@/server/queries/calendar";
import { getCompanies } from "@/server/queries/company";

const CALENDAR_VIEWS = new Set(["day", "week", "month"]);

export default async function CalendarPeriodPage({
  params,
}: {
  params: Promise<{
    view: string;
    year: string;
    month: string;
    day: string;
  }>;
}) {
  const { day, month, view, year } = await params;
  const parsedView = CALENDAR_VIEWS.has(view) ? (view as CalendarView) : null;
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  const parsedDay = Number(day);

  if (!parsedView || !isValidDateParts(parsedYear, parsedMonth, parsedDay)) {
    const [todayYear, todayMonth, todayDay] = getJstDateKey().split("-").map(Number);
    redirect(`/calendar/month/${todayYear}/${todayMonth}/${todayDay}`);
  }

  const [events, companies] = await Promise.all([
    getCalendarEvents(),
    getCompanies(),
  ]);
  const initialDateKey = [
    parsedYear,
    String(parsedMonth).padStart(2, "0"),
    String(parsedDay).padStart(2, "0"),
  ].join("-");

  return (
    <CalendarClient
      events={events.map((event) => ({
        id: event.id,
        title: event.title,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt.toISOString(),
        allDay: event.allDay,
        type: event.type,
        completed: event.completed,
        color: event.color,
        companyId: event.companyId,
        company: event.company,
        location: event.location,
        description: event.description,
      }))}
      companies={companies.map((company) => ({
        id: company.id,
        name: company.name,
      }))}
      initialDateKey={initialDateKey}
      initialView={parsedView}
    />
  );
}

function isValidDateParts(year: number, month: number, day: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}
