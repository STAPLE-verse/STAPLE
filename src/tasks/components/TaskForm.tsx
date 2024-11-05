import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { FormSpy } from "react-final-form"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import Modal from "src/core/components/Modal"
import { useState } from "react"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import TaskSchemaInput from "./TaskSchemaInput"
import DateField from "src/core/components/fields/DateField"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"
import { z } from "zod"
import AddRoleInput from "src/roles/components/AddRoleInput"

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

  // Contributors - get only individuals
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
      name: { equals: null }, // Ensures the name in ProjectMember is null
    },
    include: {
      users: true,
    },
  })

  // get all roles from all PMs
  const [projectManagers] = useQuery(getProjectManagers, {
    projectId: projectId!,
  })

  const pmIds = projectManagers.map((pm) => pm.userId)

  const projectMemberOptions = projectMembers.map((projectMember) => {
    return {
      // will be only one user in this function
      label: projectMember["users"][0].username,
      id: projectMember["id"],
    }
  })

  // Teams
  const [{ projectMembers: teams }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      name: { not: null }, // Ensures the name in ProjectMember is non-null
      users: {
        some: { id: { not: undefined } }, // Ensures there's at least one user
      },
    },
    include: {
      users: true,
    },
  })

  const teamOptions = teams.map((team) => {
    return {
      label: team.name ? team.name : "",
      id: team.id,
    }
  })

  // Modal open logics
  const [openProjectMembersModal, setProjectMembersModal] = useState(false)
  const handleToggleProjectMembersModal = () => {
    setProjectMembersModal((prev) => !prev)
  }

  const [openTeamsModal, setTeamsModal] = useState(false)
  const handleToggleTeamsModal = () => {
    setTeamsModal((prev) => !prev)
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
        name="containerId"
        label="Current Column: (Required)"
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
          onClick={() => handleToggleProjectMembersModal()}
        >
          Assign Contributor(s)
        </button>
        <FormSpy subscription={{ errors: true }}>
          {({ form }) => {
            const errors = form.getState().errors
            return errors?.projectMembersId ? (
              <div style={{ color: "red" }}>{errors.projectMembersId}</div>
            ) : null
          }}
        </FormSpy>
        {/* Modal */}
        <Modal open={openProjectMembersModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb2 text-3xl">Select Contributors</h1>
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable name="projectMembersId" options={projectMemberOptions} />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-primary"
                onClick={handleToggleProjectMembersModal}
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
            return errors?.projectMembersId ? (
              <div style={{ color: "red" }}>{errors.projectMembersId}</div>
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
        <TaskSchemaInput projectManagerIds={pmIds} />
      ) : (
        <p className="mt-4 w-1/2 text-red-500">
          The task is already being completed by the contributors. Please, create a new task if you
          would like to change the attached form.
        </p>
      )}

      <div className="mt-4">
        <AddRoleInput projectManagerIds={pmIds} buttonLabel="Assign Role(s)" />
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
