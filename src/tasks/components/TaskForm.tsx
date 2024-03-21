// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, useField, FormSpy } from "react-final-form"

import { boolean, z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
import getAssigments from "src/assignments/queries/getAssignments"

import Modal from "src/core/components/Modal"
import { useEffect, useState } from "react"

import { getDefaultSchemaLists } from "src/services/jsonconverter/getDefaultSchemaList"
import AssignTeams from "./AssignTeams"
import { TeamOption } from "./AssignTeams"
import AssignContributors from "./AssignContributors"
import { ContributorOption } from "./AssignContributors"
import { e } from "vitest/dist/index-9f5bc072"
import { getAuthValues } from "@blitzjs/auth"
import getTeams from "src/teams/queries/getTeams"
import { collectGenerateParams } from "next/dist/build/utils"
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
        className="input input-primary input-bordered w-full max-w-sm m-2"
        name="name"
        label="Task Name:"
        placeholder="Add Task Name"
        type="text"
      />

      {/* Column */}
      <LabelSelectField
        className="select select-bordered select-primary w-full max-w-sm m-2"
        name="columnId"
        label="Current Status:"
        options={columns}
        optionText="name"
        optionValue="id"
      />
      {/* Description */}
      <LabeledTextField
        className="textarea textarea-primary textarea-bordered w-full resize max-w-sm m-2"
        name="description"
        label="Task Description (Optional):"
        placeholder="Add Description"
        type="text"
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
              <label className="label">
                <span className="label-text">Deadline</span>
              </label>
              <input
                {...input}
                value={formattedValue}
                className="mt-2 text-lg border rounded p-2"
                type="datetime-local"
                min={today}
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
        className="select select-bordered select-primary w-full max-w-sm m-2"
        name="elementId"
        label="Assign to Element (Optional):"
        options={elements}
        optionText="name"
        optionValue="id"
      />

      {/* Contributors */}
      {/* Button */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-outline btn-primary w-full max-w-sm"
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
                className="btn btn-outline btn-primary"
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
        <button type="button" className="btn" onClick={() => handleToggleTeamsModal()}>
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

      <div className="m-2">
        <button
          type="button"
          className="btn btn-outline btn-primary w-full max-w-sm"
          onClick={() => handleToggleSchemaUpload()}
        >
          Assign Required Information
        </button>

        {/* Schema */}
        <Modal open={openSchemaModal} size="w-11/12 max-w-1xl">
          <div className="">
            <div>
              <label className="text-lg font-bold">Choose a Form Template: </label>
              <br />
              <Field
                name="schema"
                component="select"
                className="select select-primary w-full max-w-xs"
              >
                {schemas &&
                  schemas.map((schema) => (
                    <option key={schema.name} value={schema.name}>
                      {schema.name}
                    </option>
                  ))}
              </Field>
            </div>

            <div className="mt-4">
              <label className="text-lg font-bold">Upload A Form Template: </label>
              <br />
              <Field
                name="files"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              >
                {({ input: { value, onChange, ...input } }) => {
                  return (
                    <div>
                      <input
                        onChange={({ target }) => {
                          onChange(target.files)
                        }}
                        {...input}
                        type="file"
                        className="file-input w-full max-w-xs"
                        accept=".json"
                      />
                    </div>
                  )
                }}
              </Field>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline btn-primary"
                onClick={handleToggleSchemaUpload}
              >
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
