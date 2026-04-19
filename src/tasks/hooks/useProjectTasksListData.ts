import { useEffect, useMemo, useState } from "react"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { MemberPrivileges, Status } from "@prisma/client"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { processProjectTasks } from "../tables/processing/processProjectTasks"
import getUserProjectMemberIds from "src/tasks/queries/getUserProjectMemberIds"
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table"

export default function useProjectTasksListData(
  projectId: number | undefined,
  pagination: PaginationState,
  search: string = "",
  columnFilters: ColumnFiltersState = []
) {
  const currentUser = useCurrentUser()
  const { privilege } = useMemberPrivileges()
  const [queryParams, setQueryParams] = useState<GetTasksInput | null>(null)
  const [userMemberIds = []] = useQuery(getUserProjectMemberIds, {
    projectId: projectId!,
    userId: currentUser?.id!,
  })

  useEffect(() => {
    if (!privilege || !currentUser || !projectId) return

    const nameFilter = columnFilters.find((f) => f.id === "name")?.value as string | undefined
    const containerFilter = columnFilters.find((f) => f.id === "container")?.value as
      | string
      | undefined
    const statusFilter = columnFilters.find((f) => f.id === "status")?.value as string | undefined

    let baseParams: GetTasksInput = {
      where: {
        project: { id: projectId },
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(nameFilter ? { name: { contains: nameFilter, mode: "insensitive" } } : {}),
        ...(containerFilter ? { container: { name: containerFilter } } : {}),
        ...(statusFilter
          ? { status: statusFilter === "Completed" ? Status.COMPLETED : Status.NOT_COMPLETED }
          : {}),
      },
      orderBy: [{ id: "asc" }],
      include: {
        container: {
          select: { name: true },
        },
        taskLogs: {
          include: {
            comments: {
              include: {
                commentReadStatus: true,
                author: {
                  include: {
                    users: {
                      select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    if (privilege === MemberPrivileges.CONTRIBUTOR) {
      baseParams.where = {
        ...baseParams.where,
        OR: [
          {
            assignedMembers: {
              some: {
                users: {
                  some: {
                    id: currentUser.id,
                  },
                },
              },
            },
          },
        ],
      }

      baseParams.include = {
        ...baseParams.include,
        taskLogs: {
          where: {
            assignedToId: {
              in: userMemberIds,
            },
          },
          include: {
            comments: {
              include: {
                commentReadStatus: true,
                author: {
                  include: {
                    users: {
                      select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    }

    setQueryParams(baseParams)
  }, [privilege, currentUser, projectId, userMemberIds, search, columnFilters])

  const queryInput = useMemo(() => {
    const base = queryParams ?? {
      where: { project: { id: -1 } }, // dummy query until params are ready
      orderBy: [{ id: "asc" }],
    }

    return {
      ...base,
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    }
  }, [queryParams, pagination])

  const [{ tasks: fetchedTasks = [], count }, { refetch }] = usePaginatedQuery(getTasks, queryInput)

  const tasks = processProjectTasks(fetchedTasks, async () => {
    await refetch()
  })
  return { tasks, refetchTasks: refetch, count }
}
