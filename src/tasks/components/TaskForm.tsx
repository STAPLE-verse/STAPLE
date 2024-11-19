import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import TaskSchemaInput from "./TaskSchemaInput"
import DateField from "src/core/components/fields/DateField"
import { z } from "zod"
import AddRoleInput from "src/roles/components/AddRoleInput"
import ToggleModal from "src/core/components/ToggleModal"
import ValidationErrorDisplay from "src/core/components/ValidationErrorDisplay"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { ProjectMemberWithUsers } from "src/core/types"
import getProjectManagerUserIds from "src/projectmembers/queries/getProjectManagerUserIds"

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

  // Project Managers
  const [projectManagerUserIds] = useQuery(getProjectManagerUserIds, {
    projectId: projectId!,
  })

  // Get ProjectMembers
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      deleted: false,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
    },
    include: {
      users: true,
    },
  })

  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithUsers>(projectMembers as ProjectMemberWithUsers[])

  const contributorOptions = individualProjectMembers.map((contributor) => {
    return {
      // there is only one user for contributors
      label: contributor.users?.[0]?.username || "Unknown",
      id: contributor.id,
    }
  })

  const teamOptions = teamProjectMembers.map((team) => {
    return {
      label: team.name ? team.name : "",
      id: team.id,
    }
  })

  return (
    <Form<S> {...formProps} encType="multipart/form-data" className="mt-4 gap-4 flex flex-col">
      {/* Name */}
      <LabeledTextField
        className="input w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
        name="name"
        label="Task Name: (Required)"
        placeholder="Add Task Name"
        type="text"
      />

      {/* Column */}
      <LabelSelectField
        className="select w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="containerId"
        label="Current Column: (Required)"
        options={columns}
        optionText="name"
        optionValue="id"
      />
      {/* Description */}
      <LabeledTextAreaField
        className="textarea text-primary textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300 border-2"
        name="description"
        label="Task Description:"
        placeholder="Add Description"
        type="textarea"
      />

      {/* Deadline */}
      <DateField name="deadline" label="Deadline:" />

      {/* Elements */}
      <LabelSelectField
        className="select w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
        name="elementId"
        label="Assign Element:"
        options={elements}
        optionText="name"
        optionValue="id"
        disableFirstOption={false}
      />

      {/* Contributors */}
      <ToggleModal
        buttonLabel="Assign Contributor(s)"
        modalTitle="Select Contributors"
        buttonClassName="w-1/2"
      >
        <CheckboxFieldTable name="projectMembersId" options={contributorOptions} />
      </ToggleModal>
      <ValidationErrorDisplay fieldName={"projectMembersId"} />

      {/* Teams */}
      <ToggleModal buttonLabel="Assign Team(s)" modalTitle="Select Teams" buttonClassName="w-1/2">
        <CheckboxFieldTable name="teamsId" options={teamOptions} />
      </ToggleModal>
      <ValidationErrorDisplay fieldName={"projectMembersId"} />

      {/* Form */}
      {formResponseSupplied ? (
        <TaskSchemaInput projectManagerIds={projectManagerUserIds} />
      ) : (
        <p className="w-1/2 text-red-500">
          The task is already being completed by the contributors. Please, create a new task if you
          would like to change the attached form.
        </p>
      )}

      {/* Roles */}
      <AddRoleInput
        projectManagerIds={projectManagerUserIds}
        buttonLabel="Assign Role(s)"
        tooltipContent="Add roles to task"
      />
    </Form>
  )
}
