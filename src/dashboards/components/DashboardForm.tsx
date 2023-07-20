import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"

import { z } from "zod"
import { LabeledSelectField } from "src/core/components/LabelSelectField"
import getProjects from "src/projects/queries/getProjects"
import { usePaginatedQuery } from "@blitzjs/rpc"
export { FORM_ERROR } from "src/core/components/Form"

export function DashboardForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ projects: projects }] = usePaginatedQuery(getProjects, {
    orderBy: {
      id: "asc",
    },
  })

  return (
    <Form<S> {...props}>
      <LabeledSelectField
        name="id"
        label="Project Id"
        placeholder="Project Id"
        options={projects}
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
