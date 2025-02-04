import { PrismaClient } from "@prisma/client"
import projectMemberMiddleware from "./middlewares/projectMemberMiddleware"

export default function applyMiddlewares(prisma: PrismaClient) {
  projectMemberMiddleware(prisma)
}
