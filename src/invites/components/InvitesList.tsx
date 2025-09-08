import getInvites from "../queries/getInvites"
import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { InviteColumns } from "../tables/columns/InviteColumns"

export const InvitesListView = ({ invites }) => {
  return (
    <div>
      <Table columns={InviteColumns} data={invites} addPagination={true} />
    </div>
  )
}

export const InvitesList = ({ currentUser }) => {
  // Get invitations
  const [invites] = useQuery(getInvites, {
    where: { email: currentUser!.email.toLowerCase() },
    orderBy: { id: "asc" },
    include: { project: true },
  })

  return (
    <div>
      <InvitesListView invites={invites}></InvitesListView>
    </div>
  )
}

export default InvitesList
