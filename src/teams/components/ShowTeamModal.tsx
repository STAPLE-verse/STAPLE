import { useState } from "react"
import Modal from "src/core/components/Modal"
import { Tooltip } from "react-tooltip"
import { TeamMembers, TeamMembersColumn } from "src/teams/tables/columns/TeamMembersColumn"
import Table from "src/core/components/Table"

export const ShowTeamModal = ({ projectMember }) => {
  const [openModal, setOpenModal] = useState(false)

  const teamMembers = projectMember.users.map((user) => {
    return {
      username: user.username,
    } as TeamMembers
  })

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-tooltip-id="showTeamModalTooltip"
        data-testid="open-modal"
        onClick={() => handleToggle()}
      >
        <span>{`${projectMember.name}`}</span>
      </button>
      <Tooltip
        id="showTeamModalTooltip"
        content="Show team members"
        className="z-[1099] ourtooltips"
      />

      <Modal open={openModal} size="w-7/6 max-w-1xl">
        <div className="flex flex-col justify-start mt-4">
          <h3>Team Members</h3>
          <Table columns={TeamMembersColumn} data={teamMembers} addPagination={true} />
        </div>
        <div className="modal-action flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
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
