import React from "react"
import { ProjectMembersView, TeamView } from "src/summary/components/UtilsViews"
import { Status, CompletedAs } from "@prisma/client"

const ByProjectMembers = ({ projectMembers, teams, tasks }) => {
  // Filter functions
  const assignmentCompletedBy = (statusLog, completedAs, completedBy) => {
    let index = statusLog.findIndex(
      (log) =>
        log.status == Status.COMPLETED &&
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
        {projectMembers.map((projectMember) => (
          <ProjectMembersView
            projectMember={projectMember}
            tasks={getCompletedTask(tasks, CompletedAs.INDIVIDUAL, projectMember.id)}
            key={projectMember.id}
            printTask={true}
          ></ProjectMembersView>
        ))}
      </div>
    </main>
  )
}

export default ByProjectMembers
