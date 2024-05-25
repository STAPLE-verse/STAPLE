import router from "next/router"

import React from "react"
import flattenTasksInformation from "./flattenTasksInformation"
import { ContributorsView, TeamView } from "./UtilsViews"

const ByContributors = ({ tasks }) => {
  const page = Number(router.query.page) || 0

  let flattenTasks = flattenTasksInformation(tasks)
  let sortedTeams = flattenTasks.teamsInformation
  let sortedContributors = flattenTasks.contributorsInformation

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By contributors organization</h1>
      <div>
        <h2>Teams Summary</h2>
        {sortedTeams.map((teamInfo) => (
          <TeamView
            team={teamInfo.team}
            tasks={teamInfo.tasks}
            id={teamInfo.id}
            key={teamInfo.id}
            printTask={true}
          ></TeamView>
        ))}
      </div>
      <div>
        <h2>Contributors Summary</h2>
        {sortedContributors.map((conInfo) => (
          <ContributorsView
            contributor={conInfo.contributor}
            tasks={conInfo.tasks}
            id={conInfo.id}
            key={conInfo.id}
            printTask={true}
          ></ContributorsView>
        ))}
      </div>
    </main>
  )
}

export default ByContributors
