import { useMutation } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import importDefaultRoles from "../mutations/importDefaultRoles"
import { useState } from "react"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import { Form } from "react-final-form"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import { defaultRoleTemplates } from "../templates/defaultRoles"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"

interface DefaultRolesProps {
  onRolesChanged?: () => void
}

export const DefaultRoles = ({ onRolesChanged }: DefaultRolesProps) => {
  const currentUser = useCurrentUser()
  const [importDefaultRolesMutation] = useMutation(importDefaultRoles)
  const [openImportModal, setOpenImportModal] = useState(false)

  const handleToggleImportModal = () => {
    setOpenImportModal((prev) => !prev)
  }

  const options = defaultRoleTemplates.map((template, index) => ({
    id: index,
    label: template.label,
  }))

  const extraData = defaultRoleTemplates.map((template) => ({
    link: template.link,
  }))

  const extraColumns = [
    {
      id: "link",
      header: "Link",
      accessorKey: "link",
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="link">
          {info.getValue()}
        </a>
      ),
    },
  ]

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={handleToggleImportModal}>
        Import Default Roles
      </button>

      <Modal open={openImportModal} size="w-1/3 max-w-1/2">
        <Form
          onSubmit={async (values) => {
            const selectedIndex = values.defaultRoleForm?.[0]
            if (typeof selectedIndex !== "number") return
            const system = [defaultRoleTemplates[selectedIndex]!.id]
            try {
              await importDefaultRolesMutation({ system, userId: currentUser!.id })
              toast.success("Default roles imported!")
              setOpenImportModal(false)
              if (onRolesChanged) onRolesChanged()
            } catch (error: any) {
              toast.error("Failed to import default roles.")
              console.error(error)
            }
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-4 text-2xl font-bold text-center">Import Default Roles</h1>
              <div className="flex flex-col gap-2">
                <CheckboxFieldTable
                  name="defaultRoleForm"
                  options={options}
                  extraColumns={extraColumns}
                  extraData={extraData}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="submit" className="btn btn-primary">
                  Import Selected
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleToggleImportModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        />
      </Modal>
    </>
  )
}
