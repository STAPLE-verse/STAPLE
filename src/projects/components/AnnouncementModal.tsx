import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import { useMutation } from "@blitzjs/rpc"
import createAnnouncement from "src/notifications/mutations/createAnnouncement"
import { AnnouncementForm } from "src/projects/components/AnnouncementForm"
import { FormAnnouncementSchema } from "src/projects/schemas"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

interface AnnouncementModalProps {
  projectId: number
  refreshWidgets: () => Promise<void>
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ projectId, refreshWidgets }) => {
  const [openModal, setOpenModal] = useState(false)
  const [createAnnouncementMutation] = useMutation(createAnnouncement)

  const handleToggle = () => setOpenModal((prev) => !prev)

  const handleSubmit = async (values) => {
    console.log("Form Values:", values)
    try {
      await createAnnouncementMutation({
        projectId,
        announcementText: values.announcementText,
        projectMembersId: values.projectMembersId ?? [],
        teamsId: values.teamsId ?? [],
      })
      await refreshWidgets()
      setOpenModal(false)
    } catch (error) {
      console.error("Error creating announcement:", error)
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary mb-4" onClick={handleToggle}>
        Create Announcement
        <InformationCircleIcon
          className="h-6 w-6 text-base stroke-2"
          data-tooltip-id="add-announcement"
        />
        <Tooltip
          id="add-announcement"
          content="When you send an announcement, everyone on the project will receive a notification with your message—it's a simple way to keep all members updated. You can also choose to send it to specific people or teams."
          className="z-[1099] ourtooltips"
        />
      </button>
      <Modal open={openModal} size="w-1/3">
        <h2 className="justify-center items-center flex mb-2 text-3xl">
          Create Announcement
          <InformationCircleIcon
            className="h-6 w-6 text-info stroke-2"
            data-tooltip-id="add-announcement-modal"
          />
          <Tooltip
            id="add-announcement-modal"
            content="When you send an announcement, everyone on the project will receive a notification with your message—it's a simple way to keep all members updated. You can also choose to send it to specific people or teams."
            className="z-[1099] ourtooltips"
          />
        </h2>
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
