import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import { WithContext as ReactTags } from "react-tag-input"
import type { Tag } from "react-tag-input/types/components/SingleTag"
import updateFormMeta from "src/forms/mutations/updateFormMeta"

type Props = {
  formId: number
  initialTags: string[]
  onUpdate?: (tags: string[]) => void
}

const toTag = (t: string): Tag => ({ id: t, text: t, className: "" })

export default function FormTagEditor({ formId, initialTags, onUpdate }: Props) {
  const [tags, setTags] = useState<Tag[]>(initialTags.map(toTag))
  const [updateMeta] = useMutation(updateFormMeta)

  const save = async (newTags: Tag[]) => {
    const tagStrings = newTags.map((t) => t.text).filter((t): t is string => Boolean(t))
    await updateMeta({ id: formId, tags: tagStrings })
    onUpdate?.(tagStrings)
  }

  const handleAddition = (tag: Tag) => {
    const newTags = [...tags, tag]
    setTags(newTags)
    void save(newTags)
  }

  const handleDelete = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    void save(newTags)
  }

  return (
    <ReactTags
      tags={tags}
      handleAddition={handleAddition}
      handleDelete={handleDelete}
      inputFieldPosition="bottom"
      placeholder="Add a tag…"
      classNames={{
        tags: "flex flex-wrap gap-1",
        tag: "inline-flex items-center badge badge-primary gap-1",
        remove: "cursor-pointer ml-1 opacity-60 hover:opacity-100",
        tagInput: "mt-2",
        tagInputField: "input input-sm input-bordered w-full max-w-xs",
        suggestions: "absolute z-50 bg-base-200 border border-base-300 rounded shadow mt-1",
        activeSuggestion: "bg-primary text-primary-content px-2 py-1",
        selected: "",
        editTagInput: "",
        editTagInputField: "",
        clearAll: "",
      }}
    />
  )
}
