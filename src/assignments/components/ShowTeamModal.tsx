import { useState } from "react"
import Modal from "src/core/components/Modal"
import { getContributorName, getTeamName } from "src/services/getName"
import AssignTeamMembers, { TeamOption } from "src/teams/components/TeamMembersTable"

export const ShowTeamModal = ({ team }) => {
  const [openModal, setOpenModal] = useState(false)

  let contributors = team.contributors

  const teamMembers = contributors.map((contributor) => {
    return {
      userName: getContributorName(contributor),
      id: contributor.id,
      checked: false,
      teamId: team.id,
    } as TeamOption
  })

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="mt-4">
        <button onClick={() => handleToggle()}>
          <span>{`${getTeamName(team)}`}</span>
        </button>

        <Modal open={openModal} size="w-7/6 max-w-1xl">
          <div className="flex justify-start mt-4">
            <AssignTeamMembers showCheckbox={false} teamOptions={teamMembers}></AssignTeamMembers>
          </div>
          <div className="modal-action flex justify-end mt-4">
            {/* TODO: Add tooltip that say: click to show team members */}
            <button type="button" className="btn btn-primary" onClick={handleToggle}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}
