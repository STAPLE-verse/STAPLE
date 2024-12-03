import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useTaskContext } from "./TaskContext"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import Stat from "src/core/components/Stat"

export const TaskFormData = () => {
  const { task } = useTaskContext()

  return (
    <Stat title="Form Data" tooltipContent="Review the form requirements for this task">
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
    </Stat>
  )
}
