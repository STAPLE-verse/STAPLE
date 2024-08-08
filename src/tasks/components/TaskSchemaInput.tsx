import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "db"
import React, { useState } from "react"
import { Field } from "react-final-form"
import Modal from "src/core/components/Modal"
import getForms from "src/forms/queries/getForms"

export const TaskSchemaInput = ({ contributors }) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  const pmList = contributors
    .filter((contributor) => contributor.privilege === ContributorPrivileges.PROJECT_MANAGER)
    .map((pm) => pm.userId)

  const [pmForms] = useQuery(getForms, {
    where: { userId: { in: pmList } },
  })

  const schemas = pmForms.forms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)

  return (
    <div className="mt-4">
      <button type="button" className="btn btn-primary w-1/2" onClick={handleToggleSchemaUpload}>
        Assign Required Information
      </button>

      <Modal open={openSchemaModal} size="w-11/12 max-w-1xl">
        <div>
          <Field name="formVersionId">
            {({ input, meta }) => {
              console.log(input.value)

              return (
                <div className="mb-4">
                  <label className="text-lg font-bold">Choose a Form Template: </label>
                  <br className="mb-2" />
                  <select
                    className="select select-primary border-2 w-full max-w-xs"
                    {...input}
                    value={input.value}
                    onChange={(event) => {
                      input.onChange(parseInt(event.target.value, 10))
                    }}
                  >
                    <option value="" disabled>
                      -- select an option --
                    </option>
                    {schemas.map((schema) => (
                      <option key={schema.id} value={schema.id}>
                        {schema.name}
                      </option>
                    ))}
                  </select>
                  {meta.touched && meta.error && <span className="text-error">{meta.error}</span>}
                </div>
              )
            }}
          </Field>
          <div className="modal-action">
            <button type="button" className="btn btn-primary" onClick={handleToggleSchemaUpload}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskSchemaInput
