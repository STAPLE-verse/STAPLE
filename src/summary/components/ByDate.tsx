import React from "react"
import { DateLogView, compareDateSeconds } from "src/summary/components/UtilsViews"

const ByDate = ({ tasks, projectMembers, teams }) => {
  // Filter functions
  const mapStatusLogs = (statusLogs, element, belongsTo) => {
    let logs: any[] = []
    if (statusLogs.length > 0) {
      logs = statusLogs.map((log) => {
        return {
          createdAt: log.createdAt,
          id: log.id,
          belongsTo: belongsTo,
          elementId: element.id,
          fromLog: true,
        }
      })
    } else {
      let temp = {
        elementId: element.id,
        createdAt: element.createdAt,
        id: element.createdAt.getTime(),
        belongsTo: belongsTo,
        fromLog: false,
      }
      logs.push(temp)
    }

    return logs
  }

  const printHeader = (log, index, sortedLogs) => {
    if (index == 0) return true
    return !compareDateSeconds(log.createdAt, sortedLogs[index - 1].createdAt)
  }

  const getTasksStatusLogs = (tasks) => {
    let logs: any[] = []

    tasks.forEach((task) => {
      task.assignees.forEach((assignment) => {
        let t = mapStatusLogs(assignment.statusLogs, task, "task")
        logs = logs.concat(t)
      })
    })

    return logs
  }

  const getTeamsStatusLogs = (teams) => {
    let logs: any[] = []

    teams.forEach((team) => {
      team.assignments.forEach((assignment) => {
        let t = mapStatusLogs(assignment.statusLogs, team, "team")
        logs = logs.concat(t)
      })
    })

    return logs
  }

  const getProjectMemberStatusLogs = (projectMembers) => {
    let logs: any[] = []
    projectMembers.forEach((projectMember) => {
      let t = mapStatusLogs(projectMember.assignmentStatusLog, projectMember, "projectMember")
      logs = logs.concat(t)
    })
    return logs
  }

  let logs = getTasksStatusLogs(tasks)
  const projectMemberLogs = getProjectMemberStatusLogs(projectMembers)
  const teamLogs = getTeamsStatusLogs(teams)

  logs = logs.concat(projectMemberLogs)
  logs = logs.concat(teamLogs)

  const sortedLogs = logs.sort((d1, d2) => {
    return d1.createdAt > d2.createdAt ? -1 : d1.createdAt < d2.createdAt ? 1 : 0
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By date organization</h1>
      <div>
        {sortedLogs.map((log, index, sortedLogs) => (
          <DateLogView
            log={log}
            tasks={tasks}
            key={log.id}
            projectMembers={projectMembers}
            teams={teams}
            printHeader={printHeader(log, index, sortedLogs)}
          ></DateLogView>
        ))}
      </div>
    </main>
  )
}

export default ByDate
