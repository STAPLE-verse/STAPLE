import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, FormSpy } from "react-final-form"
import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
import Modal from "src/core/components/Modal"
import { useEffect, useState } from "react"
import getTeams from "src/teams/queries/getTeams"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import moment from "moment"
import TaskSchemaInput from "./TaskSchemaInput"

interface TaskFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  formResponseSupplied?: boolean
}

export function TaskForm<S extends z.ZodType<any, any>>(props: TaskFormProps<S>) {
  const { projectId, formResponseSupplied = true, ...formProps } = props

  // Handle date input as a state
  const [dateInputValue, setDateInputValue] = useState("")

  useEffect(() => {
    // Initialize the input with today's date when the component mounts
    const today = moment().format("YYYY-MM-DDTHH:mm")
    setDateInputValue(today)
  }, [])

  // Columns
  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Elements
  const [{ elements: elements }] = useQuery(getElements, {
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

  // Modal open logics
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
                value={dateInputValue}
                className="mb-4 text-lg border-2 border-primary rounded p-2 w-full"
                type="datetime-local"
                min={moment().format("YYYY-MM-DDTHH:mm")}
                //placeholder={today}
                max="2050-01-01T00:00"
                onChange={(event) => {
                  const value = event.target.value
                  setDateInputValue(value)
                  if (value === "") {
                    // Handle cleared input by user
                    input.onChange("")
                  } else {
                    // Convert to date if there's a valid value
                    input.onChange(new Date(value))
                  }
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
        disableFirstOption={false}
      />

      {/* Contributors */}
      {/* Button */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleContributorsModal()}
        >
          Assign Contributors
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
      {formResponseSupplied ? (
        <TaskSchemaInput contributors={contributors} />
      ) : (
        <p className="mt-4 w-1/2 text-red-500">
          The task is already being completed by the contributors. Please, create a new task if you
          would like to change the attached form.
        </p>
      )}
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
