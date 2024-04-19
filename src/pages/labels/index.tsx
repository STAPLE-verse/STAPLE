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

export const LabelFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  taxonomy: z.string().optional(),
  // template: __fieldName__: z.__zodType__(),
})

const LabelBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Labels")
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  const page = Number(router.query.page) || 0

  const ITEMS_PER_PAGE = 7
  //move to label list
  const [{ labels, hasMore }] = usePaginatedQuery(
    getLabels,
    {
      where: { userId: currentUser!.id },
    }
    // orderBy: { id: "asc" },
    // skip: ITEMS_PER_PAGE * page,
    // take: ITEMS_PER_PAGE,
  )
  console.log(labels)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  // Modal open logics
  const [openNewLabelModal, setOpenNewLabelModal] = useState(false)
  const handleToggleNewLabelModal = () => {
    setOpenNewLabelModal((prev) => !prev)
  }

  const handleCreateLabel = async (values) => {
    console.log(values)
    try {
      const label = await createLabelMutation({
        name: values.name,
        description: values.description,
        userId: currentUser!.id,
        taxonomy: values.taxanomy,
      })
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
                name={""}
                description={""}
                taxonomy={""}
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
        <Suspense fallback={<div>Loading...</div>}>
          Label creation and updating will go here
          <br />
          - make this like the task table - where you can view all Labels with a view button that
          opens a modal that allows you to edit or delete the label in case of misspellings
          <br />
          - at the bottom of the paged table have a create button that opens a modal that allows you
          to add a new Label
          <br />- new label page should have string fields for name, description, and taxonomy
        </Suspense>
      </main>
    </Layout>
  )
}

export default LabelBuilderPage
