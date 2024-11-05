import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getRoles from "../queries/getRoles"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"

interface AddRoleFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddRoleForm<S extends z.ZodType<any, any>>(props: AddRoleFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  // Get all roles from all PMs
  const [projectManagers] = useQuery(getProjectManagers, {
    projectId: projectId!,
  })

  const pmIds = projectManagers.map((pm) => pm.userId)

  const [{ roles }] = useQuery(getRoles, {
    where: {
      userId: {
        in: pmIds, // Filter roles where userId is in the list of PM IDs
      },
    },
    include: {
      user: true,
    },
  })

  const roleMerged = roles.map((role) => {
    return {
      pm: role["user"]["username"],
      role: role.name,
      id: role.id,
    }
  })

  // Use the mapped array directly
  const extraData = roleMerged.map((item) => ({
    pm: item.pm,
  }))

  const roleOptions = roleMerged.map((item) => ({
    label: item.role,
    id: item.id,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <CheckboxFieldTable
          name="rolesId"
          options={roleOptions}
          extraColumns={extraColumns}
          extraData={extraData}
        />
      </div>
    </Form>
  )
}
