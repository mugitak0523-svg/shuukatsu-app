import { redirect } from "next/navigation";

import { getJstDateKey } from "@/lib/calendar/time";

export default async function CalendarPage() {
  const [year, month, day] = getJstDateKey().split("-").map(Number);
  redirect(`/calendar/month/${year}/${month}/${day}`);
}
