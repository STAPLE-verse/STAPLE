import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { getDynamicSchema } from "../schemas"
import db from "db"

const sendNotificationSchema = z.object({
  templateId: z.string(),
  type: z.enum(["email", "notification"]),
  recipients: z.array(z.number()),
  data: z.any(), // This will be validated dynamically based on the notification template that is being used
})

export default resolver.pipe(
  resolver.zod(sendNotificationSchema),
  resolver.authorize(),
  async ({ templateId, data, type, recipients }) => {
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

      const notification = await db.notification.create({
        data: {
          template: templateId,
          type: type,
          data: validationResult.data,
          recipients: {
            connect: recipients.map((id) => ({ id })),
          },
        },
      })

      return notification
    } catch (error) {
      console.error("Error sending notification:", error)
      throw error
    }
  }
)
