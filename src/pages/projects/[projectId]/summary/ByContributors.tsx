import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import getTasks from "src/tasks/queries/getTasks"

//Move this to utils
const formatDate = (myDate) =>
  myDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  })

const TeamView = ({ team }) => {
  return (
    <div>
      <br />
      Name: {team.name}
      <br />
      Created: {formatDate(team.createdAt)}
      <br />
      Members
      <div>
        {team.contributors.map((element) => (
          <div key={element.id}>user name: {element.user.username}</div>
        ))}
      </div>
      <div></div>
    </div>
  )
}

const ByContributors = ({ projectId }) => {
  const page = Number(router.query.page) || 0

  const [{ tasks }] = useQuery(getTasks, {
    where: { projectId: projectId },
    include: {
      assignees: {
        include: {
          statusLogs: {
            orderBy: {
              createdAt: "desc",
            },
          },
          team: {
            include: {
              contributors: {
                include: { user: true },
              },
            },
          },
          contributor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })
  let teams: any[] = []
  tasks.forEach((task) => {
    if (task.assignees != undefined) {
      task.assignees.forEach((element) => {
        let team = element.team
        if (team != null) {
          if (teams.findIndex((x) => x.id == team.id)) {
            teams.push(team)
          }
        }
      })
    }
  })
  console.log(teams)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By contributors organization</h1>
      {teams.map((team) => (
        <TeamView team={team} key={team.id}></TeamView>
      ))}
    </main>
  )
}

export default ByContributors
