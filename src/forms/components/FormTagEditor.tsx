import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input"
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

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    setTags(newTags)
    void save(newTags)
  }

  const onClearAll = () => {
    setTags([])
    void save([])
  }

  return (
    <div className="w-full">
      <ReactTags
        tags={tags}
        separators={[SEPARATORS.TAB, SEPARATORS.COMMA, SEPARATORS.ENTER, SEPARATORS.SEMICOLON]}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        inputFieldPosition="inline"
        editable
        clearAll
        onClearAll={onClearAll}
        placeholder="Add tags"
        classNames={{
          tags: "rounded-md bg-base-300 react-tags-wrapper",
          tag: "inline-flex items-center bg-primary text-primary-content px-2 py-1 rounded-md mr-2 mb-2 text-lg",
          remove: "ml-3 text-primary-content font-bold cursor-pointer remove",
          tagInput: "bg-base-300",
          tagInputField:
            "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4",
          selected: "bg-base-300",
          editTagInput: "bg-base-300",
          editTagInputField:
            "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4 mb-4",
          clearAll: "font-bold ml-3",
          suggestions: "suggestions-dropdown",
          activeSuggestion: "active-suggestion-class",
        }}
      />
    </div>
  )
}
