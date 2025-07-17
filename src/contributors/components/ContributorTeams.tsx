import { Routes, useParam } from "@blitzjs/next"
import Link from "next/link"
import { MemberPrivileges } from "db"
import CollapseCard from "src/core/components/CollapseCard"

interface TeamInformationProps {
  teamNames: { id: number; name: string | null }[]
  privilege: MemberPrivileges
}

const ContributorTeams = ({ teamNames, privilege }: TeamInformationProps) => {
  const projectId = useParam("projectId", "number")

  return (
    <CollapseCard title="Project Member Teams" className="w-full mt-4">
      <div className="flex flex-row justify-start gap-2">
        {teamNames.map((team) => (
          <Link
            key={team.id}
            className="btn btn-primary"
            href={Routes.ShowTeamPage({ teamId: team.id, projectId: projectId! })}
          >
            {team.name || "Unnamed Team"}
          </Link>
        ))}
      </div>
    </CollapseCard>
  )
}

export default ContributorTeams
