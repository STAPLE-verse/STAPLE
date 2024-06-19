import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useTeamTaskListDone } from "../hooks/useTeamTaskListDone"

export const TeamTaskListDone = ({ teamId }) => {
  const { data, columns } = useTeamTaskListDone(teamId)

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  )
}
