import { useQuery, invalidateQuery } from "@blitzjs/rpc"
import { useMutation } from "@blitzjs/rpc"
import { useState } from "react"
import listNotes from "../queries/listNotes"
import deleteNote from "../mutations/deleteNote"
import updateNote from "src/notes/mutations/updateNote"
import NoteEditor from "./NotesEditor"

export const NotesPanel = ({ projectId }: { projectId: number }) => {
  const [includeArchived, setIncludeArchived] = useState(false)
  const [notes, { refetch, setQueryData }] = useQuery(
    listNotes,
    { projectId, includeArchived },
    { suspense: false }
  )
  const [deleteNoteMutation] = useMutation(deleteNote)
  const [updateNoteMutation] = useMutation(updateNote)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const sortedNotes = notes
    ? [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : []

  const canEdit = (n: any) => !!(n && (n as any).editable)

  return (
    <div className="space-y-4">
      {/* Index toolbar — hidden while editing/creating */}
      {!(creating || editingId !== null) && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <label className="label cursor-pointer">
              <span className="mr-2">Show archived</span>
              <input
                type="checkbox"
                className="toggle toggle-sm"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
              />
            </label>
            <button className="btn btn-primary" onClick={() => setCreating(true)}>
              New note
            </button>
          </div>
        </div>
      )}

      {/* Create mode: show editor with no noteId */}
      {creating && (
        <NoteEditor
          projectId={projectId}
          className="shadow"
          onCreated={async (id) => {
            // First create → switch to edit mode so the editor stays open
            setCreating(false)
            setEditingId(id)
            await refetch()
          }}
          onSaved={async () => {
            setCreating(false)
            await refetch()
          }}
        />
      )}

      {/* Edit mode: show editor for a single selected note */}
      {editingId !== null &&
        (() => {
          const n = notes?.find((x) => x.id === editingId)
          if (!n) return null
          return (
            <NoteEditor
              projectId={projectId}
              noteId={n.id}
              initialTitle={n.title ?? ""}
              initialMarkdown={n.contentMarkdown ?? ""}
              initialJSON={n.contentJSON}
              className="shadow"
              onSaved={async () => {
                setEditingId(null)
                await refetch()
              }}
            />
          )
        })()}

      {/* Index list — only when not editing/creating */}
      {!(creating || editingId !== null) && (
        <ul className="space-y-3">
          {sortedNotes.map((n) => (
            <li key={n.id} className="card bg-base-300 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-start">
                    <button
                      className="font-medium text-lg truncate text-left hover:underline"
                      onClick={() => setEditingId(n.id)}
                      title={n.title ?? "Untitled"}
                    >
                      {n.title ?? "Untitled"}
                    </button>
                    <div className="mt-1">
                      <span
                        className={
                          "badge " +
                          (n.visibility === "PRIVATE"
                            ? "badge-neutral"
                            : n.visibility === "PM_ONLY"
                            ? "badge-warning"
                            : "badge-info")
                        }
                      >
                        {n.visibility === "PRIVATE"
                          ? "Private"
                          : n.visibility === "PM_ONLY"
                          ? "PM"
                          : "Contributors"}
                      </span>
                    </div>
                    <span className="opacity-70">
                      Last edited {new Date(n.updatedAt).toLocaleDateString()}{" "}
                      {new Date(n.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`btn ${n.pinned ? "btn-warning" : "btn-secondary"}`}
                      disabled={!canEdit(n)}
                      onClick={async () => {
                        await updateNoteMutation({ id: n.id, pinned: !n.pinned })
                        await refetch()
                      }}
                    >
                      {n.pinned ? "Unpin" : "Pin"}
                    </button>
                    {!n.archived && (
                      <button
                        className="btn btn-outline"
                        disabled={!canEdit(n)}
                        onClick={async () => {
                          await updateNoteMutation({ id: n.id, archived: true })
                          await refetch()
                        }}
                      >
                        Archive
                      </button>
                    )}
                    {n.archived && (
                      <button
                        className="btn btn-outline"
                        disabled={!canEdit(n)}
                        onClick={async () => {
                          await updateNoteMutation({ id: n.id, archived: false })
                          // Optimistically update local cache to reflect unarchive
                          await setQueryData((prev) =>
                            (prev ?? []).map((x) => (x.id === n.id ? { ...x, archived: false } : x))
                          )
                          await invalidateQuery(listNotes, { projectId, includeArchived })
                          await refetch()
                        }}
                      >
                        Unarchive
                      </button>
                    )}
                    <button className="btn btn-primary" onClick={() => setEditingId(n.id)}>
                      {canEdit(n) ? "Edit" : "View"}
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={async () => {
                        if (window.confirm("This note will be permanently deleted. Continue?")) {
                          await deleteNoteMutation({ id: n.id })
                          // Close modal/editing state regardless of delete success
                          setEditingId(null)
                          setCreating(false)
                          // Optimistically update local cache
                          await setQueryData((prev) =>
                            Array.isArray(prev) ? prev.filter((x) => x.id !== n.id) : []
                          )
                          await invalidateQuery(listNotes, { projectId, includeArchived })
                          await refetch()
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {!notes?.length && !creating && (
            <div className="card bg-base-300 shadow border border-dashed border-base-300">
              <div className="card-body items-center text-center p-6">
                <div className="text-lg opacity-70 mb-3">No notes yet</div>
                <button className="btn btn-primary" onClick={() => setCreating(true)}>
                  Create your first note
                </button>
              </div>
            </div>
          )}
        </ul>
      )}
    </div>
  )
}
