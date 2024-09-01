import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { FormSpy } from "react-final-form"
import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
import Modal from "src/core/components/Modal"
import { useState } from "react"
import getTeams from "src/teams/queries/getTeams"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import TaskSchemaInput from "./TaskSchemaInput"
import DateField from "src/core/components/fields/DateField"
import getLabels from "src/labels/queries/getLabels"

interface TaskFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  formResponseSupplied?: boolean
}

export function TaskForm<S extends z.ZodType<any, any>>(props: TaskFormProps<S>) {
  const { projectId, formResponseSupplied = true, ...formProps } = props

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
  const [{ labels }] = useQuery(getLabels, {
    where: {
      projects: { some: { id: { in: projectId! } } },
    },
  })

  const labelOptions = labels.map((labels) => {
    return {
      label: labels["name"],
      id: labels["id"],
    }
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

  const [openLabelsModal, setlabelsModal] = useState(false)
  const handleToggleLabelsModal = () => {
    setlabelsModal((prev) => !prev)
  }

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      {/* Name */}
      <LabeledTextField
        className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
        name="name"
        label="Task Name: (Required)"
        placeholder="Add Task Name"
        type="text"
      />

      {/* Column */}
      <LabelSelectField
        className="select mb-4 w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="columnId"
        label="Current Status: (Required)"
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
      <DateField name="deadline" label="Deadline:" />

      {/* Elements */}
      <LabelSelectField
        className="select mb-4 w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="elementId"
        label="Assign Element:"
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
          Assign Contributor(s)
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
            <h1 className="flex justify-center mb2 text-3xl">Select Contributors</h1>
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
          Assign Team(s)
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
            <h1 className="flex justify-center mb2 text-3xl">Select Teams</h1>
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

      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleLabelsModal()}
        >
          Assign Role(s)
        </button>
        <Modal open={openLabelsModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb2 text-3xl">Select Roles</h1>
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable name="labelsId" options={labelOptions} />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggleLabelsModal}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
