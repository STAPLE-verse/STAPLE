import { resolver } from "@blitzjs/rpc";
import db from "db";
import { DeleteTaskSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(DeleteTaskSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.deleteMany({ where: { id } });

    return task;
  }
);
