import { CompanyPriority } from "@prisma/client";

import { Badge } from "@/components/ui/Badge";
import { COMPANY_PRIORITY_LABELS } from "@/lib/constants/company";

export function CompanyPriorityBadge({
  priority,
}: {
  priority: CompanyPriority | null;
}) {
  if (!priority) {
    return <span className="text-sm text-[#999999]">-</span>;
  }

  return <Badge>{COMPANY_PRIORITY_LABELS[priority]}</Badge>;
}
