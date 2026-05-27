import { useQuery, useMutation, invalidateQuery } from "@blitzjs/rpc"
import getFolders from "src/folders/queries/getFolders"
import updateFormMeta from "src/forms/mutations/updateFormMeta"
import getForms from "src/forms/queries/getForms"

type Props = {
  formId: number
  currentFolderId: number | null
}

export default function FolderCell({ formId, currentFolderId }: Props) {
  const [folders] = useQuery(getFolders, {})
  const [updateMeta] = useMutation(updateFormMeta)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const folderId = val === "" ? null : parseInt(val, 10)
    await updateMeta({ id: formId, folderId })
    await invalidateQuery(getForms)
  }

  return (
    <select
      className="select select-bordered select-sm w-full text-primary border-primary border-2 bg-primary-content"
      value={currentFolderId ?? ""}
      onChange={(e) => void handleChange(e)}
    >
      <option value="">— No folder —</option>
      {folders.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  )
}
