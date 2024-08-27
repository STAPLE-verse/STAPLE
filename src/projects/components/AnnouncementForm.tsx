import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"

import { z } from "zod"
import { FORM_ERROR } from "final-form"

export function AnnouncementForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextAreaField
        className="textarea text-primary textarea-bordered textarea-primary textarea-lg bg-base-300 border-2 w-full"
        name="announcement"
        label="Create Announcement:"
        placeholder="Type your announcement here."
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
