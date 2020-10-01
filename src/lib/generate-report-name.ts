import { OrgData } from "./get-org-data";

export function generateReportName(orgData: OrgData, view: string): string {
  return `${orgData.slug}-${orgData.id}-${view}`;
}
