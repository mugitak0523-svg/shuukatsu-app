import type { Company } from "@prisma/client";
import Link from "next/link";

import { deleteCompany } from "@/server/actions/company";
import { CompanyDrawer } from "@/components/companies/CompanyDrawer";
import { CompanyPriorityBadge } from "@/components/companies/CompanyPriorityBadge";
import { CompanyStatusBadge } from "@/components/companies/CompanyStatusBadge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Table, Td, Th } from "@/components/ui/Table";
import { DEFAULT_COMPANY_COLOR, normalizeCompanyColor } from "@/lib/constants/company";
import { formatDate } from "@/lib/utils";

type CompanyRow = Company & {
  color?: string | null;
  mypageId?: string | null;
};

export function CompanyTable({ companies }: { companies: CompanyRow[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>企業名</Th>
          <Th>業界</Th>
          <Th>職種</Th>
          <Th>ステータス</Th>
          <Th>志望度</Th>
          <Th>更新日</Th>
          <Th className="text-right">操作</Th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <tr key={company.id} className="hover:bg-[#fafafa]">
            <Td>
              <Link className="font-medium text-[#111111]" href={`/companies/${company.id}`}>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: normalizeCompanyColor(
                        company.color ?? DEFAULT_COMPANY_COLOR,
                      ),
                    }}
                  />
                  {company.name}
                </span>
              </Link>
            </Td>
            <Td className="text-[#666666]">
              <Link className="block" href={`/companies/${company.id}`}>
                {company.industry || "-"}
              </Link>
            </Td>
            <Td className="text-[#666666]">
              <Link className="block" href={`/companies/${company.id}`}>
                {company.jobType || "-"}
              </Link>
            </Td>
            <Td>
              <Link className="block" href={`/companies/${company.id}`}>
                <CompanyStatusBadge status={company.status} />
              </Link>
            </Td>
            <Td>
              <Link className="block" href={`/companies/${company.id}`}>
                <CompanyPriorityBadge priority={company.priority} />
              </Link>
            </Td>
            <Td className="text-[#666666]">
              <Link className="block" href={`/companies/${company.id}`}>
                {formatDate(company.updatedAt)}
              </Link>
            </Td>
            <Td>
              <div className="flex justify-end gap-2">
                <CompanyDrawer
                  company={{
                    id: company.id,
                    name: company.name,
                    industry: company.industry,
                    jobType: company.jobType,
                    status: company.status,
                    priority: company.priority,
                    color: company.color,
                    mypageId: company.mypageId,
                    mypageUrl: company.mypageUrl,
                    memo: company.memo,
                  }}
                  mode="edit"
                  redirectTo="/companies"
                  triggerClassName={buttonClasses({
                    variant: "secondary",
                    className: "h-8 px-3",
                  })}
                  triggerLabel="編集"
                />
                <form action={deleteCompany.bind(null, company.id)}>
                  <Button className="h-8 px-3" type="submit" variant="danger">
                    削除
                  </Button>
                </form>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
