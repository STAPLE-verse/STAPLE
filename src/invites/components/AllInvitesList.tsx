import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getInvites from "../queries/getInvites"
import Table from "src/core/components/Table"
import { InviteTablePMColumns } from "../tables/columns/InviteTablePMColumns"

export const AllInvitesList = () => {
  const projectId = useParam("projectId", "number")

  const [invites] = useQuery(getInvites, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={InviteTablePMColumns} data={invites} addPagination={true} />
    </main>
  )
}
