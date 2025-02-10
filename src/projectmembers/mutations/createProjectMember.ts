import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectMemberSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/core/utils/getPrivilegeText"
import { Routes } from "@blitzjs/next"

export default resolver.pipe(
  resolver.zod(CreateProjectMemberSchema),
  resolver.authorize(),
  async ({ invitationCode, userId }, ctx) => {
    let textResult

    // Get the invitation information based on the invitation code
    const projectInvite = await db.invitation.findFirst({
      where: {
        invitationCode: invitationCode,
      },
      include: {
        roles: true,
      },
    })

    if (projectInvite) {
      // Create projectMember without privilege
      const projectMember = await db.projectMember.create({
        data: {
          projectId: projectInvite.projectId,
          users: {
            connect: { id: userId },
          },
        },
      })

      // Assign roles to the project member
      if (projectInvite.roles && projectInvite.roles.length > 0) {
        await db.projectMember.update({
          where: { id: projectMember.id },
          data: {
            roles: {
              connect: projectInvite.roles.map((role) => ({ id: role.id })),
            },
          },
        })
      }

      // Create the project privilege for the project member
      await db.projectPrivilege.create({
        data: {
          userId: userId,
          projectId: projectInvite.projectId,
          privilege: projectInvite.privilege,
        },
      })

      // Get information for the notification
      const project = await db.project.findFirst({ where: { id: projectInvite.projectId } })

      if (!project) {
        throw new Error("Project not found.")
      }

      // Send notification
      await sendNotification(
        {
          templateId: "addedToProject",
          recipients: [userId],
          data: {
            projectName: project.name,
            addedBy: projectInvite.addedBy,
            privilege: getPrivilegeText(projectInvite.privilege),
          },
          projectId: projectMember.projectId,
          routeData: {
            path: Routes.ShowProjectPage({ projectId: projectInvite.projectId }).href,
          },
        },
        ctx
      )

      // Delete invitation(s) for that email and project Id
      await db.invitation.deleteMany({
        where: {
          email: projectInvite.email,
          projectId: projectInvite.projectId,
        },
      })
      textResult = {
        code: "worked",
        projectId: projectInvite.projectId,
      }
    } else {
      textResult = {
        code: "no_code",
      }
    }

    return textResult
  }
)
