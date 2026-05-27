import { useQuery, invalidateQuery } from "@blitzjs/rpc"
import { useMutation } from "@blitzjs/rpc"
import { useState, useMemo } from "react"
import listNotes from "../queries/listNotes"
import deleteNote from "../mutations/deleteNote"
import updateNote from "src/notes/mutations/updateNote"
import NoteEditor from "./NotesEditor"
import SearchButton from "src/core/components/SearchButton"

type SortOption = "updatedAt" | "createdAt" | "title"

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const NotesPanel = ({ projectId }: { projectId: number }) => {
  const [includeArchived, setIncludeArchived] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt")
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, { refetch, setQueryData }] = useQuery(
    listNotes,
    { projectId, includeArchived },
    { suspense: false }
  )
  const [deleteNoteMutation] = useMutation(deleteNote)
  const [updateNoteMutation] = useMutation(updateNote)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredAndSortedNotes = useMemo(() => {
    if (!notes) return []
    let result = [...notes]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((n) => (n.title ?? "Untitled").toLowerCase().includes(q))
    }

    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (sortBy === "title") {
        if (!a.title && b.title) return 1
        if (a.title && !b.title) return -1
        return (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase())
      }
      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    return result
  }, [notes, searchQuery, sortBy])

  const canEditRow = (n: any) => {
    if (!n) return false
    return !!n.editable || (!!n.canSetContributors && n.visibility === "CONTRIBUTORS")
  }

  const formatNoteMd = (n: any) => {
    const title = n.title || "Untitled"
    const created = new Date(n.createdAt).toLocaleString()
    const edited = new Date(n.updatedAt).toLocaleString()
    const meta = `_Created: ${created} · Last edited: ${edited}_`
    const body = n.contentMarkdown ?? "(No content)"
    return `# ${title}\n\n${meta}\n\n${body}`
  }

  const handleDownloadNote = (n: any) => {
    const title = n.title || "Untitled"
    const safeTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || "note"
    downloadMarkdown(`${safeTitle}.md`, formatNoteMd(n))
  }

  const handleDownloadAll = () => {
    if (!filteredAndSortedNotes.length) return
    const combined = filteredAndSortedNotes.map(formatNoteMd).join("\n\n---\n\n")
    downloadMarkdown("notes.md", combined)
  }

  return (
    <div className="space-y-4">
      {/* Index toolbar — hidden while editing/creating */}
      {!(creating || editingId !== null) && (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchButton onChange={(val) => setSearchQuery(String(val))} className="max-w-none" />
          </div>
          <select
            className="select rounded-full border-2 border-primary bg-base-300"
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortBy(e.target.value as SortOption)
            }
          >
            <option value="updatedAt">Last edited</option>
            <option value="createdAt">Date created</option>
            <option value="title">Title A–Z</option>
          </select>
          <label className="label cursor-pointer gap-2">
            <span className="text-sm">Show archived</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={includeArchived}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIncludeArchived(e.target.checked)
              }
            />
          </label>
          {filteredAndSortedNotes.length > 0 && (
            <button className="btn btn-accent" onClick={handleDownloadAll}>
              Download all
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            New note
          </button>
        </div>
      )}

      {/* Create mode: show editor with no noteId */}
      {creating && (
        <NoteEditor
          projectId={projectId}
          className="shadow"
          onCreated={async (id) => {
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
              initialVisibility={n.visibility}
              className="shadow"
              readOnly={!canEditRow(n)}
              canSetContributors={!!n.canSetContributors}
              onClose={() => setEditingId(null)}
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
          {filteredAndSortedNotes.map((n) => (
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
                      disabled={!canEditRow(n)}
                      onClick={async () => {
                        await updateNoteMutation({ id: n.id, pinned: !n.pinned })
                        await refetch()
                      }}
                    >
                      {n.pinned ? "Unpin" : "Pin"}
                    </button>
                    {!n.archived && (
                      <button
                        className="btn btn-warning"
                        disabled={!canEditRow(n)}
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
                        className="btn btn-warning"
                        disabled={!canEditRow(n)}
                        onClick={async () => {
                          await updateNoteMutation({ id: n.id, archived: false })
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
                    <button className="btn btn-accent" onClick={() => handleDownloadNote(n)}>
                      Download
                    </button>
                    <button className="btn btn-primary" onClick={() => setEditingId(n.id)}>
                      {canEditRow(n) ? "Edit" : "View"}
                    </button>
                    <button
                      className="btn btn-error"
                      disabled={!canEditRow(n)}
                      onClick={async () => {
                        if (window.confirm("This note will be permanently deleted. Continue?")) {
                          await deleteNoteMutation({ id: n.id })
                          setEditingId(null)
                          setCreating(false)
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
          {!filteredAndSortedNotes.length && !creating && (
            <div className="card bg-base-300 shadow border border-dashed border-base-300">
              <div className="card-body items-center text-center p-6">
                {notes?.length && searchQuery ? (
                  <div className="text-lg opacity-70">No notes match your search</div>
                ) : (
                  <>
                    <div className="text-lg opacity-70 mb-3">No notes yet</div>
                    <button className="btn btn-primary" onClick={() => setCreating(true)}>
                      Create your first note
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </ul>
      )}
    </div>
  )
}
