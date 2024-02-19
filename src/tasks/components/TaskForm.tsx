// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, useField } from "react-final-form"

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

  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  const [elements] = useQuery(getElements, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // TODO: Currently we only allow users to select from contributors already assigned to the project
  // TODO: Later on non project contributor users could be added and they will be automatically added to the project as a contributor
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    // orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const [{ teams }] = useQuery(getTeams, {
    where: { project: { id: projectId! } },
    // orderBy: { id: "asc" },
    // include: {
    //   user: true,
    // },
  })
  // console.log("teams")
  // console.log(teams)

  //TODO: should we pass this from task (new or edit) instead of getting it here?
  const [currentAssigments, { refetch }] = useQuery(getAssigments, {
    where: { taskId: taskId! },
    orderBy: { id: "asc" },
  })

  const findIdIfAssignedToTask = (contributorId) => {
    let index = currentAssigments.findIndex((element) => contributorId == element.contributorId)
    return index
  }

  const teamOptions: TeamOption[] = teams.map((team) => {
    let assigmentId: number | undefined = undefined
    let index = -1 //currentAssigments.findIndex((element) => team.id == element.teamId)
    return {
      name: team["name"],
      id: team["id"],
      assigmentId: assigmentId,
      checked: taskId == undefined ? false : index != -1,
    } as TeamOption
  })
  //Made sure that contributors assigned are checked when shown in table
  const contributorOptions = contributors.map((contributor) => {
    let assigmentId: number | undefined = undefined
    let index = findIdIfAssignedToTask(contributor.id)
    if (index != -1 && taskId != undefined) {
      assigmentId = currentAssigments[index]?.id
    }

    return {
      userName: contributor["user"].username,
      firstName: contributor["user"].firstName,
      lastName: contributor["user"].lastName,
      id: contributor.id,
      checked: taskId == undefined ? false : index != -1,
      assigmentId: assigmentId,
    } as ContributorOption
  })

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

  const [validAssigments, setValidAssigments] = useState(true)
  const areAssigmentValid = (values) => {
    if (values != undefined && values.findIndex((el) => el.checked) >= 0) {
      return true
    }
    return false
  }

  const [validTeamAssigments, setTeamValidAssigments] = useState(true)
  const areTeamAssigmentValid = (values) => {
    if (values != undefined && values.findIndex((el) => el.checked) >= 0) {
      return true
    }
    return false
  }

  function isAssigmentValid() {
    return validTeamAssigments || validAssigments
  }

  const schemas = getDefaultSchemaLists()

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />

      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="columnId"
        label="Status"
        options={columns}
        optionText="name"
        optionValue="id"
      />
      <LabeledTextField
        name="description"
        label="Description"
        placeholder="Description"
        type="text"
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="elementId"
        label="Parent element"
        options={elements}
        optionText="name"
        optionValue="id"
      />
      <div className="mt-4">
        <button type="button" className="btn" onClick={() => handleToggleContributorsModal()}>
          Assign contributors
        </button>
        <div className="flex justify-start mt-1">
          {validTeamAssigments || validAssigments ? (
            ""
          ) : (
            <span className="text-error">Needs a least one contributor or team</span>
          )}
        </div>

        <Modal open={openContributorsModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <Field
                name="contributorsId"
                initialValue={contributorOptions}
                validate={(values) => {
                  let t = areAssigmentValid(values)
                  setValidAssigments(t)
                  return !isAssigmentValid()
                }}
              >
                {({ input: { value, onChange, ...input }, meta }) => {
                  return (
                    <div>
                      <AssignContributors
                        contributorOptions={contributorOptions}
                        onChange={(newSelections) => {
                          onChange(newSelections)
                        }}
                      ></AssignContributors>
                    </div>
                  )
                }}
              </Field>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleToggleContributorsModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>

      <div className="mt-4">
        <button type="button" className="btn" onClick={() => handleToggleTeamsModal()}>
          Assign Team
        </button>
        <div className="flex justify-start mt-1">
          {validTeamAssigments || validAssigments ? (
            ""
          ) : (
            <span className="text-error">Needs a least one team or contributor</span>
          )}
        </div>

        <Modal open={openTeamsModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <Field
                name="teamsId"
                initialValue={teamOptions}
                validate={(values) => {
                  let t = areTeamAssigmentValid(values)
                  setTeamValidAssigments(t)
                  return !isAssigmentValid()
                }}
              >
                {({ input: { value, onChange, ...input }, meta }) => {
                  return (
                    <div>
                      <AssignTeams
                        teamOptions={teamOptions}
                        onChange={(newSelections) => {
                          onChange(newSelections)
                        }}
                      ></AssignTeams>
                    </div>
                  )
                }}
              </Field>
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

      <div className="mt-4">
        <button type="button" className="btn" onClick={() => handleToggleSchemaUpload()}>
          Change Current Schema
        </button>

        <Modal open={openSchemaModal} size="w-11/12 max-w-1xl">
          <div className="">
            <div>
              <label>Choose a schema: </label>
              <Field name="schema" component="select">
                {schemas &&
                  schemas.map((schema) => (
                    <option key={schema.name} value={schema.name}>
                      {schema.name}
                    </option>
                  ))}
              </Field>
            </div>

            <div className="mt-4">
              <label>Or upload a new one: </label>
              <Field name="files">
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
              <button type="button" className="btn btn-primary" onClick={handleToggleSchemaUpload}>
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
