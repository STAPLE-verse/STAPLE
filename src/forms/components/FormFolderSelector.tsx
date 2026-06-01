import { useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getFolders from "src/folders/queries/getFolders"
import createFolder from "src/folders/mutations/createFolder"
import updateFormMeta from "src/forms/mutations/updateFormMeta"

type Props = {
  formId: number
  currentFolderId: number | null
  onUpdate?: (folderId: number | null) => void
}

export default function FormFolderSelector({ formId, currentFolderId, onUpdate }: Props) {
  const [folders, { refetch }] = useQuery(getFolders, {})
  const [updateMeta] = useMutation(updateFormMeta)
  const [createFolderMutation] = useMutation(createFolder)
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolder, setShowNewFolder] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const folderId = val === "" ? null : parseInt(val, 10)
    await updateMeta({ id: formId, folderId })
    onUpdate?.(folderId)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    const folder = await createFolderMutation({ name: newFolderName.trim() })
    await updateMeta({ id: formId, folderId: folder.id })
    setNewFolderName("")
    setShowNewFolder(false)
    await refetch()
    onUpdate?.(folder.id)
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        className="select text-base text-primary select-secondary select-bordered border-2 bg-base-300 w-1/2 focus:outline-secondary focus:outline-offset-0 focus:outline-width-3"
        value={currentFolderId ?? ""}
        onChange={handleChange}
      >
        <option value="">— No folder —</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {showNewFolder ? (
        <div className="flex gap-2 items-center">
          <input
            className="input input-bordered text-lg border-primary rounded w-1/3 border-2 bg-base-300 text-primary"
            value={newFolderName}
            placeholder="Folder name"
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleCreateFolder()}
            autoFocus
          />
          <button className="btn btn-primary" onClick={() => void handleCreateFolder()}>
            Create
          </button>
          <button className="btn btn-secondary" onClick={() => setShowNewFolder(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="btn btn-primary w-fit" onClick={() => setShowNewFolder(true)}>
          + New folder
        </button>
      )}
    </div>
  )
}
