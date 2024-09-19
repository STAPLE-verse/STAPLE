import { useState } from "react"
import Modal from "src/core/components/Modal"
import { Tooltip } from "react-tooltip"
import { TeamMembers, teamMembersTableColumns } from "src/teams/components/TeamMembersTable"
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
    <div className="">
      <button
        type="button"
        className="btn btn-primary"
        data-tooltip-id="showTeamModalTooltip"
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
          <h3>Team members</h3>
          <Table columns={teamMembersTableColumns} data={teamMembers} addPagination={true} />
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
