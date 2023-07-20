import { resolver } from "@blitzjs/rpc";
import db from "db";
import { UpdateProjectSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(UpdateProjectSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.update({ where: { id }, data });

    return project;
  }
);
