import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getInvites from "../queries/getInvites"
import Table from "src/core/components/Table"
import { InvitePMColumns } from "../tables/columns/InvitePMColumns"

export const AllInvitesList = () => {
  const projectId = useParam("projectId", "number")

  const [invites] = useQuery(getInvites, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mx-auto w-full">
      <Table columns={InvitePMColumns} data={invites} addPagination={true} />
    </main>
  )
}
