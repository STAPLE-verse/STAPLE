import { useQuery } from "@blitzjs/rpc"
import getLabels from "../queries/getLabels"
import { LabelInformation } from "./LabelTable"
import Table from "src/core/components/Table"

export const ProjectMemberLabelsList = ({ usersId, projectId, columns }) => {
  // this grabs labels for just this set of contributors in this project
  const [{ labels }, { refetch }] = useQuery(getLabels, {
    where: {
      contributors: {
        some: {
          userId: { in: usersId },
          projectId: { in: projectId },
        },
      },
    },
    include: {
      contributors: true,
      user: true,
    },
    orderBy: { id: "asc" },
  })

  const contributorLabelInformation = labels.map((label) => {
    const name = label.name
    const description = label.description || ""
    const taxonomy = label.taxonomy || ""

    const user = label["user"]
    const userName = user["firstName"]
      ? `${user["firstName"]} ${user["lastName"]}`
      : user["username"]

    let t: LabelInformation = {
      name: name,
      description: description,
      id: label.id,
      taxonomy: taxonomy,
      userId: label.userId,
      onChangeCallback: undefined,
      taxonomyList: [],
      userName: userName,
    }
    return t
  })

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Table columns={columns} data={contributorLabelInformation} addPagination={true} />
      </main>
    </div>
  )
}
