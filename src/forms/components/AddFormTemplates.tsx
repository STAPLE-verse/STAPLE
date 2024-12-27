import React from "react"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import Form from "src/core/components/fields/Form"
import { useMutation } from "@blitzjs/rpc"
import { AddFormTemplatesSchema } from "../schemas"
import { getDefaultSchemaLists } from "src/forms/utils/getDefaultSchemaList"
import createForm from "src/forms/mutations/createForm"
import { CurrentUser } from "src/users/queries/getCurrentUser"

type AddFormTemplatesProps = {
  currentUser: CurrentUser
  open: boolean
  onClose: () => void
  onFormsUpdated: () => void
}

const AddFormTemplates: React.FC<AddFormTemplatesProps> = ({
  open,
  onClose,
  onFormsUpdated,
  currentUser,
}) => {
  const [CreateFormMutation] = useMutation(createForm)

  // To be replaced later with API call to the list
  // Get form templates
  const formTemplateOptions = getDefaultSchemaLists()

  const handleSubmit = async (values) => {
    try {
      const selectedForms = formTemplateOptions.filter((f) => values.selectedFormIds.includes(f.id))

      // Add new forms in user table
      for (const form of selectedForms) {
        await CreateFormMutation({
          userId: currentUser.id,
          schema: form.schema,
          uiSchema: form.uiSchema,
        })
      }

      // Refetch forms in table
      onFormsUpdated()
      // Close modal
      onClose()
    } catch (error) {
      console.error("Failed to create forms:", error)
    }
  }

  return (
    <Modal open={open} size="large">
      <h2 className="flex justify-center mb-2 text-3xl">Select Form Templates</h2>
      {open && (
        <Form
          schema={AddFormTemplatesSchema}
          onSubmit={handleSubmit}
          submitText="Save"
          onCancel={onClose}
          cancelText="Cancel"
        >
          <CheckboxFieldTable name="selectedFormIds" options={formTemplateOptions} />
        </Form>
      )}
    </Modal>
  )
}

export default AddFormTemplates
