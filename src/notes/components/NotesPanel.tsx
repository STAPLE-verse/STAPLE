import { useQuery } from "@blitzjs/rpc"
import { useMutation } from "@blitzjs/rpc"
import { useState } from "react"
import listNotes from "../queriers/listNotes"
import deleteNote from "../mutations/deleteNote"
import updateNote from "src/notes/mutations/updateNote"
import NoteEditor from "./NotesEditor"

export default function NotesPanel({ projectId }: { projectId: number }) {
  const [includeArchived, setIncludeArchived] = useState(false)
  const [notes, { refetch, isLoading, error }] = useQuery(
    listNotes,
    { projectId, includeArchived },
    { suspense: false }
  )
  const [deleteNoteMutation] = useMutation(deleteNote)
  const [updateNoteMutation] = useMutation(updateNote)
  const [creating, setCreating] = useState(false)

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error.message || "Failed to load notes."}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">My Notes</div>
        <div className="flex items-center gap-2">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Show archived</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
            />
          </label>
          <button className="btn btn-sm btn-primary" onClick={() => setCreating(true)}>
            New note
          </button>
        </div>
      </div>

      {creating && (
        <NoteEditor
          projectId={projectId}
          className="shadow"
          onCreated={async () => {
            setCreating(false)
            await refetch()
          }}
        />
      )}

      {isLoading && !notes?.length && <div className="text-sm opacity-70">Loading your notes…</div>}

      <ul className="space-y-3">
        {notes?.map((n) => (
          <li key={n.id} className="card bg-base-100 shadow border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate">{n.title ?? "Untitled"}</div>
                <div className="flex items-center gap-2">
                  <button
                    className={`btn btn-xs ${n.pinned ? "btn-warning" : "btn-ghost"}`}
                    onClick={async () => {
                      await updateNoteMutation({ id: n.id, pinned: !n.pinned })
                      await refetch()
                    }}
                  >
                    {n.pinned ? "Unpin" : "Pin"}
                  </button>
                  {!n.archived && (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={async () => {
                        await updateNoteMutation({ id: n.id, archived: true })
                        await refetch()
                      }}
                    >
                      Archive
                    </button>
                  )}
                  <button
                    className="btn btn-xs btn-error"
                    onClick={async () => {
                      await deleteNoteMutation({ id: n.id })
                      await refetch()
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Inline editor bound to this note */}
              <NoteEditor
                projectId={projectId}
                noteId={n.id}
                initialMarkdown={n.contentMarkdown ?? ""}
                initialJSON={n.contentJSON}
              />
            </div>
          </li>
        ))}
        {!notes?.length && !creating && !isLoading && (
          <div className="card bg-base-100 shadow border border-dashed border-base-300">
            <div className="card-body items-center text-center p-6">
              <div className="text-sm opacity-70 mb-3">No notes yet.</div>
              <button className="btn btn-sm btn-primary" onClick={() => setCreating(true)}>
                Create your first note
              </button>
            </div>
          </div>
        )}
      </ul>
    </div>
  )
}
