import { Suspense, useState } from "react"
import { invalidateQuery, useMutation, useQuery } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import getTasks from "../queries/getTasks"
import getColumns from "../queries/getColumns"
import getMilestones from "src/milestones/queries/getMilestones"
import copyTaskSet from "../mutations/copyTaskSet"
import {
  MAX_NEW_TASKS,
  MAX_SET_LABELS,
  parseLabels,
  taskNameForLabel,
} from "../utils/copyTaskSetInput"

type Props = { projectId: number }

const CopyTaskSetForm = ({ projectId, onClose }: Props & { onClose: () => void }) => {
  const [{ tasks: fetchedTasks }] = useQuery(getTasks, {
    where: { projectId },
    orderBy: { id: "asc" },
    include: { container: true },
  })
  const tasks = fetchedTasks as unknown as Array<{
    id: number
    name: string
    container?: { name: string } | null
  }>
  const [copyTaskSetMutation, { isLoading }] = useMutation(copyTaskSet)
  const [selected, setSelected] = useState<number[]>([])
  const [labelText, setLabelText] = useState("")
  const [ownMilestones, setOwnMilestones] = useState(false)

  const labels = parseLabels(labelText)
  const chosen = tasks.filter((task) => selected.includes(task.id)) // in the order they were made
  const newTaskCount = chosen.length * labels.length
  const tooMany = labels.length > MAX_SET_LABELS || newTaskCount > MAX_NEW_TASKS
  const canCreate = chosen.length > 0 && labels.length > 0 && !tooMany

  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id]
    )

  const handleCreate = async () => {
    try {
      await toast.promise(
        copyTaskSetMutation({ projectId, taskIds: selected, labels, ownMilestones }),
        {
          loading: "Copying tasks...",
          success: `Created ${newTaskCount} task${newTaskCount === 1 ? "" : "s"}.`,
          error: "Failed to copy the tasks...",
        }
      )
      await Promise.all([
        invalidateQuery(getTasks),
        invalidateQuery(getColumns),
        invalidateQuery(getMilestones),
      ])
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h3 className="text-xl font-bold mb-2">Copy a set of tasks</h3>
      <p className="mb-4">
        Pick the tasks that make up the set (for example steps 1 to 4 of a pipeline), then give a
        label for each interview or dataset. Every label gets its own copy of the whole set, named
        like &quot;Transcribe - Interview 2&quot;, with the same details, form and roles. The new
        tasks are not assigned to anyone.
      </p>

      <div className="font-bold mb-1">Tasks in the set ({chosen.length} chosen)</div>
      {tasks.length === 0 ? (
        <p className="mb-4">This project has no tasks to copy yet.</p>
      ) : (
        <div className="max-h-60 overflow-y-auto border border-base-300 rounded-lg p-2 mb-4">
          {tasks.map((task) => (
            <label key={task.id} className="flex items-center gap-3 py-1 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selected.includes(task.id)}
                onChange={() => toggle(task.id)}
              />
              <span>
                {task.name}
                {task.container?.name ? (
                  <span className="opacity-70"> ({task.container.name})</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      )}

      <label className="block font-bold mb-1" htmlFor="copy-task-set-labels">
        One label per line
      </label>
      <textarea
        id="copy-task-set-labels"
        className="textarea textarea-bordered textarea-primary w-full text-base mb-2"
        rows={4}
        placeholder={"Interview 2\nInterview 3"}
        value={labelText}
        onChange={(event) => setLabelText(event.target.value)}
      />

      <label className="flex items-center gap-3 py-1 cursor-pointer mb-2">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={ownMilestones}
          onChange={() => setOwnMilestones((current) => !current)}
        />
        <span>Put each set in its own new milestone (named after the label)</span>
      </label>

      {canCreate && (
        <p className="mb-2" data-test="copy-task-set-preview">
          This will create {newTaskCount} task{newTaskCount === 1 ? "" : "s"}
          {ownMilestones ? ` and ${labels.length} milestone${labels.length === 1 ? "" : "s"}` : ""},
          for example &quot;{taskNameForLabel(chosen[0]!.name, labels[0]!)}&quot;.
        </p>
      )}
      {tooMany && (
        <p className="mb-2 text-error">
          That is too many at once (up to {MAX_SET_LABELS} labels and {MAX_NEW_TASKS} new tasks).
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void handleCreate()}
          disabled={!canCreate || isLoading}
        >
          Create copies
        </button>
      </div>
    </>
  )
}

export const CopyTaskSetButton = ({ projectId }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        Copy Set of Tasks
      </button>
      <Modal open={open} size="w-11/12 max-w-3xl">
        {open && (
          <Suspense fallback={<p>Loading tasks...</p>}>
            <CopyTaskSetForm projectId={projectId} onClose={() => setOpen(false)} />
          </Suspense>
        )}
      </Modal>
    </>
  )
}
