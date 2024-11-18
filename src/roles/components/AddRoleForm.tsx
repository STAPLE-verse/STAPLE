import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"
import RoleSelect from "./RoleSelect"
import getProjectManagerUserIds from "src/projectmembers/queries/getProjectManagerUserIds"

interface AddRoleFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddRoleForm<S extends z.ZodType<any, any>>(props: AddRoleFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  // Get all roles from all PMs
  const [projectManagerUserIds] = useQuery(getProjectManagerUserIds, {
    projectId: projectId!,
  })

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <RoleSelect projectManagerIds={projectManagerUserIds} />
      </div>
    </Form>
  )
}
