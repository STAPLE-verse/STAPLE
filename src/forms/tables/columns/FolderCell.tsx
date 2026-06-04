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
      className="text-primary input-primary input-bordered border-2 bg-base-300 rounded input-sm leading-normal mt-0 w-full"
      value={currentFolderId ?? ""}
      onChange={(e) => void handleChange(e)}
    >
      <option value="">No Folder</option>
      {folders.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  )
}
