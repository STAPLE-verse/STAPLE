import { useQuery } from "@blitzjs/rpc"
import React from "react"
import getContributors from "src/contributors/queries/getContributors"
import getInvites from "src/invites/queries/getInvites"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import { useForm } from "react-final-form"

interface AssignTeamMembersProps {
  projectId: number
}

const AssignTeamMembers: React.FC<AssignTeamMembersProps> = ({ projectId }) => {
  const [{ contributors }] = useQuery(getContributors, { projectId, deleted: false })
  const [pendingInvites] = useQuery(getInvites, { where: { projectId } })

  const memberOptions = contributors.map((contributor) => ({
    id: contributor.users[0]!.id,
    label: contributor.users[0]?.firstName
      ? `${contributor.users[0]?.firstName} ${contributor.users[0]?.lastName} (${contributor.users[0]?.username})`
      : `${contributor.users[0]?.username}`,
  }))

  const inviteOptions = pendingInvites.map((invite) => ({
    id: invite.id,
    label: invite.email,
  }))

  const allMemberIds = memberOptions.map((o) => o.id)
  const allInviteIds = inviteOptions.map((o) => o.id)
  const form = useForm()

  return (
    <div className="col-span-full w-full grid grid-cols-1 gap-4">
      <div>
        <label className="block mb-2 font-semibold">Add Joined Members:</label>
        <div className="flex flex-col mb-1">
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => form.change("projectMemberUserIds", allMemberIds)}
            >
              {`Select all (${allMemberIds.length})`}
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
        {memberOptions.length > 0 ? (
          <CheckboxFieldTable name="projectMemberUserIds" options={memberOptions} />
        ) : (
          <p className="text-base-content/60 italic text-sm">No joined members yet.</p>
        )}
      </div>

      {inviteOptions.length > 0 && (
        <div>
          <label className="block mb-2 font-semibold">
            Add Invited Members{" "}
            <span className="badge badge-warning badge-sm align-middle">invited</span>
          </label>
          <p className="text-sm italic text-base-content/70 mb-2">
            These people have been invited but haven&apos;t joined yet. They&apos;ll be
            automatically added to the team when they accept their invite.
          </p>
          <div className="flex gap-3 mb-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => form.change("pendingInvitationIds", allInviteIds)}
            >
              {`Select all (${allInviteIds.length})`}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => form.change("pendingInvitationIds", [])}
            >
              Clear
            </button>
          </div>
          <CheckboxFieldTable name="pendingInvitationIds" options={inviteOptions} />
        </div>
      )}
    </div>
  )
}

export default AssignTeamMembers
