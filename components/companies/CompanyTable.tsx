"use client";

import {
  CompanyMypageLink,
  CompanyMypageIdCopy,
  CompanyTableRow,
  CompanyTableRowActions,
} from "@/components/companies/CompanyTableRow";
import type { CompanyListItem } from "@/components/companies/types";
import { CompanyPriorityBadge } from "@/components/companies/CompanyPriorityBadge";
import { CompanyStatusBadge } from "@/components/companies/CompanyStatusBadge";
import { Table, Td, Th } from "@/components/ui/Table";
import { DEFAULT_COMPANY_COLOR, normalizeCompanyColor } from "@/lib/constants/company";

export function CompanyTable({ companies }: { companies: CompanyListItem[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>企業名</Th>
          <Th>業界</Th>
          <Th>職種</Th>
          <Th>ステータス</Th>
          <Th>志望度</Th>
          <Th>ID</Th>
          <Th>マイページ</Th>
          <Th className="text-right">操作</Th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <CompanyTableRow key={company.id} href={`/companies/${company.id}`}>
            <Td>
              <span className="inline-flex items-center gap-2 font-medium text-[#111111]">
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
            </Td>
            <Td className="text-[#666666]">{company.industry || "-"}</Td>
            <Td className="text-[#666666]">{company.jobType || "-"}</Td>
            <Td>
              <CompanyStatusBadge status={company.status} />
            </Td>
            <Td>
              <CompanyPriorityBadge priority={company.priority} />
            </Td>
            <Td>
              <CompanyMypageIdCopy mypageId={company.mypageId} />
            </Td>
            <Td>
              <CompanyMypageLink url={company.mypageUrl} />
            </Td>
            <Td>
              <CompanyTableRowActions company={company} />
            </Td>
          </CompanyTableRow>
        ))}
      </tbody>
    </Table>
  );
}
