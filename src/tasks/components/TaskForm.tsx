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
import { useState } from "react"
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input"
import classNames from "classnames"

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
          e.preventDefault() // Prevent form submission on Enter
        }
      }}
    >
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
        className="select w-1/2 text-lg text-primary select-primary select-bordered border-2 bg-base-300"
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
        className="select w-1/2 text-lg text-primary select-primary select-bordered border-2 bg-base-300"
        name="elementId"
        label="Assign Element:"
        options={elements}
        optionText="name"
        optionValue="id"
        disableFirstOption={false}
      />

      {/* Tag Input */}
      <div className="w-1/2">
        <label className="text-base-content">Tags:</label>
        <i>
          Use a comma, semicolon, enter, or tab to create separate tags. To edit a tag, click on it,
          and then hit the enter key when you are finished.
        </i>
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
            tags: "mt-2 p-2 rounded-md bg-base-300 react-tags-wrapper", // entire box for tags
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
