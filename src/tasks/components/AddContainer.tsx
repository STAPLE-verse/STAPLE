import Modal from "src/core/components/Modal"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import Form from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { z } from "zod"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { MemberPrivileges } from "db"
import { Tooltip } from "react-tooltip"

const AddContainerSchema = z.object({
  containerName: z.string(),
})

const AddContainer = ({
  projectId,
  show,
  onClose,
  onSubmitName,
}: {
  projectId: number
  show: boolean
  onClose: () => void
  onSubmitName: (name: string) => void
}) => {
  const onAddContainer = async (values) => {
    try {
      onSubmitName(values.containerName)
      onClose()
    } catch (error) {
      console.error("Failed to add column:", error)
      return { [FORM_ERROR]: error.toString() }
    }
  }

  return (
    <>
      <Modal open={show}>
        <h1 className="flex justify-center mb-2 items-center text-3xl">
          Add New Column
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="new-column-tasks"
          />
          <Tooltip
            id="new-column-tasks"
            content="Add a new column to your kanban board. You’ll be able to rename or delete it later."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Form
          schema={AddContainerSchema}
          onSubmit={onAddContainer}
          submitText="Add New Column"
          cancelText="Close"
          onCancel={onClose}
        >
          <LabeledTextField
            className="input w-full text-primary input-primary input-bordered border-2 bg-base-300"
            name="containerName"
            label="Column Title:"
            placeholder="Type column title here..."
            type="text"
          />
        </Form>
      </Modal>
    </>
  )
}

export default AddContainer
