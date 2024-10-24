import { useQuery } from "@blitzjs/rpc"
import getRoles from "../queries/getRoles"
import Table from "src/core/components/Table"
import { ProjectMember, Role } from "db"
import { RoleTeamTableColumns } from "../tables/columns/RoleTeamTableColumns"
import { processRoleTeamTableData } from "../tables/processing/processRoleTeamTableData"

type RoleWithProjectMembers = Role & {
  projectMembers: (ProjectMember & {
    users: {
      id: number
      firstName: string
      lastName: string
      username: string
    }[]
  })[]
}

export const TeamRolesList = ({ usersId, projectId }) => {
  // this grabs roles for just this set of projectMembers in this project
  const [{ roles }] = useQuery(getRoles, {
    where: {
      projectMembers: {
        some: {
          users: {
            some: {
              id: { in: usersId }, // Fetch only projectMembers with users in usersId
            },
          },
          projectId: projectId, // Ensure that the roles belong to the correct project
        },
      },
    },
    include: {
      projectMembers: {
        where: {
          name: null,
          users: {
            some: {
              id: { in: usersId }, // Restrict projectMembers to only users in usersId
            },
          },
        },
        include: {
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
      },
    },
  })

  const typedRoles = roles as RoleWithProjectMembers[]

  // Process table data and select columns dynamically
  const tableData = processRoleTeamTableData(typedRoles)

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Table columns={RoleTeamTableColumns} data={tableData} addPagination={true} />
      </main>
    </div>
  )
}
