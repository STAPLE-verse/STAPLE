import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "src/labels/components/LabelForm"
import getLabels from "src/labels/queries/getLabels"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import updateTaskLabel from "src/tasks/mutations/updateTaskLabel"

import { LabelIdsFormSchema } from "src/labels/schemas"
import { AddLabelForm } from "src/labels/components/AddLabelForm"
import { PmLabelInformation, labelPmTableColumns } from "src/labels/components/LabelPmTable"

export const AlPmsLabelsList = ({ hasMore, page, labels, onChange }) => {
  const [updateTaskLabelMutation] = useMutation(updateTaskLabel)
  const router = useRouter()

  const [selectedIds, setSelectedIds] = useState([] as number[])

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
      console.log(values)
      // const updated = await updateTaskLabelMutation({
      //   ...values,
      //   tasksId: selectedIds,
      //   disconnect: false,
      // })
      // await labelChanged()
      // await toast.promise(Promise.resolve(updated), {
      //   loading: "Adding labels to tasks...",
      //   success: "Labels added!",
      //   error: "Failed to add the labels...",
      // })
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

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const labelInformation = labels.map((task) => {
    const name = task.name
    const desciprition = task.description || ""

    let t: PmLabelInformation = {
      name: name,
      description: desciprition,
      id: task.id,
      selectedIds: selectedIds,
      user: task.user.username,
      onChangeCallback: labelChanged,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={labelPmTableColumns} data={labelInformation} />
      <div className="join grid grid-cols-2 my-6">
        <button
          className="join-item btn btn-outline"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-outline " disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-outline btn-primary"
          onClick={handleToggleEditLabelModal}
        >
          Save
        </button>

        <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2">Add labels</h1>
            <div className="flex justify-start mt-4">
              <AddLabelForm
                schema={LabelIdsFormSchema}
                submitText="Update Label"
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
                className="btn btn-outline btn-primary"
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

const LabelssTab = () => {
  const currentUser = useCurrentUser()

  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const ITEMS_PER_PAGE = 7

  //TODO first get pms from projects, then get labels

  //TODO fix query to only pms on the project
  const [{ labels, hasMore }, { refetch }] = usePaginatedQuery(getLabels, {
    // where: { project: { id: projectId! }, status: TaskStatus.COMPLETED },
    include: { user: true },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2">Tasks</h1>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AlPmsLabelsList page={page} labels={labels} hasMore={hasMore} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default LabelssTab
