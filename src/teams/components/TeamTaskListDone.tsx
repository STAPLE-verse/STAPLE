import Table from "src/core/components/Table"
import { useTeamTaskListDone } from "../hooks/useTeamTaskListDone"
import { TeamTaskListDoneColumns } from "../tables/columns/TeamTaskListDoneColumns"

export const TeamTaskListDone = ({ teamId }) => {
  const { teamTaskListDoneData } = useTeamTaskListDone(teamId)

  return (
    <div>
      <Table columns={TeamTaskListDoneColumns} data={teamTaskListDoneData} addPagination={true} />
    </div>
  )
}
