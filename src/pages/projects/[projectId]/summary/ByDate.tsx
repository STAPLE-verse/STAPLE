import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import { DateLogView, compareDateSeconds } from "./UtilsViews"
import { A } from "@blitzjs/rpc/dist/index-b834415a"

const ByDate = ({ tasks, contributors, teams }) => {
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

  const getContributorStatusLogs = (contributors) => {
    let logs: any[] = []
    contributors.forEach((contributor) => {
      let t = mapStatusLogs(contributor.assignmentStatusLog, contributor, "contributor")
      logs = logs.concat(t)
    })
    return logs
  }

  let logs = getTasksStatusLogs(tasks)
  const contributorLogs = getContributorStatusLogs(contributors)
  const teamLogs = getTeamsStatusLogs(teams)

  logs = logs.concat(contributorLogs)
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
            contributors={contributors}
            teams={teams}
            printHeader={printHeader(log, index, sortedLogs)}
          ></DateLogView>
        ))}
      </div>
    </main>
  )
}

export default ByDate
