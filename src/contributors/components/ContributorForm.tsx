import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"
import { LabeledSelectField } from "src/core/components/LabeledSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
export { FORM_ERROR } from "src/core/components/Form"

export function ContributorForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [users] = useQuery(getUsers, undefined)
  const availableUsers = users.map((user) => {
    return (
      <option value={user.id} key={user.id}>
        {user.email}
      </option>
    )
  })
  // const userInitialValues = users && users[0] ? users[0].id : undefined
  // const userInitialValues = 1
  return (
    <Form<S> {...props}>
      <LabeledSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="userId"
        label="Select User"
        // Setting the initial value to the selectinput
        // initValue={userInitialValues}
      >
        {availableUsers}
      </LabeledSelectField>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
