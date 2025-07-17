import { Routes } from "@blitzjs/next"

export const getAllValidRoutes = (): string[] => {
  const paths: string[] = []

  for (const routeFn of Object.values(Routes)) {
    if (typeof routeFn === "function") {
      try {
        const result = routeFn({} as any)
        if (result?.pathname) {
          // Convert Next.js/Blitz.js param style to path-to-regexp style
          const normalized = result.pathname.replace(/\[([^\]]+)\]/g, ":$1")
          paths.push(normalized)
        }
      } catch {
        // skip routes that require required params
      }
    }
  }

  return paths
}
