import { CompanyPriority, CompanyStatus, Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

type CompanyFilters = {
  q?: string;
  status?: string;
  priority?: string;
};

async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user;
}

function isCompanyStatus(value?: string): value is CompanyStatus {
  return Boolean(value && Object.values(CompanyStatus).includes(value as CompanyStatus));
}

function isCompanyPriority(value?: string): value is CompanyPriority {
  return Boolean(
    value && Object.values(CompanyPriority).includes(value as CompanyPriority),
  );
}

export async function getCompanies(filters: CompanyFilters = {}) {
  const user = await requireUser();
  const q = filters.q?.trim();
  const where: Prisma.CompanyWhereInput = {
    userId: user.id,
  };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
      { jobType: { contains: q, mode: "insensitive" } },
      { mypageId: { contains: q, mode: "insensitive" } },
    ];
  }

  if (isCompanyStatus(filters.status)) {
    where.status = filters.status;
  }

  if (isCompanyPriority(filters.priority)) {
    where.priority = filters.priority;
  }

  return db.company.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getCompanyColors() {
  const user = await requireUser();
  const companies = await db.company.findMany({
    where: {
      userId: user.id,
    },
    select: {
      color: true,
    },
  });

  return companies.map((company) => company.color);
}

export async function getCompanyById(companyId: string) {
  const user = await requireUser();
  const company = await db.company.findFirst({
    where: {
      id: companyId,
      userId: user.id,
    },
  });

  if (!company) {
    notFound();
  }

  return company;
}
