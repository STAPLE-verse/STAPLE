import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import getTasks from "src/tasks/queries/getTasks"

interface TeamInformation {
  team: any
  tasks: any[]
  id: number
}

interface ContributorInformation {
  contributor: any
  tasks: any[]
  id: number
}

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

const TaskView = ({ task }) => {
  // console.log(task)
  let user = task.createdBy.user

  return (
    <div className="my-2 ">
      <h6>Name: {task.name} </h6>
      Description:{task.description}
      <br />
      Created At: {formatDate(task.createdAt)}
      <br />
      Updated At:
      <br />
      Created By: {user.username}
      <br />
      Completed By:assignmentstatuslog.completedBy
      <br />
      Contribution Categories:tasks.labels
      <br />
      Metadata:assignmentstatuslog.metadata (if exists)
      <br />
    </div>
  )
}

const TeamView = ({ team, tasks, id }: TeamInformation) => {
  // console.log(team)
  //TODO Needs to sort and filter tasks
  let newTasks = tasks
  return (
    <div>
      <br />
      <h3> Name: {team.name} </h3>
      Created: {formatDate(team.createdAt)}
      <br />
      <div>
        <h5>Members</h5>
        {team.contributors.map((element) => (
          <div key={element.id}>user name: {element.user.username}</div>
        ))}
      </div>
      <div>
        <br />
        <h5>Tasks with completed assigments</h5>

        {newTasks.map((task) => (
          <TaskView key={task.id} task={task}></TaskView>
        ))}
      </div>
    </div>
  )
}

const ContributorsView = ({ contributor, tasks, id }: ContributorInformation) => {
  console.log(contributor)
  //TODO Needs to sort and filter tasks
  let newTasks = tasks
  return (
    <div>
      <br />
      <h3> Username: {contributor.user.username} </h3>
      Added to Project: {formatDate(contributor.createdAt)}
      <br />
      Contribution Categories: contributor.labels
      <div>
        <br />
        <h5>Tasks with completed assigments</h5>
        {newTasks.map((task) => (
          <TaskView key={task.id} task={task}></TaskView>
        ))}
      </div>
    </div>
  )
}

const ByContributors = ({ projectId }) => {
  const page = Number(router.query.page) || 0

  const [{ tasks }] = useQuery(getTasks, {
    where: { projectId: projectId },
    include: {
      createdBy: {
        include: { user: true },
      },
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
  let teams: TeamInformation[] = []
  let contributors: ContributorInformation[] = []

  const updateTeamData = (task, assigment, team) => {
    // console.log(team, task, assigment)
    let index = teams.findIndex((x) => x.team.id == team.id)
    if (index < 0) {
      let newTeam = {
        team: team,
        tasks: [task],
        id: team.id,
      }
      teams.push(newTeam)
    } else {
      let newTeam = teams[index]
      if (newTeam != undefined) newTeam.tasks.push(task)
    }
  }

  const updateContributorData = (task, assigment, contributor) => {
    console.log(contributor, task, assigment)
    let index = contributors.findIndex((x) => x.contributor.id == contributor.id)
    if (index < 0) {
      let newContributor = {
        contributor: contributor,
        tasks: [task],
        id: contributor.id,
      }
      contributors.push(newContributor)
    } else {
      let newTeam = contributors[index]
      if (newTeam != undefined) newTeam.tasks.push(task)
    }
  }

  // console.log(tasks)

  tasks.forEach((task) => {
    if (task.assignees != undefined) {
      task.assignees.forEach((assigment) => {
        let team = assigment.team
        if (team != null) {
          updateTeamData(task, assigment, team)
        }
        let contributor = assigment.contributor
        if (contributor != null) {
          updateContributorData(task, assigment, contributor)
        }
      })
    }
  })
  // console.log(teams)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By contributors organization</h1>
      <div>
        <h2>Teams Summary</h2>
        {teams.map((teamInfo) => (
          <TeamView
            team={teamInfo.team}
            tasks={teamInfo.tasks}
            id={teamInfo.id}
            key={teamInfo.id}
          ></TeamView>
        ))}
      </div>
      <div>
        <h2>Contributors Summary</h2>
        {contributors.map((conInfo) => (
          <ContributorsView
            contributor={conInfo.contributor}
            tasks={conInfo.tasks}
            id={conInfo.id}
            key={conInfo.id}
          ></ContributorsView>
        ))}
      </div>
    </main>
  )
}

export default ByContributors
