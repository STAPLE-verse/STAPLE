import React, { useState } from "react"
import { Assignment, Prisma } from "db"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Table from "src/core/components/Table"
import Modal from "src/core/components/Modal"
import TeamMembersTable, { TeamOption } from "src/teams/components/TeamMembersTable"
import AssignTeamMembers from "src/teams/components/TeamMembersTable"

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
        <button type="button" className="btn" onClick={handleToggle}>
          Show metadata
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

// const expandRow = (row) => {
//   console.log(row)
// }

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
      cell: (info) => (
        <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>
      ),
      header: "Last Update",
      id: "updatedAt",
    }
  ),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "status",
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
  columnHelper.accessor("task.schema", {
    cell: (info) => (
      <>
        {info.row.original.task.schema ? (
          <AssignmentMetadataModal metadata={info.row.original.statusLogs[0]?.metadata} />
        ) : (
          <span>No schema provided</span>
        )}
      </>
    ),
    header: "Task Schema",
  }),
]
