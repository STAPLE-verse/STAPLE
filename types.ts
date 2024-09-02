import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"

export type Role = "ADMIN" | "USER"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}

// Extend the ColumnDef type globally in @tanstack/react-table
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterVariant?: "text" | "html" | "range" | "select"
  }
}
