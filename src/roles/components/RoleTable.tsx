import React, { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import { RoleForm } from "./RoleForm"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import updateRole from "../mutations/updateRole"
import deleteRole from "../mutations/deleteRole"
import { useMutation } from "@blitzjs/rpc"
import { RoleFormSchema } from "../schemas"

export type RoleInformation = {
  name: string
  description?: string
  taxonomy?: string
  id: number
  userId: number
  onChangeCallback?: () => void
  taxonomyList: string[]
  userName?: string
}

const EditColumn = ({ row }) => {
  const [updateRoleMutation] = useMutation(updateRole)
  const {
    name = "",
    description = "",
    taxonomy = "",
    userId = null,
    id = null,
    onChangeCallback = null,
    ...rest
  } = { ...row }

  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

  const initialValues = {
    name: name,
    description: description,
    taxonomy: taxonomy,
  }
  const taxonomyList = row.taxonomyList

  const handleEditRole = async (values) => {
    try {
      const updated = await updateRoleMutation({
        ...values,
        userId: userId,
        id: id,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Editing role...",
        success: "Role edited!",
        error: "Failed to edit the role...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-primary"
        onClick={handleToggleEditRoleModal}
      >
        Edit
      </button>
      <Modal open={openEditRoleModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Edit Role</h1>
          <div className="flex justify-start mt-4">
            <RoleForm
              schema={RoleFormSchema}
              submitText="Update Role"
              className="flex flex-col"
              onSubmit={handleEditRole}
              initialValues={initialValues}
              taxonomyList={taxonomyList}
              // name={""}
              // description={""}
              // taxonomy={""}
            ></RoleForm>
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
  )
}

const DeleteColumn = ({ row }) => {
  const [deleteRoleMutation] = useMutation(deleteRole)
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleDeleteRole = async (values) => {
    if (window.confirm("This role will be permanently deleted. Are you sure to continue?")) {
      try {
        const updated = await deleteRoleMutation({
          id: id,
        })
        if (onChangeCallback != undefined) {
          onChangeCallback()
        }
        await toast.promise(Promise.resolve(updated), {
          loading: "Deleting role...",
          success: "Role deleted!",
          error: "Failed to delete the role...",
        })
      } catch (error: any) {
        console.error(error)
        return {
          [FORM_ERROR]: error.toString(),
        }
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-primary"
        onClick={handleDeleteRole}
      >
        Delete
      </button>
    </div>
  )
}

const columnHelper = createColumnHelper<RoleInformation>()

// ColumnDefs
export const roleTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Role Name",
  }),

  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Taxonomy",
  }),

  columnHelper.accessor("id", {
    id: "edit",
    header: "Edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <EditColumn row={info.row.original}></EditColumn>,
  }),

  columnHelper.accessor("id", {
    id: "delete",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteColumn row={info.row.original}></DeleteColumn>,
  }),
]

export const roleTableColumnsSimple = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Role Name",
  }),

  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Taxonomy",
  }),
]

export const roleTableColumnsTeam = [
  columnHelper.accessor("userName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "User Name",
  }),
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Role Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Taxonomy",
  }),
]
