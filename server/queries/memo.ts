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

export async function getMemos() {
  const user = await requireUser();

  return db.memo.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
