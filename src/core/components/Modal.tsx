import React from "react"
import cn from "classnames"

type Props = {
  children: React.ReactNode
  open: boolean
  size: string
}

const Modal = ({ children, open, size }: Props) => {
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

export default Modal
