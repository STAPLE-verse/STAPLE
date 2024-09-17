export const RolesColumn = ({ row }) => {
  const roles = row.roles || []

  const text = roles.map((role) => role.name).join("<br>") // Join roles with a newline character

  return <div dangerouslySetInnerHTML={{ __html: text }}></div>
}
