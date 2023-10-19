import db from "db"
import { resolver } from "@blitzjs/rpc"

export default async function getFlow(projectId) {
  resolver.authorize()

  const elements = await db.element.findMany({
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: { parents: true },
  })

  const nodesData = elements.map((element) => {
    return {
      id: `${element.id}`,
      data: {
        title: `${element.name.substr(0, 30)} ${element.name.length > 30 ? "[...]" : ""}`,
        description: `${element.description}`,
        projectId: projectId,
      },
      type: "elementNode",
    }
  })

  let edgesData = [] as any
  elements.map((element) => {
    if (element.parents.length > 0) {
      element.parents.map((parent) => {
        edgesData.push({
          id: `e${parent.id}-${element.id}`,
          source: `${parent.id}`,
          target: `${element.id}`,
          animated: true,
        })
      })
    }
  })

  return { nodesData, edgesData }
}
