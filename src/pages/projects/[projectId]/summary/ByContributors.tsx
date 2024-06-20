import router from "next/router"

import React from "react"
import flattenTasksInformation from "./flattenTasksInformation"
import { ContributorsView, TeamView } from "src/projects/components/UtilsViews"
import { AssignmentStatus, CompletedAs } from "@prisma/client"

const ByContributors = ({ contributors, teams, tasks }) => {
  const page = Number(router.query.page) || 0

  // let flattenTasks = flattenTasksInformation(tasks)
  // let sortedContributors = flattenTasks.contributorsInformation
  //console.log(tasks)

  const assignmentCompletedBy = (statusLog, completedAs, completedBy) => {
    let index = statusLog.findIndex(
      (log) =>
        log.status == AssignmentStatus.COMPLETED &&
        log.completedAs == completedAs &&
        log.completedBy == completedBy
    )
    return index
  }

  const getCompletedTask = (tasks, completedAs, completedBy) => {
    let temp: any[] = []
    tasks.forEach((task) => {
      task.assignees.forEach((assignment) => {
        let i = assignmentCompletedBy(assignment.statusLogs, completedAs, completedBy)
        if (i >= 0) {
          temp.push(task)
        }
      })
    })

    return temp
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By contributors organization</h1>
      <div>
        <h2>Teams Summary</h2>
        {teams.map((team) => (
          <TeamView
            team={team}
            tasks={getCompletedTask(tasks, CompletedAs.TEAM, team.id)}
            key={team.id}
            printTask={true}
          ></TeamView>
        ))}
      </div>
      <div>
        <h2>Contributors Summary</h2>
        {contributors.map((contributor) => (
          <ContributorsView
            contributor={contributor}
            tasks={getCompletedTask(tasks, CompletedAs.INDIVIDUAL, contributor.id)}
            key={contributor.id}
            printTask={true}
          ></ContributorsView>
        ))}
      </div>
    </main>
  )
}

export default ByContributors
