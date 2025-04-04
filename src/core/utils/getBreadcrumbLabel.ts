import { invoke } from "@blitzjs/rpc"
import getElement from "src/elements/queries/getElement"
import getProject from "src/projects/queries/getProject"
import getTask from "src/tasks/queries/getTask"
import getTeam from "src/teams/queries/getTeam"
import { BreadcrumbEntityType } from "../types"
import getContributor from "src/contributors/queries/getContributor"

export async function getBreadcrumbLabel(type: BreadcrumbEntityType, id: number): Promise<string> {
  switch (type) {
    case "project": {
      const data = await invoke(getProject, { id })
      return data.name
    }
    case "task": {
      const data = await invoke(getTask, { id })
      return data.name
    }
    case "element": {
      const data = await invoke(getElement, { id })
      return data.name
    }
    case "team": {
      const data = await invoke(getTeam, { id: id })
      return data.name
    }
    case "contributor": {
      const data = await invoke(getContributor, {
        where: { contributorId: id },
        include: { users: true },
      })

      const user = data?.users[0]
      return user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username ?? "Unknown"
    }
    default:
      return "Unknown"
  }
}
