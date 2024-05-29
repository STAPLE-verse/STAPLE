// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, FormSpy } from "react-final-form"
import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
import Modal from "src/core/components/Modal"
import { useState } from "react"
import { getDefaultSchemaLists } from "src/services/jsonconverter/getDefaultSchemaList"
import getTeams from "src/teams/queries/getTeams"
export { FORM_ERROR } from "src/core/components/Form"
import CheckboxFieldTable from "src/core/components/CheckboxFieldTable"
import moment from "moment"

// TODO: Check whether this is a good method to go
// Other methods could be: passing the columns directly
// Adding projectId directly to Form props as an optional value
interface TaskFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  taskId?: number
}

export function TaskForm<S extends z.ZodType<any, any>>(props: TaskFormProps<S>) {
  const { projectId, type, taskId, ...formProps } = props

  // Columns
  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Elements
  const [elements] = useQuery(getElements, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Contributors
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    include: {
      user: true,
    },
  })

  const contributorOptions = contributors.map((contributor) => {
    return {
      label: contributor["user"].username,
      id: contributor["id"],
    }
  })

  // Teams
  const [{ teams }] = useQuery(getTeams, {
    where: { project: { id: projectId! } },
  })

  const teamOptions = teams.map((team) => {
    return {
      label: team["name"],
      id: team["id"],
    }
  })

  // Schema
  const schemas = getDefaultSchemaLists()

  // Modal open logics
  const [openSchemaModal, setopenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => {
    setopenSchemaModal((prev) => !prev)
  }

  const [openContributorsModal, setContributorsModal] = useState(false)
  const handleToggleContributorsModal = () => {
    setContributorsModal((prev) => !prev)
  }

  const [openTeamsModal, setTeamsModal] = useState(false)
  const handleToggleTeamsModal = () => {
    setTeamsModal((prev) => !prev)
  }

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      {/* Name */}
      <LabeledTextField
        className="mb-4 w-1/2 text-primary border-primary border-2 bg-base-300"
        name="name"
        label="Task Name:"
        placeholder="Add Task Name"
        type="text"
      />

      {/* Column */}
      <LabelSelectField
        className="mb-4 w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="columnId"
        label="Current Status:"
        options={columns}
        optionText="name"
        optionValue="id"
      />
      {/* Description */}
      <LabeledTextAreaField
        className="mb-4 textarea text-primary textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300 border-2"
        name="description"
        label="Task Description:"
        placeholder="Add Description"
        type="textarea"
      />

      {/* Deadline */}
      <Field name="deadline">
        {({ input, meta }) => {
          const formattedValue =
            input.value instanceof Date
              ? moment(input.value).format("YYYY-MM-DDTHH:mm")
              : input.value
          const today = moment().format("YYYY-MM-DDTHH:mm")

          return (
            <div className="form-control w-full max-w-xs">
              <style jsx>{`
                label {
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                  font-size: 1.25rem;
                }
                input {
                  font-size: 1rem;
                  padding: 0.25rem 0.5rem;
                  border-radius: 3px;
                  appearance: none;
                }
              `}</style>
              <label>Deadline:</label>
              <input
                {...input}
                value={formattedValue}
                className="mb-4 text-lg border-2 border-primary rounded p-2 w-full"
                type="datetime-local"
                min={today}
                //placeholder={today}
                max="2050-01-01T00:00"
                onChange={(event) => {
                  const dateValue = event.target.value ? new Date(event.target.value) : null
                  input.onChange(dateValue)
                }}
              />
              {meta.touched && meta.error && <span className="text-error">{meta.error}</span>}
            </div>
          )
        }}
      </Field>

      {/* Elements */}
      <LabelSelectField
        className="mb-4 w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="elementId"
        label="Assign to Element:"
        options={elements}
        optionText="name"
        optionValue="id"
      />

      {/* Contributors */}
      {/* Button */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleContributorsModal()}
        >
          Assign contributors
        </button>
        <FormSpy subscription={{ errors: true }}>
          {({ form }) => {
            const errors = form.getState().errors
            return errors?.contributorsId ? (
              <div style={{ color: "red" }}>{errors.contributorsId}</div>
            ) : null
          }}
        </FormSpy>
        {/* Modal */}
        <Modal open={openContributorsModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable name="contributorsId" options={contributorOptions} />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-primary"
                onClick={handleToggleContributorsModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Teams */}
      {/* Button */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleTeamsModal()}
        >
          Assign Team
        </button>
        <FormSpy subscription={{ errors: true }}>
          {({ form }) => {
            const errors = form.getState().errors
            return errors?.contributorsId ? (
              <div style={{ color: "red" }}>{errors.contributorsId}</div>
            ) : null
          }}
        </FormSpy>
        <Modal open={openTeamsModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable name="teamsId" options={teamOptions} />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggleTeamsModal}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleSchemaUpload()}
        >
          Assign Required Information
        </button>

        {/* Schema */}
        <Modal open={openSchemaModal} size="w-11/12 max-w-1xl">
          <div className="">
            <div>
              <label className="text-lg font-bold mb-4">Choose a Form Template: </label>
              <br />
              <Field
                name="schema"
                component="select"
                className="select select-primary border-2 w-full max-w-xs"
                defaultValue="disable"
              >
                <option disabled value="disable">
                  {" "}
                  -- select an option --{" "}
                </option>
                {schemas &&
                  schemas.map((schema) => (
                    <option key={schema.name} value={schema.name}>
                      {schema.name}
                    </option>
                  ))}
              </Field>
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-primary" onClick={handleToggleSchemaUpload}>
                Close
              </button>
            </div>
            {/* closes the modal */}
          </div>
        </Modal>
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
