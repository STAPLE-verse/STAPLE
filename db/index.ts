import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"
import applyMiddlewares from "./applyMiddlewares"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
const db = new EnhancedPrisma()

// Apply all Prisma middlewares
applyMiddlewares(db)

export default db
