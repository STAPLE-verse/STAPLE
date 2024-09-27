import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"

import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import {
  ContributorLabelInformation,
  labelContributorTableColumns,
} from "src/labels/components/LabelContributorTable"

import getContributors from "src/contributors/queries/getContributors"
import { AddLabelForm } from "src/labels/components/AddLabelForm"
import { LabelIdsFormSchema } from "src/labels/schemas"
import updateContributorLabel from "src/contributors/mutations/updateContributorLabel"

export const AllContributorLabelsList = ({ contributors, onChange }) => {
  const [updateContributorLabelMutation] = useMutation(updateContributorLabel)
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
      const updated = await updateContributorLabelMutation({
        ...values,
        contributorsId: selectedIds,
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

  const taskInformation = contributors.map((contributor) => {
    const name = contributor.user.username
    const lastname = contributor.user.lastName
    const firstName = contributor.user.firstName

    //TODO merge with task information tab
    let t: ContributorLabelInformation = {
      username: name,
      firstname: firstName,
      lastname: lastname,
      id: contributor.id,
      labels: contributor.labels,
      onChangeCallback: labelChanged,
      selectedIds: selectedIds,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = contributors.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={labelContributorTableColumns} data={taskInformation} addPagination={true} />

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

const ContributorsTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ contributors }, { refetch }] = useQuery(getContributors, {
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
          <AllContributorLabelsList contributors={contributors} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default ContributorsTab
