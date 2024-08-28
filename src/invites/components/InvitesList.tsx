import getInvites from "../queries/getInvites"
import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { inviteTableColumns } from "./InvitesTable"

export const InvitesList = ({ currentUser }) => {
  // Get invitations
  const [invites] = useQuery(getInvites, {
    where: { userId: currentUser!.id },
    orderBy: { id: "asc" },
    include: { project: true },
  })

  console.log(invites)

  return (
    <div>
      <Table columns={inviteTableColumns} data={invites} />
    </div>
  )
}

export default InvitesList
