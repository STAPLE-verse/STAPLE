import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreateTaskSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.create({ data: input });

    return task;
  }
);
