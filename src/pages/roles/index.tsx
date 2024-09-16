import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Modal from "src/core/components/Modal"
import { LabelForm } from "src/labels/components/LabelForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import createLabel from "src/labels/mutations/createLabel"
import getLabels from "src/labels/queries/getLabels"
import { LabelFormSchema } from "src/labels/schemas"
import { AllLabelsList } from "src/labels/components/AllLabelsList"

const LabelBuilderPage = () => {
  const currentUser = useCurrentUser()
  const [createLabelMutation] = useMutation(createLabel)
  //Only show labels that belongs to current user
  const [{ labels }, { refetch }] = useQuery(getLabels, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
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
    <Layout>
      <Head>
        <title>Contribution Roles</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">All Roles</h1>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <AllLabelsList labels={labels} onChange={reloadTable} taxonomyList={taxonomyList} />
          </Suspense>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => handleToggleNewLabelModal()}
          >
            New Role
          </button>
        </div>

        <Modal open={openNewLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Create New Role</h1>
            <div className="flex justify-start mt-4">
              <LabelForm
                schema={LabelFormSchema}
                submitText="Create Role"
                className="flex flex-col"
                onSubmit={handleCreateLabel}
                initialValues={initialValues}
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
