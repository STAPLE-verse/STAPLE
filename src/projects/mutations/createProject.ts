import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreateProjectSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreateProjectSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.create({ data: input });

    return project;
  }
);
