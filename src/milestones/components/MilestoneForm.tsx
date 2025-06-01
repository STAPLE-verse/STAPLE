import React, { useState } from "react"
import type { Task } from "db"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { z } from "zod"
import DateField from "src/core/components/fields/DateField"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input"
import ToggleModal from "src/core/components/ToggleModal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"

export type Tag = {
  id: string
  className: string
  [key: string]: string
}

type MilestoneFormProps<S extends z.ZodType<any, any>> = FormProps<S> & {
  tasks: Task[]
  status?: any
}

export function MilestoneForm<S extends z.ZodType<any, any>>(props: MilestoneFormProps<S>) {
  const { tasks, ...formProps } = props

  const taskOptions = tasks.map((task) => {
    return {
      label: task.name ? task.name : "",
      id: task.id,
    }
  })

  // information for tags
  const initialTags = props.initialValues?.tags ?? []

  const [tags, setTags] = useState<Tag[]>(initialTags)

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
      className="flex gap-4 flex-col"
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
      <LabeledTextField
        name="name"
        label="Name: (Required)"
        placeholder="Name"
        type="text"
        className="input w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <LabeledTextAreaField
        name="description"
        label="Description:"
        placeholder="Add Description"
        type="textarea"
        className="w-1/2 textarea text-primary textarea-bordered textarea-primary textarea-lg bg-base-300 border-2"
      />
      <ToggleModal
        buttonLabel="Add Tasks"
        modalTitle="Select Tasks"
        buttonClassName="w-1/2"
        saveButton={true}
      >
        <CheckboxFieldTable name="taskIds" options={taskOptions} />
      </ToggleModal>

      <DateField name="startDate" label="Start Date:" />
      {formProps.status?.fieldErrors?.startDate && (
        <div className="text-error text-sm mt-1">{formProps.status.fieldErrors.startDate}</div>
      )}

      <DateField name="endDate" label="End Date:" />
      {formProps.status?.fieldErrors?.endDate && (
        <div className="text-error text-sm mt-1">{formProps.status.fieldErrors.endDate}</div>
      )}

      <div className="w-2/3">
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
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
