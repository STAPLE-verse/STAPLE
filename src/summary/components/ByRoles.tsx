import React from "react"
import { RoleView } from "src/summary/components/UtilsViews"

const ByRoles = ({ roles, tasks, projectMembers }) => {
  const getRoleContributors = (roleId, projectMembers) => {
    let r = projectMembers.filter(
      (projectMember) => projectMember.roles.findIndex((role) => role.id != roleId) >= 0
    )
    return r
  }

  const getRoleTasks = (roleId, tasks) => {
    let r = tasks.filter((task) => task.roles.findIndex((role) => role.id != roleId) >= 0)
    return r
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By roles organization</h1>
      <div>
        <h2>Roles Summary</h2>
        {roles.map((role) => (
          <RoleView
            role={role}
            tasks={getRoleTasks(role.id, tasks)}
            key={role.id}
            printTask={true}
            printContributor={true}
            projectMembers={getRoleContributors(role.id, projectMembers)}
          ></RoleView>
        ))}
      </div>
    </main>
  )
}

export default ByRoles
