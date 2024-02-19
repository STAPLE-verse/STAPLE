import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, contributorsId, teamsId, ...data }) => {
    // TODO: Assignment update logic needs to be implemented
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const task = await db.task.update({ where: { id }, data })

    if (contributorsId != undefined) {
      contributorsId.forEach(async (contributor) => {
        let contributorId = contributor["id"]
        //is a new addition?
        if (contributor["assigmentId"] == undefined && contributor["checked"]) {
          const assignment = await db.assignment.create({
            data: {
              task: { connect: { id: task.id } },
              contributor: { connect: { id: contributorId } },
            },
          })
        }
        //old contributor that will be removed
        if (contributor["assigmentId"] != undefined && !contributor["checked"]) {
          await db.assignment.delete({ where: { id: contributor["assigmentId"] } })
        }
      })
    }
    //refactor to one general method
    if (teamsId != undefined) {
      teamsId.forEach(async (team) => {
        let teamId = team["id"]
        //is a new addition?
        if (team["assigmentId"] == undefined && team["checked"]) {
          const assignment = await db.assignment.create({
            data: {
              task: { connect: { id: task.id } },
              team: { connect: { id: teamId } },
            },
          })
        }
        //old team that will be removed
        if (team["assigmentId"] != undefined && !team["checked"]) {
          await db.assignment.delete({ where: { id: team["assigmentId"] } })
        }
      })
    }

    return task
  }
)
