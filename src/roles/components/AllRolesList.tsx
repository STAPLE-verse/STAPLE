import Table from "src/core/components/Table"
import { RoleInformation, roleTableColumns } from "src/roles/components/RoleTable"

export const AllRolesList = ({ roles, onChange, taxonomyList }) => {
  const roleChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const projectMemberRoleInformation = roles.map((role) => {
    const name = role.name
    const description = role.description || ""
    const taxonomy = role.taxonomy || ""

    let t: RoleInformation = {
      name: name,
      description: description,
      id: role.id,
      taxonomy: taxonomy,
      userId: role.userId,
      onChangeCallback: roleChanged,
      taxonomyList: taxonomyList,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={roleTableColumns} data={projectMemberRoleInformation} addPagination={true} />
    </main>
  )
}
