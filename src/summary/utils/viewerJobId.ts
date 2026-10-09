import path from "path"

// Build jobs are named by an id from nanoid (letters, digits, "_" and "-"). The id ends up in a
// file name, so anything else (dots, slashes) is refused rather than trusted.
export const isValidJobId = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(value)

const BUILDS_DIR = () => path.join(process.cwd(), "viewer-builds")

export const viewerZipPath = (jobId: string): string => {
  const resolved = path.join(BUILDS_DIR(), `Project_Summary_${jobId}.zip`)
  // belt and braces: never leave the builds folder
  if (!resolved.startsWith(BUILDS_DIR() + path.sep)) throw new Error("Invalid job id")
  return resolved
}
