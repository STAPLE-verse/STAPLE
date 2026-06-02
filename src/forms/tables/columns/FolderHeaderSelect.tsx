import { useQuery } from "@blitzjs/rpc"
import getFolders from "src/folders/queries/getFolders"

type Props = {
  onChange?: (folderId: number | null | "all") => void
}

export default function FolderHeaderSelect({ onChange }: Props) {
  const [folders] = useQuery(getFolders, {})

  return (
    <select
      className="text-primary input-primary input-bordered border-2 bg-base-300 rounded input-sm leading-normal mt-0 w-full"
      defaultValue="all"
      onChange={(e) => {
        const val = e.target.value
        const id = val === "all" ? "all" : val === "" ? null : parseInt(val, 10)
        onChange?.(id)
      }}
    >
      <option value="all">All Folders</option>
      <option value="">Unfiled</option>
      {folders.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  )
}
