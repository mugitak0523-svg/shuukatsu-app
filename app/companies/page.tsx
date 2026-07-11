import { CompaniesClient } from "@/components/companies/CompaniesClient";
import { getCompanies, getCompanyColors } from "@/server/queries/company";

export default async function CompaniesPage() {
  const [companies, companyColors] = await Promise.all([
    getCompanies(),
    getCompanyColors(),
  ]);

  return (
    <CompaniesClient
      companies={companies.map((company) => ({
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
      }))}
      companyColors={companyColors}
    />
  );
}
