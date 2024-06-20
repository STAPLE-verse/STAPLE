// @ts-nocheck
// issue with label.user

import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import getLabels from "../queries/getLabels"
import { LabelInformation, labelTableColumnsSimple } from "./LabelTable"
import Table from "src/core/components/Table"

export const ContributorLabelsList = ({ usersId, projectId, columns }) => {
  const router = useRouter()
  const [{ labels }, { refetch }] = useQuery(getLabels, {
    where: {
      user: { id: { in: usersId } },
      projects: { some: { id: projectId } },
    },
    include: {
      projects: true,
      user: true,
    },
    orderBy: { id: "asc" },
  })

  const contributorLabelInformation = labels.map((label) => {
    const name = label.name
    const description = label.description || ""
    const taxonomy = label.taxonomy || ""

    const userName = label.user.firstName
      ? `${label.user.firstName} ${label.user.lastName}`
      : label.user.username

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

  //console.log(labels)

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
        <Table columns={columns} data={contributorLabelInformation} />
      </main>
    </div>
  )
}
