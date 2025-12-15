import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteContributorSchema } from "../schemas"
import countProjectManagers from "src/projectmembers/queries/countProjectManagers"

export default resolver.pipe(
  resolver.zod(DeleteContributorSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // Find the contributor to be deleted
    const contributorToDelete = await db.projectMember.findUnique({
      where: { id },
      include: { users: true },
    })

    // Check if contributorToDelete is undefined or has no users
    if (!contributorToDelete) {
      throw new Error("Contributor not found")
    }

    // Ensure there's exactly one user associated with this contributor
    if (contributorToDelete.users.length !== 1) {
      throw new Error("Invalid number of users associated with this contributor")
    }

    // Get the userId from the associated users array
    const userId = contributorToDelete.users[0]!.id

    // Reconstruct possible display names used in notification messages
    const user = contributorToDelete.users[0]
    const possibleDisplayNames: string[] = []

    if (user!.firstName && user!.lastName) {
      possibleDisplayNames.push(`${user!.firstName} ${user!.lastName}`)
    }

    if (user!.username) {
      possibleDisplayNames.push(user!.username)
    }

    const notificationMarkerText = " (former contributor)"
    const notificationMarkerHtml =
      '<span class="text-base-content/70" data-former-contributor="true"> (former contributor)</span>'

    // Check if the project member has any privileges related to the project
    const projectPrivilege = await db.projectPrivilege.findFirst({
      where: {
        userId: userId,
        projectId: contributorToDelete.projectId,
      },
    })

    if (!projectPrivilege) {
      throw new Error("Project privilege not found for the user")
    }

    // Count the number of project managers in the project using the countProjectManagers query
    const projectManagerCount = await countProjectManagers(
      {
        projectId: contributorToDelete.projectId,
      },
      ctx
    )

    // Check if the projectMember to delete is the last project manager
    if (projectPrivilege.privilege === "PROJECT_MANAGER" && projectManagerCount <= 1) {
      throw new Error("Cannot delete the last project manager on the project.")
    }

    // Delete project widgets associated with this user and project
    await db.projectWidget.deleteMany({
      where: {
        userId: userId,
        projectId: contributorToDelete.projectId,
      },
    })

    // Proceed to delete the project privilege
    await db.projectPrivilege.delete({
      where: { id: projectPrivilege.id },
    })

    // Fetch all team project members associated with the project
    const teamProjectMembers = await db.projectMember.findMany({
      where: {
        projectId: contributorToDelete.projectId,
        name: { not: null }, // Ensures it’s a team project member
        users: {
          some: { id: userId },
        },
      },
    })

    const formerTeamIds = teamProjectMembers.map((teamMember) => teamMember.id)

    // Disconnect the user from each team project member individually
    for (const teamMember of teamProjectMembers) {
      await db.projectMember.update({
        where: { id: teamMember.id },
        data: {
          users: {
            disconnect: { id: userId },
          },
        },
      })
    }

    // Annotate existing notifications that reference this contributor by name
    if (possibleDisplayNames.length > 0) {
      console.log(
        `[deleteContributor] Annotating notifications for user ${userId} with names:`,
        possibleDisplayNames
      )

      const notifications = await db.notification.findMany({
        where: {
          projectId: contributorToDelete.projectId,
          announcement: false,
          AND: [
            {
              NOT: {
                message: {
                  endsWith: notificationMarkerText,
                },
              },
            },
            {
              NOT: {
                message: {
                  endsWith: notificationMarkerHtml,
                },
              },
            },
            {
              OR: possibleDisplayNames.map((name) => ({
                message: {
                  contains: name,
                  mode: "insensitive",
                },
              })),
            },
          ],
        },
        select: {
          id: true,
          message: true,
        },
      })

      console.log(
        `[deleteContributor] Found ${notifications.length} notifications requiring markers`
      )

      await Promise.all(
        notifications.map((n) => {
          const trimmed = n.message!.trim()
          const containsHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed)
          const marker = containsHtml ? notificationMarkerHtml : notificationMarkerText

          return db.notification.update({
            where: { id: n.id },
            data: {
              message: `${trimmed}${marker}`,
            },
          })
        })
      )
    } else {
      console.log(
        `[deleteContributor] No display names detected for user ${userId}, skipping notification annotations`
      )
    }

    // Disconnect the notifications related to the project
    const notificationsToUpdate = await db.notification.findMany({
      where: {
        projectId: contributorToDelete.projectId,
        recipients: {
          some: {
            id: userId, // Match notifications where this user is a recipient
          },
        },
      },
    })

    // Disconnect the user from each notification
    await db.$transaction(
      notificationsToUpdate.map((notification) =>
        db.notification.update({
          where: { id: notification.id },
          data: {
            recipients: {
              disconnect: {
                id: userId,
              },
            },
          },
        })
      )
    )

    // Mark the project member as deleted
    const projectMember = await db.projectMember.update({
      where: { id: contributorToDelete.id },
      data: {
        deleted: true,
        formerTeamIds: formerTeamIds.length > 0 ? formerTeamIds : null,
      },
    })

    return projectMember
  }
)
