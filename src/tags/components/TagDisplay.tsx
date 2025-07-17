import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTags from "src/tags/queries/getTags"
import { WithContext as ReactTags } from "react-tag-input"
import { useParam } from "@blitzjs/next"
import getTaskTags from "../queries/getTaskTags"
import getMilestoneTags from "../queries/getMilestoneTags"
import { TagTaskTable } from "./TagTaskTable"
import { TagMilestoneTable } from "./TagMilestoneTable"
import getPeopleTags from "../queries/getPeopleTags"
import { TagPeopleTable } from "./TagPeopleTable"
import { TagOverall } from "./TagOverall"

const TagDisplay = () => {
  const projectId = useParam("projectId", "number")

  // get task tags
  const [allTaskTags] = useQuery(getTaskTags, { projectId: projectId! })

  // get milestone tags
  const [allMilestoneTags] = useQuery(getMilestoneTags, { projectId: projectId! })

  const [allPeopleTags] = useQuery(getPeopleTags, { projectId: projectId! })

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
  // Sort tags alphabetically by their text value
  uniqueTags.sort((a, b) => a.text.localeCompare(b.text))

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

  const filteredPeople =
    selectedTag !== null
      ? allPeopleTags.filter(
          (people) =>
            Array.isArray(people.tags) &&
            people.tags.some((tag) => (tag as { key: string; value: string }).value === selectedTag)
        )
      : []

  //console.log("Selected Tag:", selectedTag)
  //console.log("Filtered Tasks:", filteredTasks)
  //console.log("Filtered Milestones:", filteredMilestones)
  //console.log("Filtered People:", filteredPeople)

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
            tags: "pt-4 pl-4 pr-4 pb-2 rounded-lg bg-base-300 react-tags-wrapper flex flex-wrap", // entire box for tags with wrapping and vertical spacing
            tag: "inline-flex items-center bg-primary text-primary-content px-2 py-1 rounded-md mr-2 text-lg mb-2",
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
        <>
          {(filteredPeople.length > 0 ||
            filteredTasks.length > 0 ||
            filteredMilestones.length > 0) && (
            <TagOverall
              people={filteredPeople}
              tasks={filteredTasks}
              milestones={filteredMilestones}
            />
          )}
          {filteredPeople.length > 0 && <TagPeopleTable people={filteredPeople} />}
          {filteredTasks.length > 0 && <TagTaskTable tasks={filteredTasks} />}
          {filteredMilestones.length > 0 && <TagMilestoneTable milestones={filteredMilestones} />}
        </>
      )}
    </div>
  )
}

export default TagDisplay
