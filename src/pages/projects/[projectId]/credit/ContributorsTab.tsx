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
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import { truncate } from "fs"
import {
  ContributorLabelInformation,
  labelContributorTableColumns,
} from "src/labels/components/LabelContributorTable"

import getContributors from "src/contributors/queries/getContributors"

export const AllContributorLabelsList = ({ hasMore, page, contributors, onChange }) => {
  const router = useRouter()

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  console.log(contributors)

  const taskInformation = contributors.map((contributor) => {
    const name = contributor.user.username
    const lastname = contributor.user.lastName
    const firstName = contributor.user.firstName
    // const desciprition = task.description || ""

    // console.log(task.labels)
    //TODO LABels need from query
    let t: ContributorLabelInformation = {
      username: name,
      firstname: firstName,
      lastname: lastname,
      id: contributor.id,
      labels: [], //task.labels,
      onChangeCallback: labelChanged,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={labelContributorTableColumns} data={taskInformation} />
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

const ContributorsTab = () => {
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const ITEMS_PER_PAGE = 7

  //move to label list
  // const [{ labels, hasMore }, { refetch }] = usePaginatedQuery(getLabels, {
  //   //where: { user: { id: { equals: userId! } } },
  //   orderBy: { id: "asc" },
  //   skip: ITEMS_PER_PAGE * page,
  //   take: ITEMS_PER_PAGE,
  // })

  //TODO fix query to include labels, add relationship on db
  const [{ contributors, hasMore }, { refetch }] = usePaginatedQuery(getContributors, {
    where: { project: { id: projectId! } },
    include: { user: true },
    // include: { labels: true },
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

  const handleCreateLabel = async (values) => {
    try {
      const label = await createLabelMutation({
        name: values.name,
        description: values.description,
        userId: currentUser!.id,
        taxonomy: values.taxonomy,
      })
      await reloadTable()
      await toast.promise(Promise.resolve(label), {
        loading: "Creating label...",
        success: "Label created!",
        error: "Failed to create the label...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2">Contributors</h1>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllContributorLabelsList
            page={page}
            contributors={contributors}
            hasMore={hasMore}
            onChange={reloadTable}
          />
        </Suspense>
      </div>
    </main>
  )
}

export default ContributorsTab
