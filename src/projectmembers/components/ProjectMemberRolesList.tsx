import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getRoles from "src/roles/queries/getRoles"

interface ProjectMemberRolesListProps {
  usersId: number[]
  projectId: number
  tableColumns: any
  dataProcessor: (roles: any[]) => any[]
}

const ProjectMemberRolesList = ({
  usersId,
  projectId,
  tableColumns,
  dataProcessor,
}: ProjectMemberRolesListProps) => {
  // Fetch roles for specified users in the project
  const [{ roles }] = useQuery(getRoles, {
    where: {
      projectMembers: {
        some: {
          users: {
            some: { id: { in: usersId } },
          },
          projectId: projectId,
        },
      },
    },
    include: {
      projectMembers: {
        where: {
          users: { some: { id: { in: usersId } } },
        },
        include: {
          users: {
            select: { id: true, firstName: true, lastName: true, username: true },
          },
        },
      },
    },
  })

  const processedData = dataProcessor(roles)

  return <Table columns={tableColumns} data={processedData} addPagination={true} />
}

export default ProjectMemberRolesList
