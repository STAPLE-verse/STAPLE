import { useQuery } from "@blitzjs/rpc"
import React from "react"
import getContributors from "src/contributors/queries/getContributors"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"

interface AssignTeamMembersProps {
  projectId: number
}

const AssignTeamMembers: React.FC<AssignTeamMembersProps> = ({ projectId }) => {
  const [contributors] = useQuery(getContributors, { projectId })

  const options = contributors.map((contributor) => ({
    id: contributor.users[0]!.id,
    label: contributor.users[0]!.username,
  }))

  return (
    <div>
      <label>Add Team Members:</label>
      <CheckboxFieldTable name="projectMemberUserIds" options={options} />
    </div>
  )
}

export default AssignTeamMembers
