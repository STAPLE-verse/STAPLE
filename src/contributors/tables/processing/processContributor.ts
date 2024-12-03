import { ProjectMemberWithUsers } from "src/core/types"
import { getContributorName } from "src/core/utils/getName"

// Define return type for the columns
export type ContributorTableData = {
  name: string
  id: number
  projectId?: number
}

export function processContributor(
  contributors: ProjectMemberWithUsers[],
  projectId: number
): ContributorTableData[] {
  return contributors.map((contributor) => {
    return {
      name: getContributorName(contributor),
      id: contributor.id,
      projectId: projectId,
    }
  })
}
