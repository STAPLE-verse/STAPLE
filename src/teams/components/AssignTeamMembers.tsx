import { useQuery } from "@blitzjs/rpc"
import React, { useCallback } from "react"
import getContributors from "src/contributors/queries/getContributors"
import getInvites from "src/invites/queries/getInvites"
import Table from "src/core/components/Table"
import { useField, useForm } from "react-final-form"

interface AssignTeamMembersProps {
  projectId: number
}

const AssignTeamMembers: React.FC<AssignTeamMembersProps> = ({ projectId }) => {
  const [{ contributors }] = useQuery(getContributors, { projectId, deleted: false })
  const [pendingInvites] = useQuery(getInvites, { where: { projectId } })
  const form = useForm()

  const memberOptions = contributors.map((contributor) => ({
    id: contributor.users[0]!.id,
    label: contributor.users[0]?.firstName
      ? `${contributor.users[0]?.firstName} ${contributor.users[0]?.lastName} (${contributor.users[0]?.username})`
      : `${contributor.users[0]?.username}`,
    pending: false,
  }))

  const inviteOptions = pendingInvites.map((invite) => ({
    id: invite.id,
    label: invite.email,
    pending: true,
  }))

  const allOptions = [...memberOptions, ...inviteOptions]
  const allMemberIds = memberOptions.map((o) => o.id)
  const allInviteIds = inviteOptions.map((o) => o.id)

  const {
    input: { value: selectedMemberIds, onChange: setSelectedMemberIds },
  } = useField("projectMemberUserIds", { subscription: { value: true } })

  const {
    input: { value: selectedInviteIds, onChange: setSelectedInviteIds },
  } = useField("pendingInvitationIds", { subscription: { value: true } })

  const toggle = useCallback(
    (item) => {
      if (item.pending) {
        const ids: number[] = selectedInviteIds || []
        const isChecked = ids.includes(item.id)
        setSelectedInviteIds(isChecked ? ids.filter((id) => id !== item.id) : [...ids, item.id])
      } else {
        const ids: number[] = selectedMemberIds || []
        const isChecked = ids.includes(item.id)
        setSelectedMemberIds(isChecked ? ids.filter((id) => id !== item.id) : [...ids, item.id])
      }
    },
    [selectedMemberIds, selectedInviteIds, setSelectedMemberIds, setSelectedInviteIds]
  )

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        header: "Select",
        cell: ({ row }) => {
          const item = row.original
          const checked = item.pending
            ? (selectedInviteIds || []).includes(item.id)
            : (selectedMemberIds || []).includes(item.id)
          return (
            <input
              type="checkbox"
              className="checkbox checkbox-primary border-2"
              checked={checked}
              onChange={() => toggle(item)}
            />
          )
        },
      },
      {
        id: "name",
        accessorKey: "label",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        id: "status",
        accessorKey: "pending",
        header: "Status",
        filterFn: (row, _id, filterValue) => {
          if (filterValue === "" || filterValue === undefined) return true
          return String(row.original.pending) === filterValue
        },
        sortingFn: (a, b) => {
          return Number(a.original.pending) - Number(b.original.pending)
        },
        cell: ({ row }) =>
          row.original.pending ? (
            <span className="badge badge-warning badge-sm">pending</span>
          ) : (
            <span className="badge badge-success badge-sm">joined</span>
          ),
        meta: {
          filterVariant: "select",
          selectOptions: [
            { label: "Joined", value: "false" },
            { label: "Pending", value: "true" },
          ],
        },
      },
    ],
    [selectedMemberIds, selectedInviteIds, toggle]
  )

  return (
    <div className="col-span-full w-full">
      <label className="block mb-2 font-semibold">Add Team Members:</label>
      <div className="flex gap-3 mb-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            form.change("projectMemberUserIds", allMemberIds)
            form.change("pendingInvitationIds", allInviteIds)
          }}
        >
          {`Select all (${allOptions.length})`}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            form.change("projectMemberUserIds", [])
            form.change("pendingInvitationIds", [])
          }}
        >
          Clear
        </button>
      </div>
      {allOptions.length > 0 ? (
        <Table columns={columns} data={allOptions} addPagination={true} />
      ) : (
        <p className="text-base-content/60 italic text-sm">No members yet.</p>
      )}
    </div>
  )
}

export default AssignTeamMembers
