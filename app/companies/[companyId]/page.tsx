import { deleteCompany } from "@/server/actions/company";
import { CompanyDrawer } from "@/components/companies/CompanyDrawer";
import { CompanyPriorityBadge } from "@/components/companies/CompanyPriorityBadge";
import { CompanyStatusBadge } from "@/components/companies/CompanyStatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, buttonClasses } from "@/components/ui/Button";
import { DEFAULT_COMPANY_COLOR, normalizeCompanyColor } from "@/lib/constants/company";
import { formatDate } from "@/lib/utils";
import { getCompanyById } from "@/server/queries/company";

type CompanyDetailPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { companyId } = await params;
  const company = await getCompanyById(companyId);
  const companyColor = normalizeCompanyColor(
    (company as typeof company & { color?: string | null }).color ??
      DEFAULT_COMPANY_COLOR,
  );
  const mypageId =
    (company as typeof company & { mypageId?: string | null }).mypageId ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={company.name}
        description="企業詳細"
        action={
          <div className="flex gap-2">
            <CompanyDrawer
              company={{
                id: company.id,
                name: company.name,
                industry: company.industry,
                jobType: company.jobType,
                status: company.status,
                priority: company.priority,
                color: companyColor,
                mypageId,
                mypageUrl: company.mypageUrl,
                memo: company.memo,
              }}
              mode="edit"
              redirectTo={`/companies/${company.id}`}
              triggerClassName={buttonClasses({ variant: "secondary" })}
              triggerLabel="編集"
            />
            <form action={deleteCompany.bind(null, company.id)}>
              <Button type="submit" variant="danger">
                削除
              </Button>
            </form>
          </div>
        }
      />

      <section className="grid gap-4 rounded-lg border border-[#e5e5e5] bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-[#666666]">色</p>
          <div className="mt-2 inline-flex items-center gap-2 text-sm text-[#111111]">
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: companyColor }}
            />
            {companyColor}
          </div>
        </div>
        <DetailItem label="業界" value={company.industry ?? "-"} />
        <DetailItem label="職種" value={company.jobType ?? "-"} />
        <div>
          <p className="text-sm text-[#666666]">選考ステータス</p>
          <div className="mt-2">
            <CompanyStatusBadge status={company.status} />
          </div>
        </div>
        <div>
          <p className="text-sm text-[#666666]">志望度</p>
          <div className="mt-2">
            <CompanyPriorityBadge priority={company.priority} />
          </div>
        </div>
        <DetailItem
          label="マイページID"
          value={mypageId ?? "-"}
        />
        <DetailItem
          label="マイページURL"
          value={
            company.mypageUrl ? (
              <a className="underline underline-offset-4" href={company.mypageUrl} rel="noreferrer" target="_blank">
                {company.mypageUrl}
              </a>
            ) : (
              "-"
            )
          }
        />
        <DetailItem label="作成日" value={formatDate(company.createdAt)} />
        <DetailItem label="更新日" value={formatDate(company.updatedAt)} />
        <div className="sm:col-span-2">
          <p className="text-sm text-[#666666]">メモ</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#111111]">
            {company.memo || "-"}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[#d4d4d4] bg-white p-6">
        <p className="text-sm font-medium text-[#111111]">今後追加する領域</p>
        <p className="mt-2 text-sm text-[#666666]">
          予定、ES、タスク、面接記録、企業研究メモを今後ここに追加できます。
        </p>
      </section>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-[#666666]">{label}</p>
      <div className="mt-2 text-sm text-[#111111]">{value}</div>
    </div>
  );
}
