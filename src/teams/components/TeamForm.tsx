import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import AssignTeamMembers from "./AssignTeamMembers"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
}

export function TeamForm<S extends z.ZodType<any, any>>(props: TeamFormProps<S>) {
  const { projectId, ...formProps } = props

  return (
    <Form<S> {...formProps}>
      <LabeledTextField
        name="name"
        label="Team Name:"
        placeholder="Team Name"
        type="text"
        className="w-1/2 input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      {/* Team Members Selection */}
      <div className="flex justify-start">
        <AssignTeamMembers projectId={projectId} />
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
