import getInvites from "../queries/getInvites"
import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { InviteColumns } from "../tables/columns/InviteColumns"

export const InvitesList = ({ currentUser }) => {
  // Get invitations
  const [invites] = useQuery(getInvites, {
    where: { email: currentUser!.email },
    orderBy: { id: "asc" },
    include: { project: true },
  })

  //console.log(invites)

  return (
    <div>
      <Table columns={InviteColumns} data={invites} addPagination={true} />
    </div>
  )
}

export default InvitesList
