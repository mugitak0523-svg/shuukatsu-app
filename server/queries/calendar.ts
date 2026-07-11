import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user;
}

export async function getCalendarEvents() {
  const user = await requireUser();

  return db.calendarEvent.findMany({
    where: {
      userId: user.id,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
  });
}
