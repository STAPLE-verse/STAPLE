import { resolver } from "@blitzjs/rpc"
import db from "db"

export type UpdateWidgetPositionInput = {
  id: number
  position: number
}[]

export interface UpdatePositionsInput {
  positions: UpdateWidgetPositionInput
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ positions }: UpdatePositionsInput, ctx) => {
    const userId = ctx.session.userId

    if (positions.length === 0) {
      throw new Error("No positions provided")
    }

    const updates = positions.map(async ({ id, position }) => {
      const widget = await db.widget.findFirst({
        where: { id, userId },
      })

      if (!widget) {
        throw new Error("Widget not found or does not belong to the user")
      }

      return db.widget.update({
        where: { id },
        data: { position },
      })
    })

    const results = await Promise.all(updates)
    return results
  }
)
