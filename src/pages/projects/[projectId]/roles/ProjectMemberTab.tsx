import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"

import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import {
  ProjectMemberRoleInformation,
  roleProjectMemberTableColumns,
} from "src/roles/components/RoleProjectMemberTable"

import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { AddRoleForm } from "src/roles/components/AddRoleForm"
import { RoleIdsFormSchema } from "src/roles/schemas"
import updateProjectMemberRole from "src/projectmembers/mutations/updateProjectMemberRole"

export const AllProjectMemberRolesList = ({ projectMembers, onChange }) => {
  const [updateProjectMemberRoleMutation] = useMutation(updateProjectMemberRole)
  const projectId = useParam("projectId", "number")

  const roleChanged = async () => {
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

  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

  const handleAddRole = async (values) => {
    try {
      const updated = await updateProjectMemberRoleMutation({
        ...values,
        projectMembersId: selectedIds,
        disconnect: false,
      })
      await roleChanged()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to contributors...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
      handleToggleEditRoleModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const initialValues = {
    rolesId: [],
  }

  const taskInformation = projectMembers.map((projectMember) => {
    const name = projectMember.user.username
    const lastname = projectMember.user.lastName
    const firstName = projectMember.user.firstName

    //TODO merge with task information tab
    let t: ProjectMemberRoleInformation = {
      username: name,
      firstname: firstName,
      lastname: lastname,
      id: projectMember.id,
      roles: projectMember.roles,
      onChangeCallback: roleChanged,
      selectedIds: selectedIds,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = projectMembers.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={roleProjectMemberTableColumns} data={taskInformation} addPagination={true} />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          onClick={handleToggleEditRoleModal}
          disabled={hasElements}
        >
          Add Multiple
        </button>

        <Modal open={openEditRoleModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
            <div className="flex justify-start mt-4">
              <AddRoleForm
                projectId={projectId}
                schema={RoleIdsFormSchema}
                submitText="Update Role"
                className="flex flex-col"
                onSubmit={handleAddRole}
                initialValues={initialValues}
              ></AddRoleForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-secondary"
                onClick={handleToggleEditRoleModal}
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

const ProjectMembersTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ projectMembers }, { refetch }] = useQuery(getProjectMembers, {
    where: { project: { id: projectId! } },
    include: { user: true, roles: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllProjectMemberRolesList projectMembers={projectMembers} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default ProjectMembersTab
