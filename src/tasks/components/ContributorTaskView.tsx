// imports
import { useQuery, useMutation } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import { useParam } from "@blitzjs/next"
import getUsers from "src/users/queries/getUsers"
import getAssignments from "src/assignments/queries/getAssignments"
import AssignmentHistoryModal from "src/assignments/components/AssignmentHistoryModal"
import getContributor from "src/contributors/queries/getContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import CompleteToggle from "src/assignments/components/CompleteToggle"
import { CompletedAs, TaskStatus, AssignmentStatus } from "@prisma/client"
import { useState } from "react"
import Modal from "src/core/components/Modal"
import JsonForm from "src/assignments/components/JsonForm"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import updateAssignment from "src/assignments/mutations/updateAssignment"
import updateTaskStatus from "src/tasks/mutations/updateTaskStatus"

// create task view
export const ContributorTaskView = () => {
  const currentUser = useCurrentUser()
  const projectId = useParam("projectId", "number")
  const taskId = useParam("taskId", "number")
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })
  const [pm] = useQuery(getUsers, {
    where: { id: task.createdById },
  })
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const [taskStatus, setTaskStatus] = useState(task.status)
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)

  // Get assignments for the task
  // If someone is assigned as an individual AND as a Team member it is possible to have multiple assignments for the same person for the task
  const [currentAssignments, { refetch: refetchCurrentAssignments }] = useQuery(getAssignments, {
    where: {
      taskId: taskId,
      // Get only assignments for the current contributor
      OR: [
        { contributorId: currentContributor.id }, // Direct assignments to the contributor
        { team: { contributors: { some: { id: currentContributor.id } } } }, // Assignments to teams that include the contributor
      ],
    },
    include: {
      contributor: true,
      team: true,
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    // Keeping the ordering so that completeToggle button order does not change on refetch
    orderBy: {
      id: "asc",
    },
  })

  // Filter out individual assignments
  const individualAssignments = currentAssignments.filter(
    (assignment) => assignment.contributorId !== null
  )

  // Filter out team assignments
  const teamAssignments = currentAssignments.filter((assignment) => assignment.teamId !== null)

  const refetchAssignments = async () => {
    await refetchCurrentAssignments()
    //await refetchAssignmentProgress()
  }

  // Handle metadata input
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }
  const handleJsonFormSubmit = async (data) => {
    if (currentAssignments) {
      // Users can overwrite their responses
      // user can have multiple assignments
      currentAssignments.forEach(async (currentAssignment) => {
        await updateAssignmentMutation({
          id: currentAssignment.id,
          metadata: data.formData,
          status: AssignmentStatus.COMPLETED,
          completedBy: currentContributor.id,
          completedAs: currentAssignment.statusLogs[0].completedAs,
        })
      })

      await handleToggle()
      await refetchAssignments()
    } else {
      console.error("currentAssignment is undefined")
    }
  }
  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <div className="card bg-base-300 mx-2 w-1/2">
        <div className="card-body">
          <div className="card-title">Task Information</div>

          <p>
            <span className="font-semibold">Name: </span> {task.name}
          </p>

          <p>
            <span className="font-semibold">Deadline:</span>{" "}
            {task.deadline
              ? task.deadline.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // Use 24-hour format
                })
              : "No Deadline"}
          </p>

          <p>
            <span className="font-semibold">Description:</span> {task.description}
          </p>

          <p>
            <span className="font-semibold">Column:</span> {task["column"].name}
          </p>

          <p>
            <span className="font-semibold">Element:</span>{" "}
            {task["element"] ? task["element"].name : "No element"}
          </p>

          <p>
            <span className="font-semibold">Created by:</span> {pm[0].username}
          </p>

          <p className="italic">
            Last update:{" "}
            {task.updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // Use 24-hour format
            })}
          </p>
        </div>
      </div>

      {/* task completion*/}
      <div className="card bg-base-300 mx-2 w-1/2">
        <div className="card-body">
          <div className="card-title">Complete Task</div>

          {/* if no schema complete task as a Individual*/}
          {!task["schema"] && currentAssignments && individualAssignments.length > 0 && (
            <div>
              <CompleteToggle
                currentAssignment={individualAssignments[0]!.statusLogs[0]}
                refetch={refetchAssignments}
                completedLabel="Completed"
                completedBy={currentContributor.id}
                completedAs={CompletedAs.INDIVIDUAL}
              />
              <AssignmentHistoryModal assignmentStatusLog={individualAssignments[0]!.statusLogs} />
            </div>
          )}

          {/* if no schema complete task as a Team*/}
          {!task["schema"] && currentAssignments && teamAssignments.length > 0 && (
            <div className="flex flex-col gap-2">
              {teamAssignments.map((teamAssignment) => (
                <div key={teamAssignment.id}>
                  <CompleteToggle
                    currentAssignment={teamAssignment.statusLogs[0]}
                    refetch={refetchAssignments}
                    completedLabel={`Completed as ${teamAssignment.team.name} Team`}
                    completedBy={currentContributor.id}
                    completedAs={CompletedAs.TEAM}
                  />
                  <AssignmentHistoryModal assignmentStatusLog={teamAssignment.statusLogs} />
                </div>
              ))}
            </div>
          )}

          {/* if schema and individual*/}
          {task["schema"] && currentAssignments && individualAssignments.length > 0 && (
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => handleToggle()}>
                {individualAssignments[0].statusLogs[0].status === "COMPLETED" &&
                  "Update Individual Data"}
                {individualAssignments[0].statusLogs[0].status === "NOT_COMPLETED" &&
                  "Provide Individual Data"}
              </button>
              <Modal open={openAssignmentModal} size="w-11/12 max-w-5xl">
                <div className="font-sans">
                  {
                    <JsonForm
                      onSubmit={handleJsonFormSubmit}
                      schema={getJsonSchema(task["schema"])}
                      onError={handleJsonFormError}
                      uiSchema={task["ui"]}
                    />
                  }
                </div>
                <div className="modal-action">
                  <button className="btn btn-primary" onClick={handleToggle}>
                    Save
                  </button>
                </div>
              </Modal>
            </div>
          )}

          {/* if schema and team*/}
          {task["schema"] && currentAssignments && teamAssignments.length > 0 && (
            <div className="mt-2">
              {teamAssignments.map((teamAssignment) => (
                <div key={teamAssignment.id}>
                  <button className="btn btn-primary mb-4" onClick={() => handleToggle()}>
                    {teamAssignment.statusLogs[0].status === "COMPLETED" &&
                      `Update ${teamAssignment.team.name} Data`}
                    {teamAssignment.statusLogs[0].status === "NOT_COMPLETED" &&
                      `Provide ${teamAssignment.team.name} Data`}
                  </button>
                  <Modal open={openAssignmentModal} size="w-11/12 max-w-5xl">
                    <div className="font-sans">
                      {
                        <JsonForm
                          onSubmit={handleJsonFormSubmit}
                          schema={getJsonSchema(task["schema"])}
                          onError={handleJsonFormError}
                          uiSchema={task["ui"]}
                        />
                      }
                    </div>
                    <div className="modal-action">
                      <button className="btn btn-primary" onClick={handleToggle}>
                        Save
                      </button>
                    </div>
                  </Modal>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
