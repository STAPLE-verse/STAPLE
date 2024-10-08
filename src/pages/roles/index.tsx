import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Modal from "src/core/components/Modal"
import { RoleForm } from "src/roles/components/RoleForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import createRole from "src/roles/mutations/createRole"
import getRoles from "src/roles/queries/getRoles"
import { RoleFormSchema } from "src/roles/schemas"
import { AllRolesList } from "src/roles/components/AllRolesList"

const RoleBuilderPage = () => {
  const currentUser = useCurrentUser()
  const [createRoleMutation] = useMutation(createRole)
  //Only show roles that belongs to current user
  const [{ roles }, { refetch }] = useQuery(getRoles, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }
  const uniqueValues = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const taxonomyList = roles
    .map((role) => {
      const taxonomy = role.taxonomy || ""
      return taxonomy
    })
    .filter(uniqueValues)

  // Modal open logics
  const [openNewRoleModal, setOpenNewRoleModal] = useState(false)
  const handleToggleNewRoleModal = () => {
    setOpenNewRoleModal((prev) => !prev)
  }

  const initialValues = {
    name: "",
    description: "",
    taxonomy: " ",
  }

  const handleCreateRole = async (values) => {
    try {
      const role = await createRoleMutation({
        name: values.name,
        description: values.description,
        userId: currentUser!.id,
        taxonomy: values.taxonomy,
      })
      await reloadTable()
      await toast.promise(Promise.resolve(role), {
        loading: "Creating role...",
        success: "Role created!",
        error: "Failed to create the role...",
      })
      handleToggleNewRoleModal()
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
            <AllRolesList roles={roles} onChange={reloadTable} taxonomyList={taxonomyList} />
          </Suspense>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => handleToggleNewRoleModal()}
          >
            New Role
          </button>
        </div>

        <Modal open={openNewRoleModal} size="w-1/3 max-w-1/2">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Create New Role</h1>
            <div className="flex justify-start mt-4">
              <RoleForm
                schema={RoleFormSchema}
                submitText="Create Role"
                className="flex flex-col w-full"
                onSubmit={handleCreateRole}
                initialValues={initialValues}
                taxonomyList={taxonomyList}
              ></RoleForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-secondary"
                onClick={handleToggleNewRoleModal}
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

export default RoleBuilderPage
