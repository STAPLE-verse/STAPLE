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
import getRoles from "src/roles/queries/getRoles"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"
import { z } from "zod"

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
      project: { id: projectId! },
      users: {
        every: { id: { not: undefined } }, // Ensures there's at least one user
        none: { id: { gt: 1 } }, // Ensures there is only one user
      },
    },
    include: {
      users: true,
    },
  })

  // get all roles from all PMs
  const [{ projectPrivilege }] = useQuery(getProjectManagers, {
    where: {
      projectId: projectId,
      privilege: "PROJECT_MANAGER",
    },
  })

  const [{ roles }] = useQuery(getRoles, {
    where: {
      userId: { in: projectPrivilege?.map((pm) => pm.userId) || [] },
    },
    include: {
      user: true,
    },
  })

  // Assuming `roles` is an array of objects
  const roleMerged = roles.map((role) => {
    return {
      pm: role["user"]["username"], // Accessing the nested username
      role: role.name,
      id: role.id,
    }
  })

  // Use the mapped array directly
  const extraData = roleMerged.map((item) => ({
    pm: item.pm,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  const roleOptions = roleMerged.map((item) => ({
    role: item.role,
    id: item.id,
  }))

  const projectMemberOptions = projectMembers.map((projectMember) => {
    return {
      // will be only one user in this function
      role: projectMember["users"][0].username,
      id: projectMember["id"],
    }
  })

  // Teams
  const [{ projectMembers: teams }] = useQuery(getProjectMembers, {
    where: {
      project: { id: projectId! },
      users: {
        some: { id: { gt: 1 } }, // Ensures there are multiple users
      },
    },
    include: {
      users: true,
    },
  })

  console.log(teams)

  const teamOptions = teams.map((team) => {
    return {
      role: team["name"],
      id: team["id"],
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

  const [openRolesModal, setrolesModal] = useState(false)
  const handleToggleRolesModal = () => {
    setrolesModal((prev) => !prev)
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
        <TaskSchemaInput projectManagers={projectPrivilege} />
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
          onClick={() => handleToggleRolesModal()}
        >
          Assign Role(s)
        </button>
        <Modal open={openRolesModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb2 text-3xl">Select Roles</h1>
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable
                name="rolesId"
                options={roleOptions}
                extraColumns={extraColumns}
                extraData={extraData}
              />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggleRolesModal}>
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
