import { useQuery } from "@blitzjs/rpc"
import { useMemo } from "react"
import getTasks from "src/tasks/queries/getTasks"
import { mapStapleToJsonLd } from "src/forms/utils/mapStapleToJsonLd"
import DownloadJSON from "src/forms/components/DownloadJSON"

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

      const taskJsonLdObjects = Object.values(latestLogsPerPerson)
        .map((log) => log.metadata)
        .filter((metadata) => metadata && metadata._stapleSchema)
        .map((metadata) => mapStapleToJsonLd(metadata))

      if (taskJsonLdObjects.length > 0) {
        const schemaType = taskJsonLdObjects[0]?.["@type"]
        output.push({
          schema: schemaType,
          fileName: `${schemaType}-${task.name}`,
          jsonLd: {
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
