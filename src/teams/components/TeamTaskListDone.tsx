import Table from "src/core/components/Table"
import { useTeamTaskListDone } from "../hooks/useTeamTaskListDone"

export const TeamTaskListDone = ({ teamId }) => {
  const { data, columns } = useTeamTaskListDone(teamId)

  return (
    <div>
      <Table columns={columns} data={data} addPagination={true} />
    </div>
  )
}
