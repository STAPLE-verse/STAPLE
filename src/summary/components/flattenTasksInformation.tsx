export interface TeamInformation {
  team: any
  tasks: any[]
  id: number
}

export interface ProjectMemberInformation {
  projectMember: any
  tasks: any[]
  id: number
}

export interface FlattenTasks {
  teamsInformation: TeamInformation[]
  projectMembersInformation: ProjectMemberInformation[]
}

function flattenTasksInformation(tasks): FlattenTasks {
  let teams: TeamInformation[] = []
  let projectMembers: ProjectMemberInformation[] = []

  const updateTeamData = (task, assignment, team) => {
    // console.log(team, task, assignment)
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

  const updateProjectMemberData = (task, assignment, projectMember) => {
    // console.log(projectMember, task, assignment)
    let index = projectMembers.findIndex((x) => x.projectMember.id == projectMember.id)
    if (index < 0) {
      let newProjectMember = {
        projectMember: projectMember,
        tasks: [task],
        id: projectMember.id,
      }
      projectMembers.push(newProjectMember)
    } else {
      let newTeam = projectMembers[index]
      if (newTeam != undefined) newTeam.tasks.push(task)
    }
  }

  // console.log(tasks)

  tasks.forEach((task) => {
    if (task.assignees != undefined) {
      task.assignees.forEach((assignment) => {
        let team = assignment.team
        if (team != null) {
          updateTeamData(task, assignment, team)
        }
        let projectMember = assignment.projectMember
        if (projectMember != null) {
          updateProjectMemberData(task, assignment, projectMember)
        }
      })
    }
  })
  // console.log(teams)
  //TODO needs to sort teams and projectMembers
  let sortedTeams = teams
  let sortedProjectMembers = projectMembers

  return {
    teamsInformation: sortedTeams,
    projectMembersInformation: sortedProjectMembers,
  }
}

export default flattenTasksInformation
