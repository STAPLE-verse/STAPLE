import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import LabelSelectField from "src/core/components/fields/LabelSelectField"

import { getDateLanguageLocales } from "src/services/getDateLanguageLocales"
import { z } from "zod"

export function ProfileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const languagesOptions = getDateLanguageLocales()

  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="email"
        label="Email: (Required)"
        placeholder="Email"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="username"
        label="Username: (Required)"
        placeholder="Username"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="firstName"
        label="First Name:"
        placeholder="First name"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="lastName"
        label="Last Name:"
        placeholder="Last name"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="institution"
        label="Institution:"
        placeholder="Institution"
        type="text"
        className="input mb-8 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
      {/* labeled select field for language */}
      <LabelSelectField
        className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4"
        name="language"
        label="Select language:"
        options={languagesOptions}
        optionText="name"
        optionValue="id"
        type="string"
      />
    </Form>
  )
}
