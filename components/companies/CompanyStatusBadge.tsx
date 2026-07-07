import { CompanyStatus } from "@prisma/client";

import { Badge } from "@/components/ui/Badge";
import { COMPANY_STATUS_LABELS } from "@/lib/constants/company";

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  return <Badge>{COMPANY_STATUS_LABELS[status]}</Badge>;
}
