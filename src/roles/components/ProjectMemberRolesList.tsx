import { useQuery } from "@blitzjs/rpc"
import getRoles from "../queries/getRoles"
import { RoleInformation } from "./RoleTable"
import Table from "src/core/components/Table"

export const ProjectMemberRolesList = ({ usersId, projectId, columns }) => {
  // this grabs roles for just this set of projectMembers in this project
  const [{ roles }, { refetch }] = useQuery(getRoles, {
    where: {
      projectMembers: {
        some: {
          userId: { in: usersId },
          projectId: { in: projectId },
        },
      },
    },
    include: {
      projectMembers: true,
      user: true,
    },
    orderBy: { id: "asc" },
  })

  const projectMemberRoleInformation = roles.map((role) => {
    const name = role.name
    const description = role.description || ""
    const taxonomy = role.taxonomy || ""

    const user = role["user"]
    const userName = user["firstName"]
      ? `${user["firstName"]} ${user["lastName"]}`
      : user["username"]

    let t: RoleInformation = {
      name: name,
      description: description,
      id: role.id,
      taxonomy: taxonomy,
      userId: role.userId,
      onChangeCallback: undefined,
      taxonomyList: [],
      userName: userName,
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
