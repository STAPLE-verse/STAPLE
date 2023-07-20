import { resolver } from "@blitzjs/rpc";
import db from "db";
import { UpdateTaskSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.update({ where: { id }, data });

    return task;
  }
);
