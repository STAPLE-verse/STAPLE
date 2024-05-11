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
import { LabelInformation, lableTableColumns } from "src/labels/components/LabelTable"
import { LabelFormSchema } from "src/labels/schemas"

export const AllLabelsList = ({ hasMore, page, labels, onChange, taxonomyList }) => {
  const router = useRouter()

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const uniqueValues = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  // const taxonomyList = labels
  //   .map((label) => {
  //     const taxonomy = label.taxonomy || ""
  //     return taxonomy
  //   })
  //   .filter(uniqueValues)

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
      taxonomyList: taxonomyList,
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

const LabelBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Labels")
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  const page = Number(router.query.page) || 0

  const ITEMS_PER_PAGE = 7
  console.log(currentUser)

  //Only show labels that belongs to current user
  const [{ labels, hasMore }, { refetch }] = usePaginatedQuery(getLabels, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const reloadTable = async () => {
    await refetch()
  }
  const uniqueValues = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const taxonomyList = labels
    .map((label) => {
      const taxonomy = label.taxonomy || ""
      return taxonomy
    })
    .filter(uniqueValues)

  // Modal open logics
  const [openNewLabelModal, setOpenNewLabelModal] = useState(false)
  const handleToggleNewLabelModal = () => {
    setOpenNewLabelModal((prev) => !prev)
  }

  const initialValues = {
    name: "",
    description: "",
    taxonomy: " ",
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
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Contribution Labels</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Labels</h1>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <AllLabelsList
              page={page}
              labels={labels}
              hasMore={hasMore}
              onChange={reloadTable}
              taxonomyList={taxonomyList}
            />
          </Suspense>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-primary w-full max-w-sm"
          onClick={() => handleToggleNewLabelModal()}
        >
          New Label
        </button>

        <Modal open={openNewLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2">Creating new label</h1>
            <div className="flex justify-start mt-4">
              <LabelForm
                schema={LabelFormSchema}
                submitText="Create Label"
                className="flex flex-col"
                onSubmit={handleCreateLabel}
                initialValues={initialValues}
                // name={""}
                // description={""}
                // taxonomy={""}
                taxonomyList={taxonomyList}
              ></LabelForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-outline btn-primary"
                onClick={handleToggleNewLabelModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* <Suspense fallback={<div>Loading...</div>}>
          Label creation and updating will go here
          <br />
          - make this like the task table - where you can view all Labels with a view button that
          opens a modal that allows you to edit or delete the label in case of misspellings
          <br />
          - at the bottom of the paged table have a create button that opens a modal that allows you
          to add a new Label
          <br />- new label page should have string fields for name, description, and taxonomy
        </Suspense> */}
      </main>
    </Layout>
  )
}

export default LabelBuilderPage
