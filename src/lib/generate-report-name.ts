import { OrgData } from "./get-org-data";

export function generateReportName(orgData: OrgData, view: string): string {
  try {
    return `${orgData.slug}-${orgData.id}-${view}`;
  } catch (e) {
    return `${view}`;
  }
}
