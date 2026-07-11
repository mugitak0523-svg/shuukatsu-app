import type { CompanyPriority, CompanyStatus } from "@prisma/client";

export type CompanyListItem = {
  id: string;
  name: string;
  industry: string | null;
  jobType: string | null;
  status: CompanyStatus;
  priority: CompanyPriority | null;
  color: string | null;
  mypageId: string | null;
  mypageUrl: string | null;
  memo: string | null;
};
