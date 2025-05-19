import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTags from "src/tags/queries/getTags"
import getTasks from "src/tasks/queries/getTasks" // Adjust the path as needed
import { WithContext as ReactTags } from "react-tag-input"
import { useParam } from "@blitzjs/next"

const TagDisplay = () => {
  const projectId = useParam("projectId", "number")

  // Fetch tasks with their tags
  const [tasksFromTags] = useQuery(getTags, {
    where: {
      projectId: projectId,
    },
    orderBy: { createdAt: "desc" },
  })

  // Flatten all tags into a single array
  const allTags = tasksFromTags
    .flatMap((task) => (task.tags ? (task.tags as { key: string; value: string }[]) : []))
    .map((tag) => ({
      id: tag.key,
      text: tag.value,
      className: "",
    }))

  // Optional: Remove duplicates
  const uniqueTags = Array.from(new Map(allTags.map((tag) => [tag.id, tag])).values())

  // State for selected tag
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Filter tasks locally based on the selected tag
  const filteredTasks =
    selectedTag !== null
      ? tasksFromTags.filter(
          (task) =>
            Array.isArray(task.tags) &&
            (task.tags as { key: string; value: string }[]).some((tag) => tag.value === selectedTag)
        )
      : []

  const handleTagClick = (index) => {
    const selectedTag = uniqueTags[index]
    //console.log("Tag clicked:", selectedTag?.text)
    setSelectedTag(selectedTag!.text)
  }

  return (
    <div className="p-4">
      <h1 className="flex justify-center mb-2 text-3xl">Tags</h1>
      {uniqueTags.length === 0 ? (
        <p>No tags found.</p>
      ) : (
        <ReactTags
          tags={uniqueTags}
          handleTagClick={handleTagClick}
          classNames={{
            tags: "mt-2 p-2 rounded-md bg-base-300 react-tags-wrapper", // entire box for tags
            tag: "inline-flex items-center bg-primary text-primary-content px-2 py-1 rounded-md mr-2 text-lg",
            remove: "hidden",
            tagInput: "hidden", // whole div around
            tagInputField:
              "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4", // just input field

            selected: "bg-base-300",
            editTagInput: "bg-base-300",
            editTagInputField:
              "input input-primary input-bordered border-2 bg-base-300 text-primary text-lg w-3/4",
            clearAll: "font-bold ml-3",
            suggestions: "suggestions-dropdown",
            activeSuggestion: "active-suggestion-class",
          }}
        />
      )}

      {/* Display tasks related to the selected tag */}
      {selectedTag && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Tasks with tag: {selectedTag}</h2>
          {filteredTasks.length === 0 ? (
            <p>No tasks found with this tag.</p>
          ) : (
            <ul className="list-disc pl-5">
              {filteredTasks.map((task) => (
                <li key={task.id} className="mb-2">
                  <div className="p-3 border rounded-md bg-base-200">
                    <h3 className="font-semibold">{task.name}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500">{task.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default TagDisplay
