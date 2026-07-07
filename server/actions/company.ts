"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { companySchema } from "@/lib/validations/company";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("ログインが必要です");
  }

  return session.user.id;
}

function getPayload(formData: FormData) {
  const parsed = companySchema.parse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    jobType: formData.get("jobType"),
    status: formData.get("status") || undefined,
    priority: formData.get("priority") || undefined,
    color: formData.get("color") || undefined,
    mypageId: formData.get("mypageId"),
    mypageUrl: formData.get("mypageUrl"),
    memo: formData.get("memo"),
  });

  return {
    name: parsed.name,
    industry: parsed.industry ?? null,
    jobType: parsed.jobType ?? null,
    status: parsed.status,
    priority: parsed.priority ?? null,
    color: parsed.color,
    mypageId: parsed.mypageId ?? null,
    mypageUrl: parsed.mypageUrl ?? null,
    memo: parsed.memo ?? null,
  };
}

export async function createCompany(formData: FormData) {
  const userId = await requireUserId();
  const data = getPayload(formData);

  await db.company.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/companies");
  redirect("/companies");
}

export async function updateCompany(companyId: string, formData: FormData) {
  const userId = await requireUserId();
  const data = getPayload(formData);

  const result = await db.company.updateMany({
    where: {
      id: companyId,
      userId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("企業が見つかりません");
  }

  revalidatePath("/companies");
  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}

export async function updateCompanyAndRedirect(
  companyId: string,
  redirectTo: string,
  formData: FormData,
) {
  const userId = await requireUserId();
  const data = getPayload(formData);

  const result = await db.company.updateMany({
    where: {
      id: companyId,
      userId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("企業が見つかりません");
  }

  revalidatePath("/companies");
  revalidatePath(`/companies/${companyId}`);
  redirect(redirectTo);
}

export async function deleteCompany(companyId: string) {
  const userId = await requireUserId();
  const result = await db.company.deleteMany({
    where: {
      id: companyId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("企業が見つかりません");
  }

  revalidatePath("/companies");
  redirect("/companies");
}
