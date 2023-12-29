import React from "react"
import cn from "classnames"

type Props = {
  children: React.ReactNode
  open: boolean
  size: string
}

const AssignmentModal = ({ children, open, size }: Props) => {
  const modalClass = cn({
    modal: true,
    "modal-open": open,
  })

  return (
    <dialog className={modalClass}>
      <div className={`modal-box ${size}`}>{children}</div>
    </dialog>
  )
}

AssignmentModal.authenticate = true

export default AssignmentModal
