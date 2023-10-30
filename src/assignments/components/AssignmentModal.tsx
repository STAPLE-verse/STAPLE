import React from "react"
import cn from "classnames"

type Props = {
  children: React.ReactNode
  open: boolean
}

const AssignmentModal = ({ children, open }: Props) => {
  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  })
  return (
    <dialog className={modalClass}>
      <div className="modal-box">{children}</div>
    </dialog>
  )
}

AssignmentModal.authenticate = true

export default AssignmentModal
