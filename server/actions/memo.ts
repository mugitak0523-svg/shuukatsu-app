"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { memoSchema } from "@/lib/validations/memo";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

function getPayload(formData: FormData) {
  const parsed = memoSchema.parse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  return {
    key: parsed.key,
    value: parsed.value,
  };
}

export async function createMemo(formData: FormData) {
  const userId = await requireUserId();
  const data = getPayload(formData);

  await db.memo.upsert({
    where: {
      userId_key: {
        userId,
        key: data.key,
      },
    },
    update: {
      value: data.value,
    },
    create: {
      ...data,
      userId,
    },
  });

  revalidatePath("/memos");
}

export async function updateMemo(memoId: string, formData: FormData) {
  const userId = await requireUserId();
  const data = getPayload(formData);
  const result = await db.memo.updateMany({
    where: {
      id: memoId,
      userId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("メモが見つかりません");
  }

  revalidatePath("/memos");
}

export async function deleteMemo(memoId: string) {
  const userId = await requireUserId();
  const result = await db.memo.deleteMany({
    where: {
      id: memoId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("メモが見つかりません");
  }

  revalidatePath("/memos");
}
