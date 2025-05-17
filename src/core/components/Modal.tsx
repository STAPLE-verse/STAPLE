import React from "react"
import cn from "classnames"
import { Modal as OverlayModal } from "react-overlays"

type Props = {
  children?: React.ReactNode
  open: boolean
  size?: string
}

const Modal = ({ children, open, size = "max-w-lg" }: Props) => {
  return (
    <OverlayModal
      show={open}
      renderBackdrop={(props) => (
        <div {...props} className="fixed inset-0 bg-black opacity-50 z-[1040]" />
      )}
      className="fixed inset-0 flex items-center justify-center z-[1050] overflow-y-auto"
    >
      <div
        className={cn(
          "flex justify-center bg-base-100 p-4 rounded-lg shadow-lg relative max-w-lg w-full md:max-w-4xl max-h-[90vh] overflow-y-auto",
          size
        )}
      >
        <div className="w-full">{children}</div>
      </div>
    </OverlayModal>
  )
}

export default Modal
