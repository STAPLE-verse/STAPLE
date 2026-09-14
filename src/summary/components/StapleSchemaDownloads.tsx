import { useQuery } from "@blitzjs/rpc"
import { useMemo } from "react"
import getTasks from "src/tasks/queries/getTasks"
import DownloadJSON from "src/forms/components/DownloadJSON"
import { projectMetadataResponse } from "src/forms/semantic/v1/projectMetadataResponse"

type TaskLogWithMetadata = {
  id: number
  status: string
  createdAt: Date
  assignedToId: number
  metadata: any
}

type TaskWithTaskLogsAndMetadata = {
  id: number
  name: string
  taskLogs: TaskLogWithMetadata[]
  formVersion: {
    schema: unknown
    semantics: unknown | null
  } | null
}

function semanticTypeLabel(semantics: unknown): string {
  if (!semantics || typeof semantics !== "object" || !("root" in semantics)) return "Thing"
  const root = semantics.root
  if (!root || typeof root !== "object" || !("classIri" in root)) return "Thing"
  const classIri = root.classIri
  if (typeof classIri !== "string") return "Thing"
  return classIri.split(/[\/#]/).filter(Boolean).at(-1) ?? "Thing"
}

type Props = {
  projectId: number
}

const StapleSchemaDownloads = ({ projectId }: Props) => {
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      projectId: projectId,
      formVersionId: {
        not: null,
      },
    },
    include: {
      formVersion: {
        select: {
          schema: true,
          semantics: true,
        },
      },
      taskLogs: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          assignedToId: true,
          metadata: true,
        },
      },
    },
  })

  const stapleSchemas = useMemo(() => {
    const output: Array<{ schema: string; fileName: string; jsonLd: any }> = []

    for (const task of tasks as TaskWithTaskLogsAndMetadata[]) {
      const latestLogsPerPerson: Record<number, (typeof task.taskLogs)[0]> = {}

      for (const log of task.taskLogs || []) {
        if (log?.status !== "COMPLETED" || !log?.assignedToId || !log?.createdAt) {
          continue
        }

        const existing = latestLogsPerPerson[log.assignedToId]
        if (
          !existing ||
          new Date(log.createdAt).getTime() > new Date(existing.createdAt).getTime()
        ) {
          latestLogsPerPerson[log.assignedToId] = log
        }
      }

      const projections = Object.values(latestLogsPerPerson)
        .map((log) => log.metadata)
        .filter(
          (metadata) =>
            metadata &&
            (task.formVersion?.semantics ||
              (typeof metadata === "object" && "_stapleSchema" in metadata))
        )
        .map((metadata) => projectMetadataResponse(metadata, task.formVersion))

      const failedProjection = projections.find(
        (projection) => projection.jsonLd === null || projection.diagnostics.length > 0
      )
      if (failedProjection) {
        console.error("Could not project task metadata as JSON-LD", failedProjection.diagnostics)
        continue
      }

      const usesSemanticV1 = Boolean(task.formVersion?.semantics)
      const taskJsonLdObjects = projections.flatMap((projection) =>
        usesSemanticV1 && Array.isArray(projection.jsonLd) ? projection.jsonLd : [projection.jsonLd]
      )

      if (taskJsonLdObjects.length > 0) {
        const schemaType = usesSemanticV1
          ? semanticTypeLabel(task.formVersion?.semantics)
          : taskJsonLdObjects[0]?.["@type"]
        output.push({
          schema: schemaType,
          fileName: `${schemaType}-${task.name}`,
          jsonLd: usesSemanticV1
            ? taskJsonLdObjects
            : {
                "@context": "https://schema.org",
                "@graph": taskJsonLdObjects,
              },
        })
      }
    }

    return output
  }, [tasks])

  if (!stapleSchemas.length) return null

  return (
    <>
      {stapleSchemas.map((item, index) => (
        <div key={index}>
          <DownloadJSON
            data={item.jsonLd}
            fileName={item.fileName}
            className="btn btn-primary"
            label={`Download ${item.schema} JSON-LD`}
          />
        </div>
      ))}
    </>
  )
}

export default StapleSchemaDownloads
