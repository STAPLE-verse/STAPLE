import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskLabelSchema } from "../schemas"

// // Helper function to manage assignments
// async function manageAssignments(
//   taskId: number,
//   currentIds: number[],
//   newIds: number[],
//   isTeam: boolean = false
// ) {
//   // Compute IDs to add and delete
//   const idsToDelete = currentIds.filter((id) => !newIds.includes(id))
//   const idsToAdd = newIds.filter((id) => !currentIds.includes(id))

//   // Create new assignments and disconnect old ones in a single transaction
//   await db.$transaction(async (prisma) => {
//     await Promise.all(
//       idsToAdd.map((id) =>
//         prisma.assignment.create({
//           data: isTeam ? { taskId, teamId: id } : { taskId, contributorId: id },
//         })
//       )
//     )
//     await Promise.all(
//       idsToDelete.map((id) =>
//         prisma.assignment.deleteMany({
//           where: isTeam ? { taskId, teamId: id } : { taskId, contributorId: id },
//         })
//       )
//     )
//   })
// }

export default resolver.pipe(
  resolver.zod(UpdateTaskLabelSchema),
  resolver.authorize(),
  async ({ taskId, labelsId = [], ...data }) => {
    // //First unset labels
    // const task = await db.task.update({
    //   where: { id: taskId }, data: {
    //     labels: {
    //       set: []
    //     }
    //   }
    // })

    // const task1 = await db.task.update({
    //   where: { id: taskId }, data: {
    //     labels: {
    //       connect: tempLabels[0]
    //     }
    //   }
    // })

    let tempLabels = labelsId || []

    let task1
    await db.$transaction(async (prisma) => {
      const task = await db.task.update({
        where: { id: taskId },
        data: {
          labels: {
            set: [],
          },
        },
      })

      await Promise.all(
        tempLabels.map((id) => {
          const label = { id }
          task1 = db.task.update({
            where: { id: taskId },
            data: {
              labels: {
                connect: label,
              },
            },
          })
        })
      )
    })

    // return task
    return task1
  }
)
