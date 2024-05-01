import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { ReactFormBuilder } from "staple-form-builder"
import "staple-form-builder/dist/app.css"
import Modal from "src/core/components/Modal"
import { LabelForm, FORM_ERROR } from "src/labels/components/LabelForm"
import { FormApi, SubmissionErrors, configOptions } from "final-form"
import { number, z } from "zod"
import toast from "react-hot-toast"
import createLabel from "src/labels/mutations/createLabel"
import getLabels from "src/labels/queries/getLabels"
import Table from "src/core/components/Table"
import { LabelInformation, lableTableColumns } from "src/labels/components/LabelTable"

export const AllLabelsList = ({ hasMore, page, labels, onChange }) => {
  const router = useRouter()

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const contributorLabelnformation = labels.map((label) => {
    const name = label.name
    const desciprition = label.description || ""
    const taxonomy = label.taxonomy || ""
    let t: LabelInformation = {
      name: name,
      description: desciprition,
      id: label.id,
      taxonomy: taxonomy,
      userId: label.userId,
      onChangeCallback: labelChanged,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={lableTableColumns} data={contributorLabelnformation} />
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
    </main>
  )
}

const LabelsTab = () => {
  const sidebarItems = HomeSidebarItems("Labels")
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  const page = Number(router.query.page) || 0

  const ITEMS_PER_PAGE = 7

  //move to label list
  const [{ labels, hasMore }, { refetch }] = usePaginatedQuery(getLabels, {
    //where: { user: { id: { equals: userId! } } },
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
      <h1 className="flex justify-center mb-2">Labels</h1>
    </main>
  )
}

export default LabelsTab
