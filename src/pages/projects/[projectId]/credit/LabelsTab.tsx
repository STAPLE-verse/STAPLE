import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import React from "react"
import { FORM_ERROR } from "final-form"
import getLabels from "src/labels/queries/getLabels"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"

import { PmLabelInformation, labelPmTableColumns } from "src/labels/components/LabelPmTable"
import toast from "react-hot-toast"
import updateProjectLabel from "src/projects/mutations/updateProjectLabel"

export const AlPmsLabelsList = ({ labels, onChange, projectId, labelsInProject }) => {
  const [updateProjectLabelMutation] = useMutation(updateProjectLabel)

  const [selectedIds, setSelectedIds] = useState(labelsInProject)

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }
  const handleMultipleChanged = (selectedId: number) => {
    const isSelected = selectedIds.includes(selectedId)
    // console.log("Id changed: ", selectedId, " is selected: ", isSelected)
    const newSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== selectedId)
      : [...selectedIds, selectedId]

    setSelectedIds(newSelectedIds)
  }

  const [openEditLabelModal, setOpenEditLabelModal] = useState(false)
  const handleToggleEditLabelModal = () => {
    setOpenEditLabelModal((prev) => !prev)
  }

  const handleAddLabel = async (values) => {
    try {
      const updated = await updateProjectLabelMutation({
        projectsId: [projectId],
        labelsId: selectedIds,
        disconnect: true,
      })
      await labelChanged()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to projects...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const labelInformation = labels.map((task) => {
    const name = task.name
    const description = task.description || ""

    let t: PmLabelInformation = {
      name: name,
      description: description,
      id: task.id,
      selectedIds: selectedIds,
      user: task.user.username,
      onChangeCallback: labelChanged,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = labels.length < 1
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={labelPmTableColumns} data={labelInformation} addPagination={true} />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          disabled={hasElements}
          className="btn btn-primary"
          onClick={handleAddLabel}
        >
          Save
        </button>
      </div>
    </main>
  )
}

const LabelsTab = () => {
  const projectId = useParam("projectId", "number")

  //only get labels that belongs to pms of current project
  const [{ labels }, { refetch }] = useQuery(getLabels, {
    where: { user: { contributions: { some: { projectId: projectId } } } },
    include: { user: true, projects: true },
    orderBy: { id: "asc" },
  })

  const projectInLabel = (projects, projectId) => {
    let t = false
    let s = projects.findIndex((p) => p.id == projectId)
    return s != -1
  }

  let checkedIds: number[] = []
  labels.forEach((label) => {
    let s = projectInLabel(label["projects"], projectId)
    if (s) checkedIds.push(label.id)
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AlPmsLabelsList
            labels={labels}
            onChange={reloadTable}
            projectId={projectId}
            labelsInProject={checkedIds}
          />
        </Suspense>
      </div>
    </main>
  )
}

export default LabelsTab
