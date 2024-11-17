import { Tooltip } from "react-tooltip"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useTaskContext } from "./TaskContext"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { JsonFormModal } from "src/core/components/JsonFormModal"

export const TaskFormData = () => {
  const { task } = useTaskContext()

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="form-tool">
        Form Data
      </div>
      <Tooltip
        id="form-tool"
        content="Review the form requirements for this task"
        className="z-[1099] ourtooltips"
      />
      <div>
        {task.formVersion ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center mb-4">
              <JsonFormModal
                schema={getJsonSchema(task.formVersion.schema)}
                uiSchema={task.formVersion.uiSchema}
                label="Preview Required Form"
                classNames="btn-primary"
                submittable={false} // Ensures the form is not submittable
              />
            </div>
            <div className="flex justify-center mt-2">
              <Link
                className="btn btn-info mt-2"
                href={Routes.ShowMetadataPage({
                  projectId: task.projectId,
                  taskId: task.id,
                })}
              >
                Download Form Data
              </Link>
            </div>
          </div>
        ) : (
          "No Form Data Required"
        )}
      </div>
    </div>
  )
}
