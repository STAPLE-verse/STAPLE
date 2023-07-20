import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreateElementSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreateElementSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const element = await db.element.create({ data: input });

    return element;
  }
);
