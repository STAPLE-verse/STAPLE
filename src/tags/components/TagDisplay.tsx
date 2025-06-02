import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTags from "src/tags/queries/getTags"
import { WithContext as ReactTags } from "react-tag-input"
import { useParam } from "@blitzjs/next"
import getTaskTags from "../queries/getTaskTags"
import getMilestoneTags from "../queries/getMilestoneTags"
import { TagTaskTable } from "./TagTaskTable"
import { TagMilestoneTable } from "./TagMilestoneTable"

const TagDisplay = () => {
  const projectId = useParam("projectId", "number")

  // get task tags
  const [allTaskTags] = useQuery(getTaskTags, { projectId: projectId! })

  // get milestone tags
  const [allMilestoneTags] = useQuery(getMilestoneTags, { projectId: projectId! })

  // Fetch tasks with their tags
  const [allTags] = useQuery(getTags, {
    where: {
      projectId: projectId,
    },
    source: "all",
  })

  // Flatten all tags into a single array
  const flattenedTags = allTags.map((tag) => ({
    id: tag.key,
    text: tag.value,
    className: "",
  }))

  // Optional: Remove duplicates
  const uniqueTags = Array.from(new Map(flattenedTags.map((tag) => [tag.id, tag])).values())

  // State for selected tag
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const handleTagClick = (index) => {
    const selectedTag = uniqueTags[index]
    //console.log("Tag clicked:", selectedTag?.text)
    setSelectedTag(selectedTag!.text)
  }

  // Filter tasks locally based on the selected tag, using allTaskTags
  const filteredTasks =
    selectedTag !== null
      ? allTaskTags.filter(
          (task) =>
            Array.isArray(task.tags) &&
            task.tags.some((tag) => (tag as { key: string; value: string }).value === selectedTag)
        )
      : []

  // Filter milestones locally based on the selected tag, using allMilestoneTags
  const filteredMilestones =
    selectedTag !== null
      ? allMilestoneTags.filter(
          (milestone) =>
            Array.isArray(milestone.tags) &&
            milestone.tags.some(
              (tag) => (tag as { key: string; value: string }).value === selectedTag
            )
        )
      : []

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
      {selectedTag && filteredTasks.length > 0 && (
        <>
          <TagTaskTable tasks={filteredTasks} />
          <TagMilestoneTable milestones={filteredMilestones} />
        </>
      )}
    </div>
  )
}

export default TagDisplay
