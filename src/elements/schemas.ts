import { z } from "zod";

export const CreateElementSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
});
export const UpdateElementSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
});

export const DeleteElementSchema = z.object({
  id: z.number(),
});
