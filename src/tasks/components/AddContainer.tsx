import { useMutation } from "@blitzjs/rpc"
import createColumn from "src/tasks/mutations/createColumn"
import { useState } from "react"
import Modal from "src/core/components/Modal"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import Form from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { z } from "zod"

const AddContainerSchema = z.object({
  containerName: z.string(),
})

const AddContainer = ({ projectId, refetch }) => {
  const [createColumnMutation] = useMutation(createColumn)
  const [showAddContainerModal, setShowAddContainerModal] = useState(false)

  const handleToggleContainerModal = () => {
    setShowAddContainerModal((prev) => !prev)
  }

  const onAddContainer = async (values) => {
    try {
      await createColumnMutation({ projectId, name: values.containerName })
      handleToggleContainerModal()
      refetch()
    } catch (error) {
      console.error("Failed to create column:", error)
      return { [FORM_ERROR]: error.toString() }
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowAddContainerModal(true)}
      >
        Add Column
      </button>

      <Modal open={showAddContainerModal}>
        <h1 className="flex justify-center mb-2 text-3xl">Add Column</h1>
        <Form
          schema={AddContainerSchema}
          onSubmit={onAddContainer}
          submitText="Add Column"
          cancelText="Close"
          onCancel={handleToggleContainerModal}
        >
          <LabeledTextField
            className="input text-primary input-primary input-bordered border-2 bg-base-300"
            name="containerName"
            label="Container Title: (Required)"
            placeholder="Enter container title..."
            type="text"
          />
        </Form>
      </Modal>
    </>
  )
}

export default AddContainer
