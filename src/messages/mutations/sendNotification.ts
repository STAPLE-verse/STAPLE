import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { getDynamicSchema } from "../schemas"
import db from "db"
import { compileTemplate } from "../compileTemplate"

const sendNotificationSchema = z.object({
  templateId: z.string(),
  recipients: z.array(z.number()),
  projectId: z.number().optional(),
  data: z.any(), // This will be validated dynamically based on the notification template that is being used
})

export default resolver.pipe(
  resolver.zod(sendNotificationSchema),
  resolver.authorize(),
  async ({ templateId, data, recipients, projectId }) => {
    try {
      // Validate the data against the dynamic schema
      const dynamicSchema = getDynamicSchema(templateId)
      const validationResult = dynamicSchema.safeParse(data)

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors
          .map((error) => JSON.stringify(error))
          .join(", ")
        throw new Error(
          `Data validation failed for template: ${templateId}. Errors: ${errorMessage}`
        )
      }

      // Compiling the message
      const message = await compileTemplate(templateId, validationResult.data)

      const notification = await db.notification.create({
        data: {
          message: message,
          recipients: {
            connect: recipients.map((id) => ({ id })),
          },
          ...(projectId ? { projectId } : {}),
        },
      })

      return notification
    } catch (error) {
      console.error("Error sending notification:", error)
      throw error
    }
  }
)
