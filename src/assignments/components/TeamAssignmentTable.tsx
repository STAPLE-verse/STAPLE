import React, { useState } from "react"
import { Prisma } from "db"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import { TeamOption } from "src/teams/components/TeamMembersTable"
import AssignTeamMembers from "src/teams/components/TeamMembersTable"
import { AssignmentToggleModal } from "src/assignments/components/AssignmentTable"

import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { CompletedAs } from "db"
import getContributor from "src/contributors/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import CompleteSchemaPM from "src/assignments/components/CompleteSchemaPM"

export type TeamAssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: {
    task: true
    team: {
      include: {
        contributors: {
          include: {
            user: true
          }
        }
      }
    }
    statusLogs: true
  }
}>

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<TeamAssignmentWithRelations>()

const AssignmentMetadataModal = ({ metadata }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Edit Form Data
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action">
            {metadata ? (
              <div>{JSON.stringify(metadata, null, 2)}</div>
            ) : (
              <span>No metadata provided</span>
            )}
            {/* Closes the modal */}
            <button type="button" className="btn btn-primary" onClick={handleToggle}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}

const TeamModal = ({ rowInfo }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  // console.log(rowInfo)
  let contributors = rowInfo.team.contributors

  const teamMembers = contributors.map((contributor) => {
    return {
      userName: contributor["user"].username,
      id: contributor.id,
      checked: false,
      teamId: rowInfo.id,
    } as TeamOption
  })

  return (
    <>
      <div className="mt-4">
        <button onClick={() => handleToggle()}>
          <span>{`${getName(rowInfo)}`}</span>
        </button>

        <Modal open={openModal} size="w-7/6 max-w-1xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <AssignTeamMembers showCheckbox={false} teamOptions={teamMembers}></AssignTeamMembers>
            </div>
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggle}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

function getName(info) {
  if (info.teamId != null) {
    if (info.hasOwnProperty("team")) {
      return info.team.name
    }
  }

  return "null"
}

// ColumnDefs
export const teamAssignmentTableColumns: ColumnDef<TeamAssignmentWithRelations>[] = [
  columnHelper.accessor("team.name", {
    cell: (info) => <div>{<TeamModal rowInfo={info.row.original}></TeamModal>}</div>,
    header: "Team Name",
  }),
  columnHelper.accessor(
    (row) =>
      row.statusLogs[0]?.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }),
    {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Update",
      id: "updatedAt",
    }
  ),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor((row) => row, {
    cell: (info) => {
      return (
        <div>
          <AssignmentToggleModal assignment={info.getValue()} />
        </div>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

export const teamAssignmentTableColumnsSchema: ColumnDef<TeamAssignmentWithRelations>[] = [
  columnHelper.accessor("team.name", {
    cell: (info) => <div>{<TeamModal rowInfo={info.row.original}></TeamModal>}</div>,
    header: "Team Name",
  }),
  columnHelper.accessor(
    (row) =>
      row.statusLogs[0]?.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }),
    {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Update",
      id: "updatedAt",
    }
  ),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor((row) => row, {
    cell: (info) => {
      const currentUser = useCurrentUser()
      const projectId = useParam("projectId", "number")
      const [currentContributor] = useQuery(getContributor, {
        where: { projectId: projectId, userId: currentUser!.id },
      })
      //console.log(info.getValue())

      return (
        <CompleteSchemaPM
          currentAssignment={info.getValue()}
          completedBy={currentContributor.id}
          completedAs={CompletedAs.TEAM}
          schema={info.getValue().task.schema}
          ui={info.getValue().task.ui}
        />
      )
    },
    header: "Form Data",
  }),
]
