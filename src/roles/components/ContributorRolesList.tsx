import { useQuery } from "@blitzjs/rpc"
import getRoles from "../queries/getRoles"
import Table from "src/core/components/Table"
import { MemberPrivileges, ProjectMember, Role } from "db"
import { processRoleSimpleTableData } from "../tables/processing/processRoleSimpleTableData"
import { RoleSimpleTableColumns } from "../tables/columns/RoleSimpleTableColumns"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Card from "src/core/components/Card"

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

interface ContributorRolesListProps {
  usersId: number[]
  projectId: number
  privilege: MemberPrivileges
}

export const ContributorRolesList = ({
  usersId,
  projectId,
  privilege,
}: ContributorRolesListProps) => {
  // this grabs roles for just this set of projectMembers in this project
  const [{ roles }] = useQuery(getRoles, {
    where: {
      projectMembers: {
        some: {
          users: {
            some: {
              id: { in: usersId },
            },
          },
          projectId: { in: projectId },
        },
      },
    },
    include: {
      projectMembers: {
        include: {
          users: true, // Include users related to project members
        },
      },
    },
    orderBy: { id: "asc" },
  })

  const typedRoles = roles as RoleWithProjectMembers[]

  // Process table data and select columns dynamically
  const tableData = processRoleSimpleTableData(typedRoles)

  return (
    <Card
      title={"Contributor Roles"}
      actions={
        privilege === MemberPrivileges.PROJECT_MANAGER && (
          <Link className="btn btn-primary" href={Routes.RolesPage({ projectId: projectId! })}>
            Edit Roles
          </Link>
        )
      }
    >
      <Table columns={RoleSimpleTableColumns} data={tableData} addPagination={true} />
    </Card>
  )
}
