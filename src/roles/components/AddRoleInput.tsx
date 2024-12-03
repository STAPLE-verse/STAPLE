import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import { Tooltip } from "react-tooltip"
import RoleSelect from "./RoleSelect"

interface AddRoleInputProps {
  projectManagerIds: number[]
  buttonLabel: string
  tooltipContent: string
}

const AddRoleInput: React.FC<AddRoleInputProps> = ({
  projectManagerIds,
  buttonLabel,
  tooltipContent,
}) => {
  const [openRolesModal, setRolesModal] = useState(false)
  const handleToggleRolesModal = () => setRolesModal((prev) => !prev)

  return (
    <>
      <Tooltip
        id="role-tooltip"
        content={tooltipContent}
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      <button
        type="button"
        className="btn btn-primary w-1/2"
        data-tooltip-id="role-tooltip"
        onClick={handleToggleRolesModal}
      >
        {buttonLabel}
      </button>

      <Modal open={openRolesModal} size="w-7/8 max-w-xl">
        <div>
          <div className="flex justify-start mt-4">
            <RoleSelect projectManagerIds={projectManagerIds} />
          </div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-primary" onClick={handleToggleRolesModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AddRoleInput
