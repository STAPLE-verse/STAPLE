import Card from "src/core/components/Card"
import { RoleTeamTableColumns } from "../tables/columns/RoleTeamTableColumns"
import { processRoleTeam } from "../tables/processing/processRoleTeam"
import ProjectMemberRolesList from "src/projectmembers/components/ProjectMemberRolesList"

export const TeamRolesList = ({ usersId, projectId }) => {
  return (
    <Card
      title={"Team Member Roles"}
      tooltipContent="All individual member assigned roles are shown"
    >
      <ProjectMemberRolesList
        usersId={usersId}
        projectId={projectId}
        tableColumns={RoleTeamTableColumns}
        dataProcessor={processRoleTeam}
      />
    </Card>
  )
}
