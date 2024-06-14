import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import getLabels from "../queries/getLabels"
import { LabelInformation, labelTableColumnsSimple } from "./LabelTable"
import Table from "src/core/components/Table"

export const ContributorLabelsList = ({ usersId, projectId }) => {
  const router = useRouter()
  const [{ labels }, { refetch }] = usePaginatedQuery(getLabels, {
    where: {
      user: { id: { in: usersId } },
      projects: { some: { id: projectId } },
    },
    include: { projects: true },
    orderBy: { id: "asc" },
  })

  //console.log(labels)

  const contributorLabelnformation = labels.map((label) => {
    const name = label.name
    const description = label.description || ""
    const taxonomy = label.taxonomy || ""

    let t: LabelInformation = {
      name: name,
      description: description,
      id: label.id,
      taxonomy: taxonomy,
      userId: label.userId,
      onChangeCallback: undefined,
      taxonomyList: [],
    }
    return t
  })

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
        <Table columns={labelTableColumnsSimple} data={contributorLabelnformation} />
      </main>
    </div>
  )
}
