import React, { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import { useMutation } from "@blitzjs/rpc"
import { AddRoleForm } from "./AddRoleForm"
import { RoleIdsFormSchema } from "../schemas"
import updateTaskRole from "src/tasks/mutations/updateTaskRole"
import { useParam } from "@blitzjs/next"

export type Role = {
  name: string
}

export type TaskRoleInformation = {
  name?: string
  description?: string
  roles?: Role[]
  id: number
  selectedIds: number[]
  onChangeCallback?: () => void
  onMultipledAdded?: (selectedId) => void
}

const AddRolesColumn = ({ row }) => {
  const [updateTaskRoleMutation] = useMutation(updateTaskRole)
  const {
    name = "",
    description = "",
    id = null,
    checked = false,
    onChangeCallback = undefined,
    ...rest
  } = { ...row }

  const projectId = useParam("projectId", "number")
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }
  const rolesId = row.roles.map((role) => role.id)
  const initialValues = {
    rolesId: rolesId,
  }

  const handleAddRole = async (values) => {
    try {
      const updated = await updateTaskRoleMutation({
        ...values,
        tasksId: [row.id],
        disconnect: true,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding Roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div className="modal-action flex justify-start mt-4">
      <button
        type="button"
        /* button for popups */
        className="btn btn-primary"
        onClick={handleToggleEditRoleModal}
      >
        Add Role
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
  )
}

export const MultipleCheckboxColumn = ({ row }) => {
  const handleOnChange = (id) => {
    if (row.onMultipledAdded != undefined) {
      row.onMultipledAdded(id)
    }
  }

  return (
    <div>
      <span>
        {
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary border-2"
                checked={row.selectedIds.includes(row.id)}
                onChange={() => {
                  handleOnChange(row.id)
                }}
              />
            </label>
          </div>
        }
      </span>
    </div>
  )
}

const columnHelper = createColumnHelper<TaskRoleInformation>()

// ColumnDefs
export const roleTaskTableColumns = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),

  columnHelper.accessor("description", {
    id: "description",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor(
    (row) => {
      const roles = row.roles || []
      return roles.map((role) => role.name).join(", ") // Combine all role names into a single string
    },
    {
      id: "roles",
      header: "Roles",
      cell: (info) => <div>{info.getValue()}</div>,
      enableColumnFilter: true,
    }
  ),
  columnHelper.accessor("id", {
    id: "open",
    header: "Add Role",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddRolesColumn row={info.row.original}></AddRolesColumn>,
  }),

  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Add Multiple",
  }),
]
