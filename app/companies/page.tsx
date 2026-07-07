import { CompanyDrawer } from "@/components/companies/CompanyDrawer";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClasses } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import {
  COMPANY_PRIORITY_OPTIONS,
  COMPANY_STATUS_OPTIONS,
} from "@/lib/constants/company";
import { getCompanies, getCompanyColors } from "@/server/queries/company";

type CompaniesPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    priority?: string;
  }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const filters = (await searchParams) ?? {};
  const [companies, companyColors] = await Promise.all([
    getCompanies(filters),
    getCompanyColors(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="企業一覧"
        description="応募中・検討中の企業を管理します。"
        action={
          <CompanyDrawer
            existingColors={companyColors}
            mode="create"
            triggerClassName={buttonClasses()}
            triggerLabel="企業を追加"
          />
        }
      />

      <form className="grid gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 md:grid-cols-[1fr_180px_180px_auto]">
        <Input name="q" defaultValue={filters.q ?? ""} placeholder="企業名・業界・職種・IDで検索" />
        <Dropdown
          name="status"
          defaultValue={filters.status ?? ""}
          emptyLabel="すべてのステータス"
          options={COMPANY_STATUS_OPTIONS}
          placeholder="すべてのステータス"
        />
        <Dropdown
          name="priority"
          defaultValue={filters.priority ?? ""}
          emptyLabel="すべての志望度"
          options={COMPANY_PRIORITY_OPTIONS}
          placeholder="すべての志望度"
        />
        <button className={buttonClasses({ variant: "secondary" })} type="submit">
          検索
        </button>
      </form>

      {companies.length > 0 ? (
        <CompanyTable companies={companies} />
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
