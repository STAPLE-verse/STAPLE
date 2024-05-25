import router from "next/router"

import React from "react"
import flattenTasksInformation from "./flattenTasksInformation"
import { ContributorsView, TeamView } from "./UtilsViews"

const ByTasks = ({ tasks }) => {
  const page = Number(router.query.page) || 0

  const ITEMS_PER_PAGE = 7

  let flattenTasks = flattenTasksInformation(tasks)

  let sortedTeams = flattenTasks.teamsInformation
  let sortedContributors = flattenTasks.contributorsInformation

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By task organization</h1>

      <div className="my-2 ">
        <h2>Contributors Summary</h2>
        {sortedContributors.map((conInfo) => (
          <ContributorsView
            contributor={conInfo.contributor}
            tasks={conInfo.tasks}
            printTask={false}
            id={conInfo.id}
            key={conInfo.id}
          ></ContributorsView>
        ))}
      </div>
      <div className="my-2 ">
        <h2>Teams Summary</h2>
        {sortedTeams.map((teamInfo) => (
          <TeamView
            team={teamInfo.team}
            tasks={teamInfo.tasks}
            id={teamInfo.id}
            key={teamInfo.id}
            printTask={false}
          ></TeamView>
        ))}
      </div>
    </main>
  )
}

export default ByTasks
