import { useQuery } from "@blitzjs/rpc"
import getFormDeployments from "src/forms/queries/getFormDeployments"

type Props = {
  formId: number
}

export default function FormDeployments({ formId }: Props) {
  const [deployments] = useQuery(getFormDeployments, { formId })

  if (deployments.length === 0) {
    return (
      <p className="text-md italic text-base-content/80">
        This form has not been assigned to any tasks or projects yet.
      </p>
    )
  }

  return (
    <table className="table w-full">
      <thead className="text-xl text-base-content">
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Project</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {deployments.map((d, i) => (
          <tr key={i}>
            <td>{d.name}</td>
            <td>
              <span
                className={`badge badge-sm ${
                  d.type === "task" ? "badge-primary" : "badge-secondary"
                }`}
              >
                {d.type}
              </span>
            </td>
            <td>{d.projectName ?? "—"}</td>
            <td>v{d.version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
