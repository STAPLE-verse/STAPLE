import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { FormTaskSchema } from "src/tasks/schemas"
import createTask from "src/tasks/mutations/createTask"
import { TaskForm } from "src/tasks/components/TaskForm"
import { FORM_ERROR } from "final-form"
import getTask from "src/tasks/queries/getTask"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import toast from "react-hot-toast"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import Link from "next/link"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

const NewTaskPage = () => {
  const router = useRouter()
  const [createTaskMutation] = useMutation(createTask)

  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  const handleNewTask = async (values) => {
    const normTags = Array.isArray(values.tags)
      ? (values.tags as any[])
          .map((t: any) => {
            const key = (typeof t === "string" ? t : t?.key ?? t?.id ?? t?.value ?? t?.text ?? "")
              .toString()
              .trim()
            const value = (typeof t === "string" ? t : t?.value ?? t?.text ?? t?.id ?? t?.key ?? "")
              .toString()
              .trim()
            if (!key) return null
            return { key, value: value || key }
          })
          .filter((x: any): x is { key: string; value: string } => !!x)
      : undefined

    try {
      const task = await createTaskMutation({
        ...values,
        ...(normTags && normTags.length ? { tags: normTags } : {}),
        projectId: projectId!,
        createdById: currentContributor!.id,
      })

      await toast.promise(Promise.resolve(task), {
        loading: "Creating task...",
        success: "Task created!",
        error: "Failed to create the task...",
      })

      await router.push(Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id }))
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const mapTaskToInitialValues = (task: any) => {
    if (!task) return undefined

    const initial: any = {}

    // Only copy simple text/date/ids
    if (typeof task.name === "string" && task.name.trim()) initial.name = `${task.name} (Copy)`
    if ("description" in task) initial.description = task.description ?? null
    if ("milestoneId" in task) initial.milestoneId = task.milestoneId ?? null
    if ("deadline" in task && task.deadline) initial.deadline = new Date(task.deadline)
    if ("formVersionId" in task) initial.formVersionId = task.formVersionId ?? null
    if ("startDate" in task && task.startDate) initial.startDate = new Date(task.startDate)
    if ("containerId" in task) initial.containerId = task.containerId ?? null
    if ("anonymous" in task) initial.anonymous = task.anonymous ?? false

    // Map contributors/teams from assignedMembers if present (kept minimal)
    if (Array.isArray((task as any).assignedMembers)) {
      const assigned = (task as any).assignedMembers as any[]
      const contributors: number[] = []
      const teams: number[] = []
      for (const m of assigned) {
        const id = typeof m?.id === "number" ? m.id : undefined
        const usersLen = Array.isArray(m?.users) ? m.users.length : 0
        if (typeof id === "number") {
          if (usersLen > 1) teams.push(id)
          else contributors.push(id)
        }
      }
      if (contributors.length) initial.projectMembersId = contributors
      if (teams.length) initial.teamsId = teams
    }

    // Map roles if included
    if (Array.isArray((task as any).roles)) {
      const rids = (task as any).roles
        .map((r: any) => (typeof r?.id === "number" ? r.id : undefined))
        .filter((n: any) => typeof n === "number")
      if (rids.length) initial.rolesId = rids
    }

    // Copy simple numeric ID arrays (no relation includes)
    const toNumArray = (arr: any) =>
      Array.isArray(arr)
        ? arr
            .map((v) => (v == null ? v : Number(v)))
            .filter((v) => typeof v === "number" && !Number.isNaN(v))
        : undefined

    const roleIds = toNumArray((task as any).rolesId)
    if (roleIds && roleIds.length) initial.rolesId = roleIds

    const memberIds = toNumArray((task as any).projectMembersId)
    if (memberIds && memberIds.length) initial.projectMembersId = memberIds

    const teamIds = toNumArray((task as any).teamsId)
    if (teamIds && teamIds.length) initial.teamsId = teamIds

    // Copy tags in UI shape expected by the tag input ({ id, text })
    if (Array.isArray((task as any).tags)) {
      const src = (task as any).tags as any[]
      const uiTags = src
        .map((t) => {
          if (!t) return undefined
          if (typeof t === "object") {
            if (
              "id" in t &&
              "text" in t &&
              typeof t.id === "string" &&
              typeof t.text === "string"
            ) {
              return { id: t.id, text: t.text }
            }
            if (
              "key" in t &&
              "value" in t &&
              typeof (t as any).key === "string" &&
              typeof (t as any).value === "string"
            ) {
              return { id: (t as any).key, text: (t as any).value }
            }
          }
          if (typeof t === "string") return { id: t, text: t }
          return undefined
        })
        .filter(Boolean)
      if (uiTags.length) initial.tags = uiTags as { id: string; text: string }[]
    }

    return initial
  }

  // Wrapper to handle copyFromTaskId and fetch the source task if needed
  const TaskFormWrapper = ({ projectId, onSubmit, onCancel, schema }: any) => {
    const router = useRouter()
    const copyFromTaskIdParam = router.query.copyFromTaskId
    const copyFromTaskId =
      typeof copyFromTaskIdParam === "string"
        ? parseInt(copyFromTaskIdParam, 10)
        : Array.isArray(copyFromTaskIdParam)
        ? parseInt(copyFromTaskIdParam[0]!, 10)
        : undefined

    const [sourceTask] = useQuery(
      getTask,
      {
        where: { id: copyFromTaskId ?? -1 },
        include: {
          assignedMembers: { include: { users: { select: { id: true } } } },
          roles: { select: { id: true } },
        },
      },
      {
        enabled: Boolean(copyFromTaskId),
        suspense: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )

    const initialValues = mapTaskToInitialValues(sourceTask)

    return (
      <TaskForm
        className="flex flex-col"
        projectId={projectId}
        submitText="Create Task"
        schema={schema}
        onSubmit={onSubmit}
        onCancel={onCancel}
        cancelText="Cancel"
        {...(initialValues ? { initialValues } : {})}
      />
    )
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Create New Task">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center mb-2 text-3xl">
          Create New Task
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="project-overview"
          />
          <Tooltip
            id="project-overview"
            content="This page creates a new task in which you can assign people or teams and then also assign them to complete a metadata form for parts of your project. You can add due dates, roles, and tags to help you organize."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={Routes.AllFormsPage()}
            className="btn btn-primary"
            data-tooltip-id="forms-overview"
          >
            Go to Forms
          </Link>
          <Link
            href={Routes.RoleBuilderPage()}
            className="btn btn-secondary"
            data-tooltip-id="roles-overview"
          >
            Go to Roles
          </Link>
          <Tooltip
            id="roles-overview"
            content="Set up project roles on the Roles page so you can assign them to this task. You can add or edit roles later."
            className="z-[1099] ourtooltips"
          />
          <Tooltip
            id="forms-overview"
            content="Create your form first if you plan to require one for this task. Adding a new form later requires creating a new task."
            className="z-[1099] ourtooltips"
          />
        </div>
        <TaskFormWrapper
          projectId={projectId}
          schema={FormTaskSchema}
          onSubmit={handleNewTask}
          onCancel={() => router.push(Routes.TasksPage({ projectId: projectId! }))}
        />
      </main>
    </Layout>
  )
}

NewTaskPage.authenticate = true

export default NewTaskPage
