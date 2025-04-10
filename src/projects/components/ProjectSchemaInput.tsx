import { useMutation, useQuery } from "@blitzjs/rpc"
import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import { FormWithVersionAndUser } from "src/tasks/components/TaskSchemaInput"
import getForms from "src/forms/queries/getForms"
import createForm from "src/forms/mutations/createForm"
import { getDefaultSchemaLists } from "src/forms/utils/getDefaultSchemaList"
import { toast } from "react-hot-toast"

interface ProjectSchemaInputProps {
  userId: number
  onDefaultFormCreated: (formVersionId: number) => void // Callback to send back to ProjectForm
  selectedFormVersionId: number | null
}

export const ProjectSchemaInput = ({
  userId,
  onDefaultFormCreated,
  selectedFormVersionId,
}: ProjectSchemaInputProps) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  const [CreateFormMutation] = useMutation(createForm)
  // get default project one
  const formTemplateOptions = getDefaultSchemaLists().filter(
    (template) => template.label === "Project Information"
  )

  // Handle creating the default form
  const handleCreateDefaultForm = async () => {
    try {
      if (formTemplateOptions.length > 0) {
        const defaultTemplate = formTemplateOptions[0] // Assuming there's only one match
        const newFormVersion = await CreateFormMutation({
          userId: userId,
          schema: defaultTemplate?.schema,
          uiSchema: defaultTemplate?.uiSchema,
        })
        //console.log("New Default Form Created:", newFormVersion)
        toast.success("Default form has been successfully created!")

        // Ensure versions exists and has at least one item
        const formVersionId = newFormVersion.versions?.[0]?.id
        if (formVersionId) {
          onDefaultFormCreated(formVersionId)
        } else {
          console.error("No form versions found in the returned data.")
          toast.error("Failed to retrieve the form version ID.")
        }

        // Close the modal after creation
        setOpenSchemaModal(false)
      } else {
        console.error("No default template found for Project Information")
        toast.error("No default template found for Project Information")
      }
    } catch (error) {
      console.error("Error creating default form:", error)
      toast.error("Failed to create the default form. Please try again.")
    }
  }

  const [userForms] = useQuery(getForms, {
    where: { userId: { in: userId }, archived: false },
  })

  const typeduserForms = userForms as FormWithVersionAndUser[]

  const schemas = typeduserForms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)

  // Add "(Default)" to the name of the default form
  const options = schemas.map((schema) => ({
    id: schema.id,
    label:
      (schema.schema as { description?: string })?.description === "Default Project Metadata"
        ? `${schema.name} (Default)`
        : schema.name,
  }))

  // Extra columns for the select table
  const versionNumber = schemas.map((schema) => schema.version)

  const extraData = versionNumber.map((version) => ({
    version: version,
  }))

  const extraColumns = [
    {
      id: "version",
      header: "Version",
      accessorKey: "version",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  // Handle radio button selection
  const handleRadioChange = (selectedId: number) => {
    // console.log("Radio selected with formVersionId:", selectedId)
    onDefaultFormCreated(selectedId)
  }

  return (
    <div className="mt-4">
      <button type="button" className="btn btn-primary w-1/2" onClick={handleToggleSchemaUpload}>
        Assign Form
      </button>
      <Modal open={openSchemaModal} size="w-1/2">
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">Select Form</h1>
          <p>
            If you have a form that includes our default description label, it is marked as
            (Default) below. If you want to make and use a new version of that form to use, click
            Create Default below.
          </p>
          <RadioFieldTable
            name="formVersionId"
            options={options}
            extraColumns={extraColumns}
            extraData={extraData}
            value={selectedFormVersionId}
            onChange={handleRadioChange} // Pass the onChange handler
          />
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary self-end"
              onClick={handleCreateDefaultForm}
            >
              Create Default
            </button>

            <button
              type="button"
              className="btn btn-secondary self-end"
              onClick={handleToggleSchemaUpload}
            >
              Save Form Selection
            </button>

            <button
              type="button"
              className="btn btn-info self-end"
              onClick={handleToggleSchemaUpload}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProjectSchemaInput
