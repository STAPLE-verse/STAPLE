import { useState } from "react"
import Modal from "src/core/components/Modal"
import { TeamMembers, TeamMembersColumn } from "src/teams/tables/columns/TeamMembersColumn"
import Table from "src/core/components/Table"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getTeam from "../queries/getTeam"

export const ShowTeamModal = ({ teamId, disabled }) => {
  const [openModal, setOpenModal] = useState(false)

  const [team] = useQuery(getTeam, { id: teamId })

  const teamMembers: TeamMembers[] = team.users.map((user) => ({
    contributorId: user.contributorId,
    projectId: team.projectId,
    username: user.username,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
  }))

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary w-2/3"
        data-tooltip-id="showTeamModalTooltip"
        data-testid="open-modal"
        onClick={() => handleToggle()}
        disabled={disabled}
      >
        <span className="truncate max-w-xs overflow-hidden">{team.name}</span>
      </button>
      <TooltipWrapper
        id="showTeamModalTooltip"
        content="Show team members"
        className="z-[1099] ourtooltips"
      />

      <Modal open={openModal} size="w-7/6 max-w-1xl">
        <div className="flex flex-col justify-start mt-4">
          <h3 className="flex justify-center mb-2 text-3xl">
            <span className="mr-1">Members:</span>
            <span className="italic">{team.name}</span>
          </h3>
          <Table columns={TeamMembersColumn} data={teamMembers} addPagination={true} />
        </div>
        <div className="modal-action flex justify-end mt-4">
          <Link
            className="btn btn-info"
            href={Routes.ShowTeamPage({
              projectId: team.projectId,
              teamId: teamId,
            })}
          >
            Go to Team
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleToggle}
            data-testid="close-modal"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
