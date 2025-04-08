import { useEffect, useRef, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import updateColumn from "src/tasks/mutations/updateColumn"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"

interface EditableTitleProps {
  columnId: number
  initialTitle: string
  isEditable?: boolean
  onRefetch?: () => void
}

const EditableColumnTitle = ({
  columnId,
  initialTitle,
  isEditable = true,
  onRefetch,
}: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateColumnMutation] = useMutation(updateColumn)

  // Keep local state in sync with external changes
  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  // Focus input when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = async () => {
    const trimmed = title.trim()

    // Prevent empty title save
    if (trimmed === "") {
      toast.error("Column title cannot be empty.")
      return
    }

    // Don't update if unchanged
    if (trimmed === initialTitle.trim()) {
      setIsEditing(false)
      return
    }

    try {
      await updateColumnMutation({ id: columnId, name: title.trim() })
      toast.success("Column title updated")
      onRefetch?.() // Refetch data if provided
    } catch (error: any) {
      toast.error(error.message || "Failed to update column title.")
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      void handleSave()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setTitle(initialTitle)
    }
  }

  if (!isEditable) return <h1 className="text-xl font-semibold truncate">{title}</h1>

  return (
    <div className="flex items-center gap-2 w-full">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => void handleSave()}
          onKeyDown={handleKeyDown}
          className="input w-full text-primary input-primary input-bordered border-2 bg-base-300"
        />
      ) : (
        <>
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          <button title="Rename Column" onClick={() => setIsEditing(true)}>
            <PencilSquareIcon className="w-6 h-6 text-base-content border-transparent rounded-2xl hover:opacity-50" />
          </button>
        </>
      )}
    </div>
  )
}

export default EditableColumnTitle
