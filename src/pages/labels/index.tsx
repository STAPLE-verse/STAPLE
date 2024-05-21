import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Modal from "src/core/components/Modal"
import { LabelForm, FORM_ERROR } from "src/labels/components/LabelForm"
import { number, z } from "zod"
import toast from "react-hot-toast"
import createLabel from "src/labels/mutations/createLabel"
import getLabels from "src/labels/queries/getLabels"
import { LabelFormSchema } from "src/labels/schemas"
import { AllLabelsList } from "src/labels/components/AllLabelsList"

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
        <h1 className="flex justify-center mb-2 text-3xl">All Labels</h1>
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
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleToggleNewLabelModal()}
          >
            New Label
          </button>
        </div>

        <Modal open={openNewLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Create New Label</h1>
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
                className="btn btn-secondary"
                onClick={handleToggleNewLabelModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </Layout>
  )
}

export default LabelBuilderPage
