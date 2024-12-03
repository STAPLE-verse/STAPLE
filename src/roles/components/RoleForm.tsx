import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { z } from "zod"

interface RoleFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  taxonomyList: string[]
}

export function RoleForm<S extends z.ZodType<any, any>>(props: RoleFormProps<S>) {
  const { taxonomyList, ...formProps } = props
  return (
    <Form<S> {...formProps}>
      {/* Name */}
      <LabeledTextField
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-full"
        name="name"
        label="Role Name: (Required)"
        placeholder="Add Role Name"
        type="text"
      />
      {/* Description */}
      <LabeledTextAreaField
        className="mb-4 textarea text-primary textarea-bordered textarea-primary textarea-lg bg-base-300 border-2 w-full"
        name="description"
        label="Role Description:"
        placeholder="Add Role Description"
        type="text"
      />
      {/* taxonomy */}
      <LabeledTextField
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-full"
        name="taxonomy"
        label="Taxonomy:"
        placeholder="Role Taxonomy"
        type="text"
        list="taxonomy_tags"
      />
      <datalist id={"taxonomy_tags"}>
        {taxonomyList.map((value: any, index) => (
          <option value={value} key={index} />
        ))}
      </datalist>
    </Form>
  )
}
