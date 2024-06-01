export interface TeamInformation {
  team: any
  tasks: any[]
  id: number
}

export interface ContributorInformation {
  contributor: any
  tasks: any[]
  id: number
}

export interface FlattenTasks {
  teamsInformation: TeamInformation[]
  contributorsInformation: ContributorInformation[]
}

function flattenTasksInformation(tasks): FlattenTasks {
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
    // console.log(contributor, task, assigment)
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
  //TODO needs to sort teams and contributors
  let sortedTeams = teams
  let sortedContributors = contributors

  return {
    teamsInformation: sortedTeams,
    contributorsInformation: sortedContributors,
  }
}

export default flattenTasksInformation
