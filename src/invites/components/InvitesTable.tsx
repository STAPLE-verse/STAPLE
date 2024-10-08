import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import declineInvite from "../mutations/declineInvite"
import acceptInvite from "../mutations/acceptInvite"
import toast from "react-hot-toast"
import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

// Define return type for the columns
export type Invite = {
  createdAt: Date
  project?: { name: string }
  invitationCode: string
  id: number
  email: string
  onChangeCallback?: () => void
}

// use column helper
const columnHelper = createColumnHelper<Invite>()

// functions for accept/delete
const DeleteInvite = ({ row }) => {
  const [declineInviteMutation] = useMutation(declineInvite)
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleDeleteInvite = async (values) => {
    if (window.confirm("This invitation will be permanently deleted. Are you sure to continue?")) {
      try {
        const updated = await declineInviteMutation({
          id: id,
        })
        if (onChangeCallback != undefined) {
          onChangeCallback()
        }
        await toast.promise(Promise.resolve(updated), {
          loading: "Deleting invitation...",
          success: "Invitation deleted!",
          error: "Failed to delete the invitation...",
        })
      } catch (error: any) {
        console.error(error)
        return {
          [FORM_ERROR]: error.toString(),
        }
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-ghost"
        onClick={handleDeleteInvite}
      >
        <XCircleIcon width={50} className="stroke-primary">
          Decline
        </XCircleIcon>
      </button>
    </div>
  )
}

const AcceptInvite = ({ row }) => {
  const [acceptInviteMutation] = useMutation(acceptInvite)
  const router = useRouter()
  const currentUser = useCurrentUser()
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleAcceptInvite = async (values) => {
    try {
      const updated = await acceptInviteMutation({
        id: id,
        userId: currentUser!.id,
      })

      if (onChangeCallback != undefined) {
        onChangeCallback()
      }

      await toast.promise(Promise.resolve(updated), {
        loading: "Accepting invitation...",
        success: "Invitation accepted!",
        error: "Failed to accept the invitation...",
      })

      await router.push(Routes.ShowProjectPage({ projectId: updated!.id }))
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-ghost"
        onClick={handleAcceptInvite}
      >
        <CheckCircleIcon width={50} className="stroke-primary">
          Accept
        </CheckCircleIcon>
      </button>
    </div>
  )
}

// ColumnDefs
export const inviteTableColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
  }),
  columnHelper.accessor("project.name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
  }),
  columnHelper.accessor("invitationCode", {
    header: "Invitation Code",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    id: "accept",
    header: "Accept",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AcceptInvite row={info.row.original}></AcceptInvite>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Decline",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteInvite row={info.row.original}></DeleteInvite>,
  }),
]

// ColumnDefs
export const inviteTableColumnsPM = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
  }),
  columnHelper.accessor("email", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Email",
  }),
  columnHelper.accessor("invitationCode", {
    header: "Invitation Code",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteInvite row={info.row.original}></DeleteInvite>,
  }),
]
