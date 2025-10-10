import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import getColumns from "../queries/getColumns"
import { useQuery } from "@blitzjs/rpc"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import TaskSchemaInput from "./TaskSchemaInput"
import { z } from "zod"
import AddRoleInput from "src/roles/components/AddRoleInput"
import ToggleModal from "src/core/components/ToggleModal"
import ValidationErrorDisplay from "src/core/components/ValidationErrorDisplay"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { ProjectMemberWithUsers } from "src/core/types"
import getProjectManagerUserIds from "src/projectmembers/queries/getProjectManagerUserIds"
import { useState } from "react"
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input"
import CollapseCard from "src/core/components/CollapseCard"
import getMilestones from "src/milestones/queries/getMilestones"
import DateField from "src/core/components/fields/DateField"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import LabeledTextAreaField from "src/core/components/fields/LabeledTextAreaField"
import { useForm } from "react-final-form"

export type Tag = {
  id: string
  className: string
  [key: string]: string
}

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

  // Milestones
  const [{ milestones: milestones }] = useQuery(getMilestones, {
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
      label:
        contributor.users?.[0]?.firstName && contributor.users?.[0]?.lastName
          ? `${contributor.users[0].firstName} ${contributor.users[0].lastName}`
          : contributor.users?.[0]?.username || "Unknown",
      id: contributor.id,
    }
  })

  const teamOptions = teamProjectMembers.map((team) => {
    return {
      label: team.name ? team.name : "",
      id: team.id,
    }
  })

  // information for tags
  const initialTags = formProps.initialValues?.tags ?? []

  const [tags, setTags] = useState<Array<Tag>>(initialTags)

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const onTagUpdate = (index: number, newTag: Tag) => {
    const updatedTags = [...tags]
    updatedTags.splice(index, 1, newTag)
    setTags(updatedTags)
  }

  const handleAddition = (tag: Tag) => {
    setTags((prevTags) => {
      return [...prevTags, tag]
    })
  }

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    setTags(newTags)
  }

  const handleTagClick = (index: number) => {
    console.log("The tag at index " + index + " was clicked")
  }

  const onClearAll = () => {
    setTags([])
  }

  const contributorIds = contributorOptions.map((c) => c.id)
  const teamIds = teamOptions.map((t) => t.id)
  const autoAssignOptions = [
    { id: "NONE", name: "Do not auto-assign" },
    { id: "CONTRIBUTOR", name: "Auto-assign new contributors" },
    { id: "TEAM", name: "Auto-assign new teams" },
    { id: "ALL", name: "Auto-assign new contributors & teams" },
  ]

  const ContributorsBulkButtons: React.FC<{
    contributorCount: number
    contributorIds: number[]
    teamIds: number[]
  }> = ({ contributorCount, contributorIds, teamIds }) => {
    const formApi = useForm()
    const selectAllContributors = () => formApi.change("projectMembersId", contributorIds)
    const clearAllContributors = () => formApi.change("projectMembersId", [])
    return (
      <div className="flex justify-center items-center gap-3 mb-3">
        <button type="button" className="btn btn-primary" onClick={selectAllContributors}>
          Select all contributors ({contributorCount})
        </button>
        <button type="button" className="btn btn-secondary" onClick={clearAllContributors}>
          Clear
        </button>
      </div>
    )
  }

  const TeamsBulkButtons: React.FC<{ teamCount: number; teamIds: number[] }> = ({
    teamCount,
    teamIds,
  }) => {
    const formApi = useForm()
    const selectAllTeams = () => formApi.change("teamsId", teamIds)
    const clearAllTeams = () => formApi.change("teamsId", [])
    return (
      <div className="flex justify-center items-center gap-3 mb-3">
        <button type="button" className="btn btn-primary" onClick={selectAllTeams}>
          Select all teams ({teamCount})
        </button>
        <button type="button" className="btn btn-secondary" onClick={clearAllTeams}>
          Clear
        </button>
      </div>
    )
  }

  return (
    <Form<S>
      {...formProps}
      encType="multipart/form-data"
      className="mt-4 gap-4 flex flex-col"
      onSubmit={(values, form, callback) => {
        return formProps.onSubmit(
          {
            ...values,
            tags: tags.map((tag) => ({
              key: tag.id,
              value: tag.text,
            })),
          },
          form,
          callback
        )
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const el = e.target as HTMLElement
          const tag = el?.tagName?.toLowerCase()
          const isTextArea = tag === "textarea"
          const isContentEditable = (el as any)?.isContentEditable === true
          const insideReactTags = !!el?.closest?.(".react-tags-wrapper")

          // Allow Enter for textareas, contentEditable fields, and the ReactTags input.
          // Prevent only when it would submit the form from other inputs/buttons.
          if (!isTextArea && !isContentEditable && !insideReactTags) {
            e.preventDefault()
          }
        }
      }}
    >
      <CollapseCard title="Required Fields: Name, Status, People" className="" defaultOpen={true}>
        <LabeledTextField
          className="input w-1/2 text-primary input-primary input-bordered border-2 bg-base-300 mb-4"
          name="name"
          label="Task Name:"
          placeholder="Add Task Name"
          type="text"
        />
        <LabelSelectField
          className="select w-1/2 text-lg text-primary select-primary select-bordered border-2 bg-base-300 mb-4"
          name="containerId"
          label="Current Status:"
          description="Status indicates the column placement on the kanban board."
          options={columns}
          optionText="name"
          optionValue="id"
        />

        <label>Assign at least one person or team:</label>
        <ValidationErrorDisplay fieldName={"projectMembersId"} />
        {/* Contributors */}
        <ToggleModal
          buttonLabel="Assign Contributor(s)"
          modalTitle="Select Contributors"
          buttonClassName="w-1/2 mb-4 mt-2"
          saveButton={true}
        >
          <div className="col-span-full w-full grid grid-cols-1 gap-4">
            <ContributorsBulkButtons
              contributorCount={contributorOptions.length}
              contributorIds={contributorIds}
              teamIds={teamIds}
            />
            <CheckboxFieldTable name="projectMembersId" options={contributorOptions} />
          </div>
        </ToggleModal>
        {/* Teams */}
        <ToggleModal
          buttonLabel="Assign Team(s)"
          modalTitle="Select Teams"
          buttonClassName="w-1/2"
          saveButton={true}
        >
          <div className="col-span-full w-full grid grid-cols-1 gap-4">
            <TeamsBulkButtons teamCount={teamOptions.length} teamIds={teamIds} />
            <CheckboxFieldTable name="teamsId" options={teamOptions} />
          </div>
        </ToggleModal>
        {/* Auto-assign new members/teams */}
        <div className="w-1/2 mt-2">
          <LabelSelectField
            className="select w-full text-lg text-primary select-primary select-bordered border-2 bg-base-300"
            name="autoAssignNew"
            label={
              <span className="flex items-center">
                Auto-assign future additions
                <InformationCircleIcon
                  className="h-4 w-4 ml-1 text-info stroke-2"
                  data-tooltip-id="auto-assign-info"
                />
                <Tooltip
                  id="auto-assign-info"
                  content="Choose who should be automatically added to this task when they are added to the project."
                  className="z-[1099] ourtooltips"
                />
              </span>
            }
            description="Applies when new contributors or teams are added to this project."
            options={autoAssignOptions}
            optionText="name"
            optionValue="id"
          />
        </div>
      </CollapseCard>

      <CollapseCard title="Details: Instructions, Dates, Forms, Roles">
        {/* Description */}
        <LabeledTextAreaField
          className="textarea text-primary textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300 border-2 mb-4"
          name="description"
          label="Task Instructions:"
          placeholder="Add Instructions"
          type="textarea"
        />

        <DateField name="startDate" label="Start Date:" />

        {/* Deadline */}
        <div className="mt-4">
          <DateField name="deadline" label="Deadline:" />
        </div>

        {/* Form */}
        {formResponseSupplied ? (
          <TaskSchemaInput
            projectManagerIds={projectManagerUserIds}
            className="mt-4 mb-4"
            tooltipContent="Add a required form to gather responses for the task"
          />
        ) : (
          <p className="w-1/2 text-red-500">
            The task is already being completed by the contributors. Please, create a new task if
            you would like to change the attached form.
          </p>
        )}
        {/* Roles */}
        <AddRoleInput
          projectManagerIds={projectManagerUserIds}
          buttonLabel="Assign Role(s)"
          tooltipContent="Add roles to task"
        />
      </CollapseCard>

      <CollapseCard title="Organization: Milestones, Tags">
        {/* Elements */}
        <LabelSelectField
          className="select w-1/2 text-primary select-primary select-bordered border-2 bg-base-300"
          name="milestoneId"
          label="Assign milestone:"
          options={milestones}
          optionText="name"
          optionValue="id"
          disableFirstOption={false}
        />

        {/* Tag Input */}
        <div className="w-2/3 mt-4">
          <label className="text-base-content">
            <span className="flex items-center mb-2">
              Tags:
              <InformationCircleIcon
                className="h-4 w-4 ml-1 text-info stroke-2"
                data-tooltip-id="tags-overview"
              />
              <Tooltip
                id="tags-overview"
                content="Use a comma, semicolon, enter, or tab to create separate tags. To edit a tag, click on
            it, and then hit the enter key when you are finished."
                className="z-[1099] ourtooltips"
              />
            </span>
          </label>
          <ReactTags
            tags={tags}
            name="tags"
            separators={[SEPARATORS.TAB, SEPARATORS.COMMA, SEPARATORS.ENTER, SEPARATORS.SEMICOLON]}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            onTagUpdate={onTagUpdate}
            inputFieldPosition="inline"
            editable
            clearAll
            onClearAll={onClearAll}
            classNames={{
              tags: "rounded-md bg-base-300 react-tags-wrapper", // entire box for tags
              tag: "inline-flex items-center bg-primary text-primary-content px-2 py-1 rounded-md mr-2 mb-2 text-lg",
              remove: "ml-3 text-primary-content font-bold cursor-pointer remove",
              tagInput: "bg-base-300", // whole div around
              tagInputField:
                "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4", // just input field

              selected: "bg-base-300",
              editTagInput: "bg-base-300",
              editTagInputField:
                "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4 mb-4",
              clearAll: "font-bold ml-3",
              suggestions: "suggestions-dropdown",
              activeSuggestion: "active-suggestion-class",
            }}
            placeholder="Add tags"
          />
        </div>
      </CollapseCard>
    </Form>
  )
}
