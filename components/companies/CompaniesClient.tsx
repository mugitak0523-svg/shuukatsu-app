"use client";

import { useMemo, useState } from "react";

import { CompanyDrawer } from "@/components/companies/CompanyDrawer";
import { CompanyTable } from "@/components/companies/CompanyTable";
import type { CompanyListItem } from "@/components/companies/types";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { XIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";
import {
  COMPANY_INDUSTRY_OPTIONS,
  COMPANY_JOB_TYPE_OPTIONS,
  COMPANY_PRIORITY_OPTIONS,
  COMPANY_STATUS_OPTIONS,
} from "@/lib/constants/company";

type CompaniesClientProps = {
  companies: CompanyListItem[];
  companyColors: string[];
};

export function CompaniesClient({
  companies,
  companyColors,
}: CompaniesClientProps) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesQuery = normalizedQuery
        ? [
            company.name,
            company.industry,
            company.jobType,
            company.mypageId,
          ].some((value) => value?.toLowerCase().includes(normalizedQuery))
        : true;
      const matchesStatus = statuses.length > 0
        ? statuses.includes(company.status)
        : true;
      const matchesPriority = priorities.length > 0
        ? Boolean(company.priority && priorities.includes(company.priority))
        : true;
      const matchesIndustry = industries.length > 0
        ? Boolean(company.industry && industries.includes(company.industry))
        : true;
      const matchesJobType = jobTypes.length > 0
        ? Boolean(company.jobType && jobTypes.includes(company.jobType))
        : true;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesPriority &&
        matchesIndustry &&
        matchesJobType
      );
    });
  }, [companies, industries, jobTypes, priorities, query, statuses]);
  const hasFilters = Boolean(
    query ||
      statuses.length > 0 ||
      priorities.length > 0 ||
      industries.length > 0 ||
      jobTypes.length > 0,
  );

  function clearFilters() {
    setQuery("");
    setStatuses([]);
    setPriorities([]);
    setIndustries([]);
    setJobTypes([]);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_160px_160px_160px_160px_auto_auto]">
        <div className="relative">
          <Input
            className="pr-9"
            name="q"
            placeholder="企業名・業界・職種・IDで検索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              aria-label="検索語をクリア"
              className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-[#999999] hover:text-[#111111]"
              type="button"
              onClick={() => setQuery("")}
            >
              <XIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <MultiSelectFilter
          label="業界"
          options={COMPANY_INDUSTRY_OPTIONS}
          value={industries}
          onValueChange={setIndustries}
        />
        <MultiSelectFilter
          label="職種"
          options={COMPANY_JOB_TYPE_OPTIONS}
          value={jobTypes}
          onValueChange={setJobTypes}
        />
        <MultiSelectFilter
          label="ステータス"
          options={COMPANY_STATUS_OPTIONS}
          value={statuses}
          onValueChange={setStatuses}
        />
        <MultiSelectFilter
          label="志望度"
          options={COMPANY_PRIORITY_OPTIONS}
          value={priorities}
          onValueChange={setPriorities}
        />
        <button
          className="h-10 cursor-pointer rounded-md border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-[#111111] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasFilters}
          type="button"
          onClick={clearFilters}
        >
          クリア
        </button>
        <CompanyDrawer
          existingColors={companyColors}
          mode="create"
          triggerClassName={buttonClasses({ className: "whitespace-nowrap" })}
          triggerLabel="企業を追加"
        />
      </div>

      {filteredCompanies.length > 0 ? (
        <CompanyTable companies={filteredCompanies} />
      ) : companies.length > 0 ? (
        <div className="rounded-lg border border-dashed border-[#d4d4d4] bg-white px-6 py-16 text-center text-sm text-[#666666]">
          条件に一致する企業がありません
        </div>
      ) : (
        <EmptyState
          action={
            <CompanyDrawer
              existingColors={companyColors}
              mode="create"
              triggerClassName={buttonClasses({ className: "mt-6" })}
              triggerLabel="企業を追加"
            />
          }
        />
      )}
    </div>
  );
}
