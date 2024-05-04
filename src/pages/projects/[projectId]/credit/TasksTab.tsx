import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import Modal from "src/core/components/Modal"
import { LabelForm, FORM_ERROR } from "src/labels/components/LabelForm"
import { FormApi, SubmissionErrors, configOptions } from "final-form"
import { number, z } from "zod"
import toast from "react-hot-toast"
import createLabel from "src/labels/mutations/createLabel"
import getLabels from "src/labels/queries/getLabels"
import Table from "src/core/components/Table"
import { TaskLabelInformation, labelTaskTableColumns } from "src/labels/components/LabelTaskTable"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import { truncate } from "fs"
import { TaskStatus } from "db"

export const AllTasksLabelsList = ({ hasMore, page, tasks, onChange }) => {
  const router = useRouter()

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const taskInformation = tasks.map((task) => {
    const name = task.name
    const desciprition = task.description || ""

    console.log(task.labels)

    let t: TaskLabelInformation = {
      name: name,
      description: desciprition,
      id: task.id,
      labels: task.labels,
      onChangeCallback: labelChanged,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={labelTaskTableColumns} data={taskInformation} />
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
          onClick={() => {}}
        >
          Add Multiple
        </button>
      </div>
    </main>
  )
}

const TasksTab = () => {
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const ITEMS_PER_PAGE = 7

  //TODO fix query to only completed tasks
  const [{ tasks, hasMore }, { refetch }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId! }, status: TaskStatus.COMPLETED },
    include: { labels: true },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const reloadTable = async () => {
    await refetch()
  }

  // Modal open logics
  const [openNewLabelModal, setOpenNewLabelModal] = useState(false)
  const handleToggleNewLabelModal = () => {
    setOpenNewLabelModal((prev) => !prev)
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2">Tasks</h1>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksLabelsList page={page} tasks={tasks} hasMore={hasMore} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default TasksTab
