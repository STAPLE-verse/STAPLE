import { useState } from "react"
import Modal from "src/core/components/Modal"
import { getContributorName, getTeamName } from "src/services/getName"
import { Tooltip } from "react-tooltip"
import { TeamMembers, teamMembersTableColumns } from "src/teams/components/TeamMembersTable"
import Table from "src/core/components/Table"

export const ShowTeamModal = ({ team }) => {
  const [openModal, setOpenModal] = useState(false)

  let contributors = team.contributors

  const teamMembers = contributors.map((contributor) => {
    return {
      username: getContributorName(contributor),
    } as TeamMembers
  })

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        className="btn btn-primary"
        data-tooltip-id="showTeamModalTooltip"
        onClick={() => handleToggle()}
      >
        <span>{`${getTeamName(team)}`}</span>
      </button>
      <Tooltip id="showTeamModalTooltip" content="Show team members" className="z-[1099]" />

      <Modal open={openModal} size="w-7/6 max-w-1xl">
        <div className="flex flex-col justify-start mt-4">
          <h3>Team members</h3>
          <Table columns={teamMembersTableColumns} data={teamMembers} />
        </div>
        <div className="modal-action flex justify-end mt-4">
          <button type="button" className="btn btn-primary" onClick={handleToggle}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
