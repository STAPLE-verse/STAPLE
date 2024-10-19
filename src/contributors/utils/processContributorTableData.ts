import { getContributorName } from "src/services/getName"

// Define return type for the columns
export type ContributorTableData = {
  name: string
  id: number
  projectId?: number
}

export function processContributorTableData(contributors, projectId): ContributorTableData[] {
  return contributors.map((contributor) => {
    return {
      name: getContributorName(contributor),
      id: contributor.id,
      projectId: projectId,
    }
  })
}
