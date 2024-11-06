import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import { useMutation } from "@blitzjs/rpc"
import createAnnouncement from "src/notifications/mutations/createAnnouncement"
import { AnnouncementForm } from "src/projects/components/AnnouncementForm"
import { FormAnnouncementSchema } from "src/projects/schemas"

interface AnnouncementModalProps {
  projectId: number
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ projectId }) => {
  const [openModal, setOpenModal] = useState(false)
  const [createAnnouncementMutation] = useMutation(createAnnouncement)

  const handleToggle = () => setOpenModal((prev) => !prev)

  const handleSubmit = async (values) => {
    try {
      await createAnnouncementMutation({
        projectId,
        announcementText: values.announcementText,
      })
      setOpenModal(false)
    } catch (error) {
      console.error("Error creating announcement:", error)
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary mb-4" onClick={handleToggle}>
        Create Announcement
      </button>
      <Modal open={openModal} size="w-1/3">
        <AnnouncementForm
          submitText="Send Announcement"
          schema={FormAnnouncementSchema}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={handleToggle}
        />
      </Modal>
    </>
  )
}

export default AnnouncementModal
