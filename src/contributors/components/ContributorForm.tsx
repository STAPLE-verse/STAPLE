import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges } from "@prisma/client"
import AddRoleInput from "src/roles/components/AddRoleInput"
import getProjectManagerUserIds from "src/projectmembers/queries/getProjectManagerUserIds"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import LabeledTextAreaField from "src/core/components/fields/LabeledTextAreaField"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
  editedUserId?: number
}

export type Tag = {
  id: string
  className: string
  [key: string]: string
}

export const MemberPrivilegesOptions = [
  { id: 0, value: MemberPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: MemberPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, isEdit = false, editedUserId, ...formProps } = props

  const [projectManagerUserIds] = useQuery(getProjectManagerUserIds, {
    projectId: projectId!,
  })

  // Check if the current user is the last project manager
  const isLastProjectManager =
    isEdit && projectManagerUserIds.length === 1 && projectManagerUserIds[0] === editedUserId

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
    //console.log("The tag at index " + index + " was clicked")
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
        if (e.key === "Enter" && !e.shiftKey) {
          const el = e.target as HTMLElement
          const tagName = (el.tagName || "").toLowerCase()
          const inTextarea = tagName === "textarea"
          const inReactTags = !!el.closest(".react-tags-wrapper")
          if (!inTextarea && !inReactTags) {
            e.preventDefault() // Prevent accidental form submit from text inputs/buttons
          }
        }
      }}
    >
      <TooltipWrapper
        id="priv-tooltip"
        content={
          isLastProjectManager
            ? "User is the last project manager on the project. The privilege cannot be changed."
            : "Project Managers can see and edit all parts of a project, while contributors can only complete tasks assigned to them."
        }
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      {!isEdit && (
        <LabeledTextAreaField
          name="email"
          label="Email(s):"
          placeholder="Enter one or multiple emails (comma, semicolon, space, or newline separated)"
          rows={4}
          className="textarea textarea-primary textarea-bordered border-2 bg-base-300 text-primary mb-4 w-1/2"
        />
      )}
      <LabelSelectField
        className="select text-primary bg-base-300 select-bordered bg-base-300 border-primary border-2 w-1/2 mb-4 w-1/2"
        name="privilege"
        label="Select Privilege:"
        options={MemberPrivilegesOptions}
        optionText="label"
        optionValue="value"
        type="string"
        data-tooltip-id="priv-tooltip"
        disabled={isLastProjectManager}
      />

      <AddRoleInput
        projectManagerIds={projectManagerUserIds}
        buttonLabel="Add Role"
        tooltipContent="Add role labels"
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
    </Form>
  )
}
