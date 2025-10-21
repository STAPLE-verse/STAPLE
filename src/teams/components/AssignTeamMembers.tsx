import { useQuery } from "@blitzjs/rpc"
import React from "react"
import getContributors from "src/contributors/queries/getContributors"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import { useForm } from "react-final-form"

interface AssignTeamMembersProps {
  projectId: number
}

const AssignTeamMembers: React.FC<AssignTeamMembersProps> = ({ projectId }) => {
  const [contributors] = useQuery(getContributors, { projectId, deleted: false })

  const options = contributors.map((contributor) => ({
    id: contributor.users[0]!.id,
    label: contributor.users[0]?.firstName
      ? `${contributor.users[0]?.firstName} ${contributor.users[0]?.lastName} (${contributor.users[0]?.username})`
      : `${contributor.users[0]?.username}`,
  }))

  const allMemberIds = options.map((o) => o.id)
  const form = useForm()

  return (
    <div className="col-span-full w-full grid grid-cols-1 gap-4">
      <label className="block mb-2 font-semibold">Add Team Members:</label>
      <div className="flex flex-col mb-1">
        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => form.change("projectMemberUserIds", allMemberIds)}
          >
            {`Select all members (${allMemberIds.length})`}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => form.change("projectMemberUserIds", [])}
          >
            Clear
          </button>
        </div>
      </div>
      <div>
        <CheckboxFieldTable name="projectMemberUserIds" options={options} />
      </div>
    </div>
  )
}

export default AssignTeamMembers
