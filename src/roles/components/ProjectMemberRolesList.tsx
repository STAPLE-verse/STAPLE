import { useQuery } from "@blitzjs/rpc"
import getRoles from "../queries/getRoles"
import { RoleInformation } from "./RoleTable"
import Table from "src/core/components/Table"
import { ProjectMember, Role } from "db"

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

export const ProjectMemberRolesList = ({ usersId, projectId, columns }) => {
  // this grabs roles for just this set of projectMembers in this project
  const [{ roles }, { refetch }] = useQuery(getRoles, {
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

  const projectMemberRoleInformation = typedRoles.map((role) => {
    const { name, description, taxonomy, projectMembers } = role

    // TODO: this does not exists but I am not sure what we want to achieve here
    // I assume we want to list all the team members and their roles?
    const userNames = projectMembers
      .flatMap((projectMember) => projectMember.users)
      .map((user) => (user.firstName ? `${user.firstName} ${user.lastName}` : user.username))
      .join(", ")

    let t: RoleInformation = {
      name: name,
      description: description || "",
      id: role.id,
      taxonomy: taxonomy || "",
      userId: role.userId,
      onChangeCallback: undefined,
      taxonomyList: [],
      userName: userNames,
    }
    return t
  })

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Table columns={columns} data={projectMemberRoleInformation} addPagination={true} />
      </main>
    </div>
  )
}
