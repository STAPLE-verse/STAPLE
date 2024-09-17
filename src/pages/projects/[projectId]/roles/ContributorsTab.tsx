import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"

import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import {
  ProjectMemberLabelInformation,
  labelProjectMemberTableColumns,
} from "src/labels/components/LabelProjectMemberTable"

import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { AddLabelForm } from "src/labels/components/AddLabelForm"
import { LabelIdsFormSchema } from "src/labels/schemas"
import updateProjectMemberLabel from "src/projectmembers/mutations/updateProjectMemberLabel"

export const AllProjectMemberLabelsList = ({ projectMembers, onChange }) => {
  const [updateProjectMemberLabelMutation] = useMutation(updateProjectMemberLabel)
  const projectId = useParam("projectId", "number")

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const [selectedIds, setSelectedIds] = useState([] as number[])
  const handleMultipleChanged = (selectedId: number) => {
    const isSelected = selectedIds.includes(selectedId)
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
      const updated = await updateProjectMemberLabelMutation({
        ...values,
        projectMembersId: selectedIds,
        disconnect: false,
      })
      await labelChanged()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to contributors...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
      handleToggleEditLabelModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const initialValues = {
    labelsId: [],
  }

  const taskInformation = projectMembers.map((contributor) => {
    const name = projectMember.user.username
    const lastname = projectMember.user.lastName
    const firstName = projectMember.user.firstName

    //TODO merge with task information tab
    let t: ProjectMemberLabelInformation = {
      username: name,
      firstname: firstName,
      lastname: lastname,
      id: projectMember.id,
      labels: projectMember.labels,
      onChangeCallback: labelChanged,
      selectedIds: selectedIds,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = projectMembers.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={labelProjectMemberTableColumns} data={taskInformation} addPagination={true} />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          onClick={handleToggleEditLabelModal}
          disabled={hasElements}
        >
          Add Multiple
        </button>

        <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
            <div className="flex justify-start mt-4">
              <AddLabelForm
                projectId={projectId}
                schema={LabelIdsFormSchema}
                submitText="Update Role"
                className="flex flex-col"
                onSubmit={handleAddLabel}
                initialValues={initialValues}
              ></AddLabelForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-secondary"
                onClick={handleToggleEditLabelModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}

const ProjectMembersTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ projectMembers }, { refetch }] = useQuery(getProjectMembers, {
    where: { project: { id: projectId! } },
    include: { user: true, labels: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllProjectMemberLabelsList projectMembers={projectMembers} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default ProjectMembersTab
